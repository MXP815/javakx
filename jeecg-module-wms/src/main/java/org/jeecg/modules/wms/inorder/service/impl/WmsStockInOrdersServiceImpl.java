package org.jeecg.modules.wms.inorder.service.impl;

import org.jeecg.common.exception.JeecgBootException;
import org.jeecg.common.util.DateUtils;
import org.jeecg.common.util.RedisUtil;
import org.jeecg.modules.wms.config.WarehouseDictEnum;
import org.jeecg.modules.wms.inorder.entity.WmsStockInOrders;
import org.jeecg.modules.wms.inorder.entity.WmsStockInOrderItems;
import org.jeecg.modules.wms.inorder.mapper.WmsStockInOrderItemsMapper;
import org.jeecg.modules.wms.inorder.mapper.WmsStockInOrdersMapper;
import org.jeecg.modules.wms.inorder.service.IWmsStockInOrderItemsService;
import org.jeecg.modules.wms.inorder.service.IWmsStockInOrdersService;
import org.jeecg.modules.wms.inorder.vo.WmsStockInOrdersPage;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.io.Serializable;
import java.util.List;
import java.util.Collection;

/**
 * @Description: 入库单主表
 * @Author: jeecg-boot
 * @Date:   2026-09-21
 * @Version: V1.0
 */
@Service
public class WmsStockInOrdersServiceImpl extends ServiceImpl<WmsStockInOrdersMapper, WmsStockInOrders> implements IWmsStockInOrdersService {

	@Autowired
	private WmsStockInOrdersMapper wmsStockInOrdersMapper;
	@Autowired
	private WmsStockInOrderItemsMapper wmsStockInOrderItemsMapper;

	@Autowired
	private IWmsStockInOrderItemsService iWmsStockInOrderItemsService;
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveMain(WmsStockInOrders wmsStockInOrders, List<WmsStockInOrderItems> wmsStockInOrderItemsList) {
		wmsStockInOrdersMapper.insert(wmsStockInOrders);
		if(wmsStockInOrderItemsList!=null && wmsStockInOrderItemsList.size()>0) {
			for(WmsStockInOrderItems entity:wmsStockInOrderItemsList) {
				//外键设置
				entity.setOrderId(wmsStockInOrders.getId());
				wmsStockInOrderItemsMapper.insert(entity);
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMain(WmsStockInOrders wmsStockInOrders,List<WmsStockInOrderItems> wmsStockInOrderItemsList) {

		if(wmsStockInOrderItemsList == null || wmsStockInOrderItemsList.size() <= 0){
			throw new JeecgBootException("请选择入库单明细");
		}
		wmsStockInOrderItemsMapper.deleteByMainId(wmsStockInOrders.getId());

		for (WmsStockInOrderItems item : wmsStockInOrderItemsList) {
			// 维护外键关联：将明细绑定到当前的入库单主表ID上
			item.setOrderId(wmsStockInOrders.getId());
			// 状态初始化：新提交的明细，统一重置为“初始状态”
			item.setStatus(WarehouseDictEnum.INBOUND_DETAIL_INITIAL.getCode());
		}

		int sum = wmsStockInOrderItemsList.stream().mapToInt(WmsStockInOrderItems::getExpectedQuantity).sum();
		wmsStockInOrders.setTotalExpectedQuantity(sum);

		// 【批量插入】使用MyBatis-Plus的批量插入方法，一次性保存处理好的明细列表
		// 性能优化：相比循环逐条插入，批量插入能显著减少数据库连接次数，提升性能
		boolean b = iWmsStockInOrderItemsService.saveBatch(wmsStockInOrderItemsList);
		if(!b){
			throw new JeecgBootException("保存入库单明细失败");
		}

		// 最后更新入库单主表信息（包括刚才计算的总数量、修改时间、修改人等）
		int i = wmsStockInOrdersMapper.updateById(wmsStockInOrders);
		if(i <= 0){
			throw new JeecgBootException("更新入库单失败");
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void delMain(String id) {
		wmsStockInOrderItemsMapper.deleteByMainId(id);
		wmsStockInOrdersMapper.deleteById(id);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void delBatchMain(Collection<? extends Serializable> idList) {
		for(Serializable id:idList) {
			wmsStockInOrderItemsMapper.deleteByMainId(id.toString());
			wmsStockInOrdersMapper.deleteById(id);
		}
	}

	@Override
	public void add(WmsStockInOrders wmsStockInOrders) {
		// 在原来的基础上，增加入库单编号
		String orderNumber = generateOrderNumber();
		// 把编号保存到数据库中
		wmsStockInOrders.setOrderNumber(orderNumber);
		// 设置状态值设置为初始
		wmsStockInOrders.setStatus(WarehouseDictEnum.INBOUND_INITIAL.getCode());
		// 数据准备好后，就可以插入到数据库中
		wmsStockInOrdersMapper.insert(wmsStockInOrders);

	}

	@Override
	public void submitAudit(String id) {
		// 把初始状态 修改为可提交审核
		// 根据id 找到当前这一条记录的数据
		WmsStockInOrders order = getById(id);
		// 如果根据前端传递过来的id 没找到对应的数据
		if(order==null){
			throw new JeecgBootException("未找到对应的数据");
		}
		// 如果之前是初始状态 才可以提交审核
		if(!WarehouseDictEnum.INBOUND_DETAIL_INITIAL.getCode().equals(order.getStatus())){
			throw new JeecgBootException("必须是初始状态才可以提交审核");
		}

		order.setStatus(WarehouseDictEnum.INBOUND_SUBMIT_AUDIT.getCode());
		//重新写回数据库
		wmsStockInOrdersMapper.updateById(order);

	}

	@Override
	public void audit(WmsStockInOrders wmsStockInOrders) {
		// 把状态值 由提交审核变为审核通过
		// 根据id 拿到当前行的详细数据
		String id = wmsStockInOrders.getId();
		WmsStockInOrders order = getById(id);
		if(order==null){
			throw new JeecgBootException("未找到对应的数据");
		}
		// 状态值是已提交时才可以修改
		if(!WarehouseDictEnum.INBOUND_SUBMIT_AUDIT.getCode().equals(order.getStatus())){
				throw new JeecgBootException("状态值是提交审核时才能审核");
		}
		String status = wmsStockInOrders.getStatus();
		if(!WarehouseDictEnum.INBOUND_APPROVED.getCode().equals(status) && !WarehouseDictEnum.INBOUND_RECEIVED.getCode().equals(status)){
				throw new JeecgBootException("审核结果不合法");
		}
		order.setStatus(status);
		// 把修改过状态的值 在设置回去
		wmsStockInOrdersMapper.updateById(order);

	}



	@Autowired
	private RedisUtil redisUtil;

	private String generateOrderNumber() {
		//当天的时间 + 随机值 2026-09-21 --> 20260921
		String time = DateUtils.now().substring(0, 10).replaceAll("-", "");
		// 保存到redis 中 设计key   wms:asn_number + 时间 + 00002
		String key =  "wms:asn_number" + time;// 存入redis中设计的 key
		long incr = redisUtil.incr(key, 1);// redis从10开始
		if(incr == 1){
			// 设置过期时间
			redisUtil.expire(key, 60*60*24) ;
		}
		// 以下值会生成 入单编号 存入到数据库中
		String orderNumber = "ASN"  + time +String.format("%04d", incr);
		return orderNumber;
	}

	@Override
	public String updateReceivedStatus(String stockInOrderId) {
		// 获取到入库单的主表信息
		WmsStockInOrders wmsStockInOrders = getById(stockInOrderId);
		// todo 安全判断暂时先不做
		// 找入库单下的所有农产品明细
		List<WmsStockInOrderItems> wmsStockInOrderItems = iWmsStockInOrderItemsService.selectByMainId(stockInOrderId);
		// 拿到所有的良品 把所有的数量相加
		int totalCompleteQuantity = wmsStockInOrderItems.stream().mapToInt(WmsStockInOrderItems::getReceivedQuantity).sum();
		// 把所有的不良品数量相加
		int totalBadQuantity = wmsStockInOrderItems.stream().mapToInt(WmsStockInOrderItems::getDefectiveQuantity).sum();
		// 判定收货状态
		boolean b1 = wmsStockInOrderItems.stream().anyMatch(
				stockInOrderItem -> !stockInOrderItem.getStatus().equals(WarehouseDictEnum.INBOUND_DETAIL_RECEIVED.getCode()));
		// 如果之前有一个是未完成收货，就返回的是收获中，否则就是全部完成 返回已收货
		String  status = b1 ? WarehouseDictEnum.INBOUND_RECEIVING.getCode():WarehouseDictEnum.INBOUND_RECEIVED.getCode();
		// 更新良品和不良品的数量
		wmsStockInOrders.setTotalReceivedQuantity(totalCompleteQuantity);
		wmsStockInOrders.setTotalDefectiveQuantity(totalBadQuantity);
		wmsStockInOrders.setStatus(status);
		//把数据更新回去
		updateById(wmsStockInOrders);

		return status;
	}

	@Override
	public String updatePutawayStatus(String stockInOrderId) {
		WmsStockInOrders wmsStockInOrders = getById(stockInOrderId);
		if (wmsStockInOrders == null) {
			return null;
		}
		List<WmsStockInOrderItems> wmsStockInOrderItems = iWmsStockInOrderItemsService.selectByMainId(stockInOrderId);
		// 判定上架状态：如果有任何一个明细未上架完成，则上架中；否则上架完成
		boolean anyNotPutawayed = wmsStockInOrderItems.stream().anyMatch(
				item -> !WarehouseDictEnum.INBOUND_DETAIL_PUTAWAYED.getCode().equals(item.getStatus()));
		String status = anyNotPutawayed
				? WarehouseDictEnum.INBOUND_PUTAWAYING.getCode()
				: WarehouseDictEnum.INBOUND_PUTAWAYED.getCode();
		wmsStockInOrders.setStatus(status);
		updateById(wmsStockInOrders);
		return status;
	}

}
