package org.jeecg.modules.wms.goods.service;

import java.util.List;
import org.jeecg.modules.wms.goods.entity.WmsProductCategories;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * @Description: 农产品类别表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
public interface IWmsProductCategoriesService extends IService<WmsProductCategories> {

    /**
     * 新增类别（自动维护父节点 hasChild）
     */
    void add(WmsProductCategories wmsProductCategories);

    /**
     * 查询全部并组装为树形结构
     */
    List<WmsProductCategories> queryTreeList();
}
