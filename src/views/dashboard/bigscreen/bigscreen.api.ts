import { defHttp } from '/@/utils/http/axios';

enum Api {
  todoTasks = '/bigscreen/todo-tasks',
  inOrderTrend = '/bigscreen/in-order-trend',
  outOrderTrend = '/bigscreen/out-order-trend',
  ownerRank = '/bigscreen/owner-rank',
  inventoryAlert = '/bigscreen/inventory-alert',
}

/**
 * 待办任务（待收货 / 待上架 / 待拣货 / 待打包）
 */
export const getTodoTasks = (params?) => defHttp.get({ url: Api.todoTasks, params });

/**
 * 入库趋势
 */
export const getInOrderTrend = (params?) => defHttp.get({ url: Api.inOrderTrend, params });

/**
 * 出库趋势
 */
export const getOutOrderTrend = (params?) => defHttp.get({ url: Api.outOrderTrend, params });

/**
 * 货主出库排行
 */
export const getOwnerRank = (params?) => defHttp.get({ url: Api.ownerRank, params });

/**
 * 库存预警
 */
export const getInventoryAlert = (params?) => defHttp.get({ url: Api.inventoryAlert, params });
