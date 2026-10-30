package org.jeecg.modules.wms.goods.service;

import org.jeecg.modules.wms.goods.entity.WmsCargoOwners;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 供应商表
 * @Author: jeecg-boot
 * @Date:   2026-09-15
 * @Version: V1.0
 */
public interface IWmsCargoOwnersService extends IService<WmsCargoOwners> {

    void add(WmsCargoOwners wmsCargoOwners);
}
