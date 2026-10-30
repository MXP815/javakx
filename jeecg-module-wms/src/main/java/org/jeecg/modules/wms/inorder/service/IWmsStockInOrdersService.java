package org.jeecg.modules.wms.inorder.service;

import org.jeecg.modules.wms.inorder.entity.WmsStockInOrderItems;
import org.jeecg.modules.wms.inorder.entity.WmsStockInOrders;
import com.baomidou.mybatisplus.extension.service.IService;
import org.jeecg.modules.wms.inorder.vo.WmsStockInOrdersPage;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

/**
 * @Description: 入库单主表
 * @Author: jeecg-boot
 * @Date:   2026-09-21
 * @Version: V1.0
 */
public interface IWmsStockInOrdersService extends IService<WmsStockInOrders> {

	/**
	 * 添加一对多
	 *
	 * @param wmsStockInOrders
	 * @param wmsStockInOrderItemsList
	 */
	public void saveMain(WmsStockInOrders wmsStockInOrders,List<WmsStockInOrderItems> wmsStockInOrderItemsList) ;
	
	/**
	 * 修改一对多
	 *
   * @param wmsStockInOrders
   * @param wmsStockInOrderItemsList
	 */
	public void updateMain(WmsStockInOrders wmsStockInOrders,List<WmsStockInOrderItems> wmsStockInOrderItemsList);
	
	/**
	 * 删除一对多
	 *
	 * @param id
	 */
	public void delMain (String id);
	
	/**
	 * 批量删除一对多
	 *
	 * @param idList
	 */
	public void delBatchMain (Collection<? extends Serializable> idList);

    void add(WmsStockInOrders wmsStockInOrders);

	void submitAudit(String id);

	void audit(WmsStockInOrders wmsStockInOrders);
	// 增加修改状态的方法
	String updateReceivedStatus(String stockInOrderId);

	/**
	 * 更新上架完成状态
	 */
	String updatePutawayStatus(String stockInOrderId);
}
