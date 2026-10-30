package org.jeecg.modules.wms.wmstask.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.jeecg.modules.wms.wmstask.entity.WmsTasks;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.wms.wmstask.entity.WmsTasksRecords;

/**
 * @Description: 任务表
 * @Author: jeecg-boot
 * @Date:   2026-09-22
 * @Version: V1.0
 */
public interface IWmsTasksService extends IService<WmsTasks> {

    void createReceiveTask(String orderId,String operator);

    IPage<WmsTasks> list(WmsTasks wmsTasks, Integer pageNo, Integer pageSize);

    void receive(WmsTasksRecords wmsTasksRecords);

    void putaway(WmsTasksRecords wmsTasksRecords);

    void createPutawayTask(String orderId, String operator);

    IPage<WmsTasksRecords> pageRecords(WmsTasksRecords wmsTasksRecords, Integer pageNo, Integer pageSize);

    WmsTasks execute(WmsTasksRecords wmsTasksRecords);

    String generateTaskCode();
}
