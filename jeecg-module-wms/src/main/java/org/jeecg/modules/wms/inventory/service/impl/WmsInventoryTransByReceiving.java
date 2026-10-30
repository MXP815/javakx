package org.jeecg.modules.wms.inventory.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.jeecg.modules.wms.goods.entity.WmsProducts;
import org.jeecg.modules.wms.goods.service.IWmsProductsService;
import org.jeecg.modules.wms.inventory.entity.WmsInventory;
import org.jeecg.modules.wms.inventory.entity.WmsInventoryTrans;
import org.jeecg.modules.wms.inventory.mapper.WmsInventoryTransMapper;
import org.jeecg.modules.wms.inventory.service.IWmsInventoryService;
import org.jeecg.modules.wms.inventory.service.IWmsInventoryTransService;
import org.jeecg.modules.wms.inventory.vo.WmsInventoryTransParam;
import org.jeecg.modules.wms.warehouse.entity.WmsStorageLocations;
import org.jeecg.modules.wms.warehouse.service.IWmsStorageLocationsService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 【收货库存流转】收货任务完成后写入/累加库存
 */
@Service
public class WmsInventoryTransByReceiving
        extends ServiceImpl<WmsInventoryTransMapper, WmsInventoryTrans>
        implements IWmsInventoryTransService {
    @Autowired
    private IWmsInventoryService wmsInventoryService;

    @Autowired
    private IWmsStorageLocationsService wmsStorageLocationsService;

    @Autowired
    private IWmsProductsService wmsProductsService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void transfer(WmsInventoryTransParam param) {

        // ============ 第一步：基础校验 ============
        // 1. 必填项校验
        if (StringUtils.isEmpty(param.getTargetLocationCode())
                || StringUtils.isEmpty(param.getProductId())
                || param.getExecQuantity() == null
                || StringUtils.isEmpty(param.getIsSellable())) {
            throw new RuntimeException("目标货位、产品id、执行数量、是否可售不能为空");
        }

        // 2. 校验农产品存在（同时拿 ownerId）
        WmsProducts products = wmsProductsService.getById(param.getProductId());
        if (products == null) {
            throw new RuntimeException("产品id在农产品表中不存在");
        }

        // 3. 校验货位存在（防止放到"幽灵货位"）
        WmsStorageLocations location = wmsStorageLocationsService.getBaseMapper()
                .selectOne(new LambdaQueryWrapper<WmsStorageLocations>()
                        .eq(WmsStorageLocations::getLocationCode, param.getTargetLocationCode()));
        if (location == null) {
            throw new RuntimeException("货位编码在货位表中不存在");
        }

        // ============ 第二步：定位库存记录 ============
        String isSellable = param.getIsSellable();
        WmsInventory inventory = wmsInventoryService.getInventoryByUniqueKey(
                param.getProductId(), param.getTargetLocationCode(), param.getBatchNumber());

        if (inventory == null) {
            // ============ 情况A：首次入库 → 新增 ============
            inventory = new WmsInventory();
            // 先把同名属性拷过来（batchNumber / expiryDate）
            BeanUtils.copyProperties(param, inventory);

            inventory.setOwnerId(products.getOwnerId());
            inventory.setLocationCode(param.getTargetLocationCode());
            inventory.setWarehouseId(param.getWarehouseId());
            inventory.setStockQuantity(param.getExecQuantity());          // 在库数量
            inventory.setAllocatedQuantity(0);                            // 分配数量不动 = 0
            // ★ 核心规则：不良品可用数量为 0
            inventory.setAvailableQuantity(
                    "1".equals(isSellable) ? param.getExecQuantity() : 0);
            inventory.setIsSellable(isSellable);
            inventory.setStockInTime(param.getOperationTime());

            wmsInventoryService.save(inventory);
        } else {
            // ============ 情况B：已有库存 → 原子累加 ============
            // ★ 严禁 "查出来 +n → set回去"，并发会丢数据
            LambdaUpdateWrapper<WmsInventory> wrapper = new LambdaUpdateWrapper<>();
            wrapper.eq(WmsInventory::getId, inventory.getId())
                    .setSql("stock_quantity = stock_quantity + {0}", param.getExecQuantity())
                    // 只有可售品才增加可用数量，不良品保持 0
                    .setSql("1".equals(isSellable),
                            "available_quantity = available_quantity + {0}", param.getExecQuantity());
            wmsInventoryService.update(null, wrapper);
        }
    }

}
