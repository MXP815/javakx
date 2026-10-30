package org.jeecg.modules.wms.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.PageDTO;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.jeecg.modules.wms.inventory.entity.WmsInventory;
import org.jeecg.modules.wms.inventory.mapper.WmsInventoryMapper;
import org.jeecg.modules.wms.inventory.service.IWmsInventoryService;
import org.jeecg.modules.wms.outorder.entity.WmsOutOrdersItems;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.List;

/**
 * @Description: 库存表
 * @Author: jeecg-boot
 * @Date:   2026-10-08
 * @Version: V1.0
 */
@Service
public class WmsInventoryServiceImpl extends ServiceImpl<WmsInventoryMapper, WmsInventory> implements IWmsInventoryService {

    @Override
    public WmsInventory getInventoryByUniqueKey(String productId, String locationCode, String batchNumber) {
        return getOne(new LambdaQueryWrapper<WmsInventory>()
                .eq(WmsInventory::getProductId, productId)
                .eq(WmsInventory::getLocationCode, locationCode)
                // 有批号：按批号查
                .eq(StringUtils.isNotEmpty(batchNumber), WmsInventory::getBatchNumber, batchNumber)
                // 无批号：查空字符串（对应 DB 里 batch_number DEFAULT ''）
                .eq(StringUtils.isEmpty(batchNumber), WmsInventory::getBatchNumber, "")
        );
    }

    @Override
    public IPage<WmsInventory> queryList(WmsInventory wmsInventory, Integer pageNo, Integer pageSize) {
        // 开启分页，后一条查询会被自动加上 limit
        Page<WmsInventory> page = PageHelper.startPage(pageNo, pageSize);
        List<WmsInventory> list = baseMapper.queryList(wmsInventory);
        // 手工把 Page 里的数据塞进 IPage 返回给前端
        PageDTO<WmsInventory> dto = new PageDTO<>();
        dto.setRecords(list);
        dto.setTotal(page.getTotal());
        dto.setSize(page.getPageSize());
        dto.setCurrent(page.getPageNum());
        dto.setPages(page.getPages());
        return dto;
    }

    @Override
    public List<WmsInventory> selectAvailableBySku(String warehouseId, WmsOutOrdersItems skuItem) {
        /**
         *"SELECT * FROM wms_inventory " +
         *             "WHERE is_sellable = '1' and product_id = #{skuId} " +
         *             "AND available_quantity > 0 " +
         *             "AND batch_number = #{batchNo} " +
         *             "AND warehouse_id = #{warehouseId} " +
         *             "ORDER BY expiry_date ASC, stock_in_time ASC")
         */
        //使用MybatisPlus的查询条件
        LambdaQueryWrapper<WmsInventory> queryWrapper = new LambdaQueryWrapper<>();
        //可售库存
        queryWrapper.eq(WmsInventory::getIsSellable, "1");
        queryWrapper.eq(WmsInventory::getProductId, skuItem.getSkuId());
        //如果有批次号是针对某批次的农产品进行出库
        queryWrapper.eq(StringUtils.isNotEmpty( skuItem.getBatchNumber()),WmsInventory::getBatchNumber, skuItem.getBatchNumber());
        queryWrapper.gt(WmsInventory::getAvailableQuantity, 0);
        //冷库id
        queryWrapper.eq(WmsInventory::getWarehouseId, warehouseId);
        //保鲜期到期日升序，入库时间升序
        queryWrapper.orderByAsc(WmsInventory::getExpiryDate).orderByAsc(WmsInventory::getStockInTime);
        return baseMapper.selectList(queryWrapper);
    }
}
