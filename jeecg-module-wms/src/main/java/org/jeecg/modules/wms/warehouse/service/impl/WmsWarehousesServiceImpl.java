package org.jeecg.modules.wms.warehouse.service.impl;

import com.aliyun.oss.ServiceException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.modules.wms.config.WarehouseDictEnum;
import org.jeecg.modules.wms.warehouse.entity.WmsWarehouses;
import org.jeecg.modules.wms.warehouse.mapper.WmsWarehousesMapper;
import org.jeecg.modules.wms.warehouse.service.IWmsWarehousesService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.util.StringUtils;

/**
 * @Description: 冷库表
 * @Author: jeecg-boot
 * @Date:   2026-09-16
 * @Version: V1.0
 */
@Service
public class WmsWarehousesServiceImpl extends ServiceImpl<WmsWarehousesMapper, WmsWarehouses> implements IWmsWarehousesService {

    @Override
    public void add(WmsWarehouses wmsWarehouses) {
        // 先查询 如果不存在才真正的保存到数据库中
        LambdaQueryWrapper<WmsWarehouses> queryWrapper = new LambdaQueryWrapper<WmsWarehouses>()
                .eq(WmsWarehouses::getWarehouseCode, wmsWarehouses.getWarehouseCode());
        // 如果找到的数量大于0 就说明存在
        if(count(queryWrapper)>0){
            throw new RuntimeException("冷库代码已存在");
        }
        //因为这里是创建冷库，所以需要修改冷库的创建code为已创建
        wmsWarehouses.setStatus(WarehouseDictEnum.STATUS_CREATED.getCode());
        save(wmsWarehouses);
    }

    @Override
    public void edit(WmsWarehouses wmsWarehouses) {
        // 根据 冷库代码 进行查询 如果可以查到就代表已存在 排除自己冷库代码
        LambdaUpdateWrapper<WmsWarehouses> ne = new LambdaUpdateWrapper<WmsWarehouses>()
                .eq(WmsWarehouses::getWarehouseCode, wmsWarehouses.getWarehouseCode())
                .ne(WmsWarehouses::getId, wmsWarehouses.getId());
        // 如果查询到的>0
        if(count(ne)>0){
            throw new RuntimeException("冷库代码已存在");
        }
        // 重新更新
        updateById(wmsWarehouses);

    }

    @Override
    public void enable(String id) {

        //修改状态 重新保存到数据库中
        WmsWarehouses wmsWarehouses = getById(id);
        // 参数为空判定
        if(StringUtils.isEmpty(id)){
            throw new RuntimeException("参数为空");
        }
        if(wmsWarehouses==null){
            throw new RuntimeException("冷库不存在");
        }
        if (!WarehouseDictEnum.STATUS_CREATED.getCode().equals(wmsWarehouses.getStatus()) && !WarehouseDictEnum.STATUS_INACTIVE.getCode().equals(wmsWarehouses.getStatus())) {
            throw new JeecgBootException("冷库状态为“创建”或禁用时方可启用");
        }
        wmsWarehouses.setStatus(WarehouseDictEnum.STATUS_ACTIVE.getCode());
        updateById(wmsWarehouses);

    }

    @Override
    public void disable(String id) {
        WmsWarehouses wmsWarehouses = getById(id);
        if(wmsWarehouses==null){
            throw new RuntimeException("冷库不存在");
        }
        if(StringUtils.isEmpty(id)){
            throw new RuntimeException("参数为空");
        }
        //冷库状态为“启用”时方可禁用
        if (!WarehouseDictEnum.STATUS_ACTIVE.getCode().equals(wmsWarehouses.getStatus())) {
            throw new JeecgBootException("冷库状态为“启用”时方可禁用");
        }
        wmsWarehouses.setStatus(WarehouseDictEnum.STATUS_INACTIVE.getCode());
        updateById(wmsWarehouses);
    }
}
