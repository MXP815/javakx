package org.jeecg.modules.wms.goods.service;

import org.jeecg.modules.wms.goods.entity.WmsProducts;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.wms.goods.excel.WmsProductsImport;

import java.util.List;

/**
 * @Description: 农产品信息表
 * @Author: jeecg-boot
 * @Date:   2026-10-08
 * @Version: V1.0
 */
public interface IWmsProductsService extends IService<WmsProducts> {

    void importProduct(List<WmsProductsImport> cachedDataList);
}
