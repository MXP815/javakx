package org.jeecg.modules.wms.inorder.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.jeecg.common.system.vo.LoginUser;
import org.jeecg.modules.wms.config.WarehouseDictEnum;
import org.jeecg.modules.wms.wmstask.entity.WmsTasks;
import org.jeecg.modules.wms.wmstask.entity.WmsTasksRecords;
import org.jeecg.modules.wms.wmstask.service.IWmsTasksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @Description: 上架任务 Controller
 * @Author: jeecg-boot
 */
@Tag(name = "上架任务")
@RestController
@RequestMapping("/inorder/putawayTasks")
@Slf4j
public class PutawayTasksController {

    @Autowired
    private IWmsTasksService wmsTasksService;

    /**
     * 待上架任务查询
     */
    @Operation(summary = "待上架任务查询")
    @GetMapping(value = "/list")
    public Result<IPage<WmsTasks>> list(WmsTasks wmsTasks,
                                        @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                        @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                        HttpServletRequest req) {
        // 当前用户id
        LoginUser sysUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();
        wmsTasks.setOperator(sysUser.getId());
        // 只查询上架任务
        wmsTasks.setTaskType(WarehouseDictEnum.TASK_TYPE_PUTAWAY.getCode());
        IPage<WmsTasks> wmsTasksIPage = wmsTasksService.list(wmsTasks, pageNo, pageSize);
        return Result.OK(wmsTasksIPage);
    }

    /**
     * 上架记录查询
     */
    @Operation(summary = "上架记录查询")
    @GetMapping(value = "/records")
    public Result<IPage<WmsTasksRecords>> records(WmsTasksRecords wmsTasksRecords,
                                                  @RequestParam(name = "pageNo", defaultValue = "1") Integer pageNo,
                                                  @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
                                                  HttpServletRequest req) {
        IPage<WmsTasksRecords> pageList = wmsTasksService.pageRecords(wmsTasksRecords, pageNo, pageSize);
        return Result.OK(pageList);
    }

    /**
     * 通过id查询
     */
    @Operation(summary = "上架任务-通过id查询")
    @GetMapping(value = "/queryById")
    public Result<WmsTasks> queryById(@RequestParam(name = "id", required = true) String id) {
        WmsTasks wmsTasks = wmsTasksService.getById(id);
        if (wmsTasks == null) {
            return Result.error("未找到对应数据");
        }
        return Result.OK(wmsTasks);
    }

    /**
     * 创建上架任务
     * 参数：入库单id, 执行人
     */
    @AutoLog(value = "创建上架任务")
    @Operation(summary = "创建上架任务")
    @RequiresPermissions("inorder:putaway_task:add")
    @PostMapping(value = "/add")
    public Result<String> add(String orderIds, String operator) {
        if (orderIds == null || orderIds.isEmpty() || operator == null || operator.isEmpty()) {
            return Result.error("请选择入库单及执行人！");
        }
        String[] split = orderIds.split(",");
        for (String orderId : split) {
            wmsTasksService.createPutawayTask(orderId, operator);
        }
        return Result.OK("创建成功！");
    }

    /**
     * 上架操作
     */
    @AutoLog(value = "上架")
    @Operation(summary = "上架")
    @RequiresPermissions("inorder:putaway_task:addRecords")
    @PostMapping(value = "/addRecords")
    public Result<String> addRecords(@RequestBody WmsTasksRecords wmsTasksRecords) {
        wmsTasksService.putaway(wmsTasksRecords);
        return Result.OK("上架成功！");
    }
}
