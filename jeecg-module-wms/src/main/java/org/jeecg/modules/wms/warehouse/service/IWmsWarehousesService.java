package org.jeecg.modules.wms.warehouse.service;

import org.jeecg.modules.wms.warehouse.entity.WmsWarehouses;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 冷库表
 * @Author: jeecg-boot
 * @Date:   2026-09-16
 * @Version: V1.0
 */
public interface IWmsWarehousesService extends IService<WmsWarehouses> {

    void add(WmsWarehouses wmsWarehouses);

    void edit(WmsWarehouses wmsWarehouses);

    void enable(String id);

    void disable(String id);
}
