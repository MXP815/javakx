package org.jeecg.modules.wms.goods.service.impl;

import org.jeecg.common.util.RedisUtil;
import org.jeecg.modules.wms.goods.entity.WmsCargoOwners;
import org.jeecg.modules.wms.goods.mapper.WmsCargoOwnersMapper;
import org.jeecg.modules.wms.goods.service.IWmsCargoOwnersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.transaction.annotation.Transactional;

/**
 * @Description: 供应商表
 * @Author: jeecg-boot
 * @Date:   2026-09-15
 * @Version: V1.0
 */
@Service
public class WmsCargoOwnersServiceImpl extends ServiceImpl<WmsCargoOwnersMapper, WmsCargoOwners> implements IWmsCargoOwnersService {

    @Autowired
    private RedisUtil redisUtil;

    // 同时成功 同时失败 事务的原子性
    @Transactional(rollbackFor = Exception.class)
    @Override
    public void add(WmsCargoOwners wmsCargoOwners) {
        // 把自增之后的数据 保存到WmsCargoOwners对象中
        wmsCargoOwners.setOwnerCode(generateOwnerCode());
        save(wmsCargoOwners);
    }

    private String generateOwnerCode() {
        // 生成供应商编码的算法
        long incr = redisUtil.incr("WMS_CARGO_OWNERS_CODE", 1);
        String code ="C" + String.format("%05d",incr);//C00003
        return code;
    }
}
