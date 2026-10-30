package org.jeecg.modules.wms.wmstask.service.impl;

import com.aliyun.oss.ServiceException;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.PageDTO;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang3.ObjectUtils;
import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.util.DateUtils;
import org.jeecg.common.util.RedisUtil;
import org.jeecg.modules.wms.config.WarehouseDictEnum;
import org.jeecg.modules.wms.inorder.entity.WmsStockInOrderItems;
import org.jeecg.modules.wms.inorder.entity.WmsStockInOrders;
import org.jeecg.modules.wms.inorder.service.IWmsStockInOrderItemsService;
import org.jeecg.modules.wms.inorder.service.IWmsStockInOrdersService;
import org.jeecg.modules.wms.inventory.service.impl.WmsInventoryTransByReceiving;
import org.jeecg.modules.wms.inventory.vo.WmsInventoryTransParam;
import org.jeecg.modules.wms.wmstask.entity.WmsTasks;
import org.jeecg.modules.wms.wmstask.entity.WmsTasksRecords;
import org.jeecg.modules.wms.wmstask.mapper.WmsTasksMapper;
import org.jeecg.modules.wms.wmstask.service.IWmsTasksRecordsService;
import org.jeecg.modules.wms.wmstask.service.IWmsTasksService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.util.Date;
import java.util.List;

/**
 * @Description: 任务表
 * @Author: jeecg-boot
 * @Date:   2026-09-22
 * @Version: V1.0
 */
@Service
public class WmsTasksServiceImpl extends ServiceImpl<WmsTasksMapper, WmsTasks> implements IWmsTasksService {

    @Autowired
    private IWmsStockInOrdersService stockInOrdersService;

    @Autowired
    private IWmsStockInOrderItemsService stockInOrderItemsService;

    @Autowired
    private IWmsTasksRecordsService wmsTasksRecordsService;

    @Override
    public void createReceiveTask(String orderId,String operator) {
        // 根据id 查询到入库单的所有数据
        WmsStockInOrders stockInOrders = stockInOrdersService.getById(orderId);
        if (!WarehouseDictEnum.INBOUND_APPROVED.getCode().equals(stockInOrders.getStatus())) {
            throw new JeecgBootException("入库单审核通过方可创建收货任务");
        }
        //拿到目标冷库id
        String warehouseId = stockInOrders.getWarehouseId();
        // 根据入库单id 查询到入库单的明细
        List<WmsStockInOrderItems> wmsStockInOrderItems = stockInOrderItemsService.selectByMainId(orderId);

        // 如果查询到 就可以根据入库单明细 创建 任务记录
        for (WmsStockInOrderItems stockInOrderItem : wmsStockInOrderItems) {
            //每一个明细 对应一个具体的收货任务
            WmsTasks wmsTasks = new WmsTasks();
            wmsTasks.setTaskType(WarehouseDictEnum.TASK_TYPE_RECEIVING.getCode());// 把任务状态修改为 收货
            wmsTasks.setTaskStatus(WarehouseDictEnum.TASK_STATUS_CREATED.getCode());//已创建
            wmsTasks.setTaskNumber(generateTaskCode());
            //目标冷库
            wmsTasks.setTargetWarehouseId(warehouseId);
            wmsTasks.setStockInOrderId(stockInOrderItem.getOrderId());//设置入库单ID
            wmsTasks.setStockInOrderItemId(stockInOrderItem.getId());// 任务和明细 一对一
            wmsTasks.setProductId(stockInOrderItem.getProductId());//设置产品id
            wmsTasks.setQuantity(stockInOrderItem.getExpectedQuantity());// 设置采购数量
            // 设置收货的数量
            wmsTasks.setCompletedQuantity(0);
            wmsTasks.setOperator(operator);
            save(wmsTasks);
        }
        // 修改入库单的状态 为收货中
        WmsStockInOrders orders = new WmsStockInOrders();
        orders.setId(orderId);// 根据定位找到对应的入库单
        orders.setStatus(WarehouseDictEnum.INBOUND_RECEIVING.getCode());// 修改入库单状态为收货中
        boolean b = stockInOrdersService.updateById(orders);// 把数据保存到数据库中
        if(!b){
            throw new ServiceException("创建任务失败");
        }

        //批量更新入库单明细
        boolean update = stockInOrderItemsService.update(null,
                new LambdaUpdateWrapper<WmsStockInOrderItems>().eq(WmsStockInOrderItems::getOrderId, orderId)
                        .set(WmsStockInOrderItems::getStatus, WarehouseDictEnum.INBOUND_DETAIL_RECEIVING.getCode()));
        if(!update){
            throw new JeecgBootException("创建收货任务过程中更新入库单明细状态失败");
        }

    }

    @Autowired
    private RedisUtil redisUtil;

    public String generateTaskCode() {
        // 	TSK + 20260921 + 00001
        String time = DateUtils.now().substring(0, 10).replace("-", "");
        // redis自增功能
        String key = "tsk_number" + time;
        long incr = redisUtil.incr(key, 1);
        // 只有第一次会加上过期时间
        if (incr == 1) {
            redisUtil.expire(key, 60 * 60 * 24);
        }
        return "TSK" + time + String.format("%04d", incr) ;
    }

    @Override
    public IPage<WmsTasks> list(WmsTasks wmsTasks, Integer pageNo, Integer pageSize) {
        // 分页
        Page<WmsTasks> page = PageHelper.startPage(pageNo, pageSize);
        // 查询数据库 拿到所需数据的列表
        List<WmsTasks> list = baseMapper.queryTaskList(wmsTasks);
        // 自定义需要的传输数据模型
        PageDTO<WmsTasks> wmsTasksPageDTO = new PageDTO<>();
        wmsTasksPageDTO.setRecords(list);
        wmsTasksPageDTO.setTotal(page.getTotal());
        wmsTasksPageDTO.setSize(page.getPageSize());
        wmsTasksPageDTO.setCurrent(page.getPageNum());
        wmsTasksPageDTO.setPages(page.getPages());
        return wmsTasksPageDTO;
    }

    @Override
    public void receive(WmsTasksRecords wmsTasksRecords) {
        // 接受收货任务
        WmsTasks wmsTasks = execute(wmsTasksRecords);
        // 入库单明细
        stockInOrderItemsService.updateReceivedStatus(wmsTasks.getStockInOrderItemId());
        // 更新入库单状态
        String inOrderStatus = stockInOrdersService.updateReceivedStatus(wmsTasks.getStockInOrderId());

        // ============ 第三步：准备库存流转参数（DTO 转换） ============
        // 5. 库存属性：良品 GOOD_PRODUCT / 不良品 DEFECTIVE_PRODUCT
        String inventoryAttribute = wmsTasksRecords.getInventoryAttribute();

        WmsInventoryTransParam param = new WmsInventoryTransParam();
        param.setProductId(wmsTasksRecords.getProductId());
        param.setExecQuantity(wmsTasksRecords.getExecQuantity());
        param.setWarehouseId(wmsTasksRecords.getTargetWarehouseId());
        param.setTargetLocationCode(wmsTasksRecords.getTargetLocationCode());
        param.setBatchNumber(wmsTasksRecords.getBatchNumber());
        param.setTransactionType(WarehouseDictEnum.INVENTORY_RECEIVING.getCode());
        param.setExpiryDate(wmsTasksRecords.getExpiryDate());
        param.setOperationTime(wmsTasksRecords.getOperationTime());
        param.setOperator(wmsTasksRecords.getOperator());

        // ★ 核心：良品可售=1，不良品不可售=0
        if (WarehouseDictEnum.INVENTORY_ATTRIBUTE_GOOD.getCode().equals(inventoryAttribute)) {
            param.setIsSellable("1");
        } else {
            param.setIsSellable("0");
        }

        // ============ 第四步：执行库存增加 ============
        wmsInventoryTransByReceiving.transfer(param);

    }


    @Autowired                                        // ← 新增
    private WmsInventoryTransByReceiving wmsInventoryTransByReceiving;

    /**
     * 创建上架任务：入库单审核通过且收货完成后，根据入库单明细创建上架任务
     */
    @Override
    public void createPutawayTask(String orderId, String operator) {
        WmsStockInOrders stockInOrders = stockInOrdersService.getById(orderId);
        if (stockInOrders == null) {
            throw new JeecgBootException("入库单不存在");
        }
        // 只有收货完成才能创建上架任务（状态为 PUTAWAYING 即上架中 或 RECEIVED 已收货完成）
        if (!WarehouseDictEnum.INBOUND_RECEIVED.getCode().equals(stockInOrders.getStatus())
                && !WarehouseDictEnum.INBOUND_PUTAWAYING.getCode().equals(stockInOrders.getStatus())) {
            throw new JeecgBootException("入库单需收货完成方可创建上架任务");
        }
        String warehouseId = stockInOrders.getWarehouseId();
        List<WmsStockInOrderItems> items = stockInOrderItemsService.selectByMainId(orderId);

        for (WmsStockInOrderItems item : items) {
            WmsTasks task = new WmsTasks();
            task.setTaskType(WarehouseDictEnum.TASK_TYPE_PUTAWAY.getCode());
            task.setTaskStatus(WarehouseDictEnum.TASK_STATUS_CREATED.getCode());
            task.setTaskNumber(generateTaskCode());
            task.setTargetWarehouseId(warehouseId);
            task.setStockInOrderId(item.getOrderId());
            task.setStockInOrderItemId(item.getId());
            task.setProductId(item.getProductId());
            task.setQuantity(item.getExpectedQuantity());
            task.setCompletedQuantity(0);
            task.setOperator(operator);
            save(task);
        }
        // 更新入库单状态为上架中
        stockInOrdersService.update(null,
                new LambdaUpdateWrapper<WmsStockInOrders>().eq(WmsStockInOrders::getId, orderId)
                        .set(WmsStockInOrders::getStatus, WarehouseDictEnum.INBOUND_PUTAWAYING.getCode()));
    }

    /**
     * 上架操作：执行上架任务
     */
    @Override
    public void putaway(WmsTasksRecords wmsTasksRecords) {
        WmsTasks wmsTasks = execute(wmsTasksRecords);
        // 更新入库单明细上架状态
        stockInOrderItemsService.updatePutawayStatus(wmsTasks.getStockInOrderItemId());
        // 更新入库单状态
        stockInOrdersService.updatePutawayStatus(wmsTasks.getStockInOrderId());
    }

    /**
     * 分页查询任务记录
     */
    @Override
    public IPage<WmsTasksRecords> pageRecords(WmsTasksRecords wmsTasksRecords, Integer pageNo, Integer pageSize) {
        return wmsTasksRecordsService.pageList(wmsTasksRecords, pageNo, pageSize);
    }

    @NotNull
    public WmsTasks execute(WmsTasksRecords wmsTasksRecords) {
        // -------------------1. 把收货的所有信息 保存到收货记录中----------------------------------
        // 根据目标任务id 找到当前任务的所有信息
        String id = wmsTasksRecords.getId();
        WmsTasks wmsTasks = getById(id);// 拿到所有信息
        // 先拿到已完成的数量，如果没有已完成的数量，默认给一个0
        Integer completeQuantity = ObjectUtils.defaultIfNull(wmsTasks.getCompletedQuantity(), 0);

        // 当前这一次 用户输入的数量
        Integer quantity = wmsTasksRecords.getExecQuantity();

        if (completeQuantity + quantity > wmsTasks.getQuantity()) {
            throw new JeecgBootException("当前执行的数量 不能大于总数量");
        }

        // 冷库信息（记录是在哪个冷库操作的）
        wmsTasksRecords.setTargetWarehouseId(wmsTasks.getTargetWarehouseId());
        // 关联单据信息（记录操作源头）
        wmsTasksRecords.setStockInOrderId(wmsTasks.getStockInOrderId());
        wmsTasksRecords.setStockInOrderItemId(wmsTasks.getStockInOrderItemId());
        // 波次管理信息（如果涉及波次拣货，记录波次信息）
        wmsTasksRecords.setWaveOrderId(wmsTasks.getWaveOrderId());
        wmsTasksRecords.setWaveSkuSummaryId(wmsTasks.getWaveSkuSummaryId());
        // 任务基础信息（记录任务编号、农产品ID、类型）
        wmsTasksRecords.setTaskId(wmsTasks.getId());
        wmsTasksRecords.setProductId(wmsTasks.getProductId());
        wmsTasksRecords.setTaskNumber(wmsTasks.getTaskNumber());
        wmsTasksRecords.setTaskType(wmsTasks.getTaskType());
        // 执行时间与执行人（记录谁在什么时间操作的）
        wmsTasksRecords.setOperationTime(new Date());
        wmsTasksRecords.setOperator(wmsTasks.getOperator());

        boolean save = wmsTasksRecordsService.saveOrUpdate(wmsTasksRecords);
        // 更新失败的友好提示
        if (!save){
            throw new JeecgBootException("添加任务失败");
        }
        // 并发执行时，需要保证任务原子性
        // 创建更新查询条件
        LambdaUpdateWrapper<WmsTasks> wmsTasksLambdaUpdateWrapper = new LambdaUpdateWrapper<>();
        // 每次使用sql语句时候的update 锁
        wmsTasksLambdaUpdateWrapper.setSql("completed_quantity=completed_quantity +"
                + wmsTasksRecords.getExecQuantity()).
                eq(WmsTasks::getId, wmsTasksRecords.getTaskId())
                .le(WmsTasks::getCompletedQuantity, wmsTasks.getQuantity() - wmsTasksRecords.getExecQuantity());
        int update = getBaseMapper().update(wmsTasksLambdaUpdateWrapper);
        if (update<=0){
            throw new JeecgBootException("执行数量不能大于并发数量");
        }
        // 当所有的货品都收货完成后，收货状态就会变为已完成收货
        WmsTasks wmsTasks2 = getById(wmsTasksRecords.getTaskId());
        Integer completedQuantity = wmsTasks2.getCompletedQuantity();
        // 把已完成的收货数量 和 总数量进行对比
        if (completedQuantity.equals(wmsTasks.getQuantity())) {
            wmsTasks2.setTaskStatus(WarehouseDictEnum.TASK_STATUS_COMPLETED.getCode());
            // 把数据更新回去
            boolean b = updateById(wmsTasks2);
            if (!b){
                throw new JeecgBootException("更新失败");
            }
        }

        return wmsTasks2;
    }


}
