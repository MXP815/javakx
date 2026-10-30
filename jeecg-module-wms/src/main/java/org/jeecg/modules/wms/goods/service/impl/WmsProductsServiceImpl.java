package org.jeecg.modules.wms.goods.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.jeecg.modules.wms.goods.entity.WmsCargoOwners;
import org.jeecg.modules.wms.goods.entity.WmsProducts;
import org.jeecg.modules.wms.goods.excel.WmsProductsImport;
import org.jeecg.modules.wms.goods.mapper.WmsProductsMapper;
import org.jeecg.modules.wms.goods.service.IWmsCargoOwnersService;
import org.jeecg.modules.wms.goods.service.IWmsProductsService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.List;

/**
 * @Description: 农产品信息表
 * @Author: jeecg-boot
 * @Date:   2026-10-08
 * @Version: V1.0
 */
@Service
public class WmsProductsServiceImpl extends ServiceImpl<WmsProductsMapper, WmsProducts> implements IWmsProductsService {

    @Autowired
    private IWmsCargoOwnersService wmsCargoOwnersService;
    @Autowired
    private IWmsProductsService wmsProductsService;

    @Override
    public void importProduct(List<WmsProductsImport> wmsProductsImportList) {
        for (WmsProductsImport wmsProductsImport : wmsProductsImportList){
            WmsProducts products = convertWmsProducts(wmsProductsImport);
            wmsProductsService.save(products);
        }
    }

    private WmsProducts convertWmsProducts(WmsProductsImport wmsProductsImport) {
        WmsProducts wmsProducts = new WmsProducts();
        BeanUtils.copyProperties(wmsProductsImport,wmsProducts);
        //处理名称
        //供应商名称
        String ownerName = wmsProductsImport.getOwnerName();
        //根据供应商名称查询供应商
        LambdaQueryWrapper<WmsCargoOwners> eq = new LambdaQueryWrapper<WmsCargoOwners>()
                .eq(WmsCargoOwners::getOwnerName, ownerName);
        WmsCargoOwners wmsCargoOwners = wmsCargoOwnersService.getOne(eq);
        wmsProducts.setOwnerId(wmsCargoOwners.getId());
        //这里仅仅导入农产品信息
        return wmsProducts;
    }
}
