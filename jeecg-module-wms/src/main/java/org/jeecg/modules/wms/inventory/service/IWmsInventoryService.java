package org.jeecg.modules.wms.inventory.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import org.jeecg.modules.wms.inventory.entity.WmsInventory;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.wms.outorder.entity.WmsOutOrdersItems;

import java.util.List;

/**
 * @Description: 库存表
 * @Author: jeecg-boot
 * @Date:   2026-10-08
 * @Version: V1.0
 */
public interface IWmsInventoryService extends IService<WmsInventory> {

    /**
     * 根据唯一键（产品id + 货位编码 + 批号）获取库存
     */
    public WmsInventory getInventoryByUniqueKey(String productId, String locationCode, String batchNumber);

    /**
     * 分页综合查询库存列表
     */
    IPage<WmsInventory> queryList(WmsInventory wmsInventory, Integer pageNo, Integer pageSize);

    /**
     * 查询可用库存
     * @param warehouseId 冷库id
     * @param  skuItem sku信息
     */
    public List<WmsInventory> selectAvailableBySku(String warehouseId, WmsOutOrdersItems skuItem);


}
