package org.jeecg.modules.wms.goods.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.wms.goods.entity.WmsProductCategories;
import org.jeecg.modules.wms.goods.mapper.WmsProductCategoriesMapper;
import org.jeecg.modules.wms.goods.service.IWmsProductCategoriesService;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 农产品类别表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Service
public class WmsProductCategoriesServiceImpl extends ServiceImpl<WmsProductCategoriesMapper, WmsProductCategories> implements IWmsProductCategoriesService {

    @Override
    public void add(WmsProductCategories wmsProductCategories) {
        // 新增子节点时，将父节点标记为“有子节点”
        if (oConvertUtils.isNotEmpty(wmsProductCategories.getParentId())
                && !"-1".equals(wmsProductCategories.getParentId())) {
            WmsProductCategories parent = new WmsProductCategories();
            parent.setId(wmsProductCategories.getParentId());
            parent.setHasChild("1");
            this.updateById(parent);
        } else {
            wmsProductCategories.setParentId("-1");
        }
        if (oConvertUtils.isEmpty(wmsProductCategories.getHasChild())) {
            wmsProductCategories.setHasChild("0");
        }
        if (oConvertUtils.isEmpty(wmsProductCategories.getStatus())) {
            wmsProductCategories.setStatus("1");
        }
        this.save(wmsProductCategories);
    }

    @Override
    public List<WmsProductCategories> queryTreeList() {
        List<WmsProductCategories> all = this.list();
        Map<String, List<WmsProductCategories>> childrenMap = new HashMap<>();
        for (WmsProductCategories item : all) {
            String pid = item.getParentId();
            if (oConvertUtils.isEmpty(pid)) {
                continue;
            }
            childrenMap.computeIfAbsent(pid, k -> new ArrayList<>()).add(item);
        }
        List<WmsProductCategories> roots = new ArrayList<>();
        for (WmsProductCategories item : all) {
            item.setChildren(childrenMap.get(item.getId()));
            String pid = item.getParentId();
            if (oConvertUtils.isEmpty(pid) || "-1".equals(pid)) {
                roots.add(item);
            }
        }
        return roots;
    }
}
