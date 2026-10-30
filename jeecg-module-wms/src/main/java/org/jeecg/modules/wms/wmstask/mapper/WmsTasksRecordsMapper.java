package org.jeecg.modules.wms.wmstask.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.jeecg.modules.wms.wmstask.entity.WmsTasksRecords;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * @Description: 任务执行记录表
 * @Author: jeecg-boot
 * @Date:   2026-09-22
 * @Version: V1.0
 */
public interface WmsTasksRecordsMapper extends BaseMapper<WmsTasksRecords> {

    List<WmsTasksRecords> queryList(WmsTasksRecords wmsTasksRecords);
}
