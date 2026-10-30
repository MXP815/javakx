package org.jeecg.modules.wms.inorder.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import org.jeecg.modules.wms.config.WarehouseDictEnum;
import org.jeecg.modules.wms.inorder.entity.WmsStockInOrderItems;
import org.jeecg.modules.wms.inorder.mapper.WmsStockInOrderItemsMapper;
import org.jeecg.modules.wms.inorder.service.IWmsStockInOrderItemsService;
import org.jeecg.modules.wms.wmstask.entity.WmsTasksRecords;
import org.jeecg.modules.wms.wmstask.mapper.WmsTasksRecordsMapper;
import org.jeecg.modules.wms.wmstask.service.IWmsTasksRecordsService;
import org.jeecg.modules.wms.wmstask.service.impl.WmsTasksRecordsServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @Description: 入库单明细
 * @Author: jeecg-boot
 * @Date:   2026-09-21
 * @Version: V1.0
 */
@Service
public class WmsStockInOrderItemsServiceImpl extends ServiceImpl<WmsStockInOrderItemsMapper, WmsStockInOrderItems> implements IWmsStockInOrderItemsService {
	
	@Autowired
	private WmsStockInOrderItemsMapper wmsStockInOrderItemsMapper;
	@Autowired
	private IWmsTasksRecordsService  wmsTasksRecordsService;

	@Override
	public List<WmsStockInOrderItems> selectByMainId(String mainId) {
		return wmsStockInOrderItemsMapper.selectByMainId(mainId);
	}

	@Override
	public void updateReceivedStatus(String stockInOrderItemId) {
		// 拿到当前所有的明细信息，再更新到前端的表单上
		WmsStockInOrderItems items = getById(stockInOrderItemId);
		// 构造一个查询条件
		LambdaUpdateWrapper<WmsTasksRecords> eq = new LambdaUpdateWrapper<WmsTasksRecords>()
				.eq(WmsTasksRecords::getStockInOrderItemId,stockInOrderItemId);
		// 拿到更新的所有的记录数据
		List<WmsTasksRecords> list = wmsTasksRecordsService.list(eq);
		//计算list中所有的不良品的数量
		int badQuantity = list.stream().filter(wmsTasksRecords ->
						wmsTasksRecords.getInventoryAttribute().equals(WarehouseDictEnum.INVENTORY_ATTRIBUTE_DEFECTIVE.getCode()))
				.mapToInt(WmsTasksRecords::getExecQuantity)
				.sum();
		int goodQuantity = list.stream().filter(
						wmsTasksRecords -> wmsTasksRecords.getInventoryAttribute().equals(WarehouseDictEnum.INVENTORY_ATTRIBUTE_GOOD.getCode()))
				.mapToInt(WmsTasksRecords::getExecQuantity)
				.sum();
		// 把不良品以及良品数据 保存到数据库中
		if (badQuantity>0){

			items.setDefectiveQuantity(items.getDefectiveQuantity() +badQuantity);
//			items.setDefectiveQuantity(badQuantity);

		}
		if (goodQuantity>0){
			items.setReceivedQuantity(items.getReceivedQuantity() + goodQuantity);
//			items.setReceivedQuantity(goodQuantity);
		}
		// 收货完成的状态判定
		// 总数量 = 不良品数量 + 良品的数量 就把状态变成收货完成
		if(items.getExpectedQuantity().equals(items.getReceivedQuantity()+items.getDefectiveQuantity())){
			items.setStatus(WarehouseDictEnum.INBOUND_DETAIL_RECEIVED.getCode());
		}
		// 更新到数据库中
		updateById(items);
	}

	@Override
	public void updatePutawayStatus(String stockInOrderItemId) {
		// 上架完成时，将明细状态设为上架完成
		WmsStockInOrderItems items = getById(stockInOrderItemId);
		if (items == null) {
			return;
		}
		items.setStatus(WarehouseDictEnum.INBOUND_DETAIL_PUTAWAYED.getCode());
		updateById(items);
	}
}
