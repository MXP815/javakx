import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/wave/wmsWaveMaster/list',
  save='/wave/wmsWaveMaster/add',
  createWave='/wave/wmsWaveMaster/createWave',
  edit='/wave/wmsWaveMaster/edit',
  deleteOne = '/wave/wmsWaveMaster/delete',
  deleteBatch = '/wave/wmsWaveMaster/deleteBatch',
  importExcel = '/wave/wmsWaveMaster/importExcel',
  exportXls = '/wave/wmsWaveMaster/exportXls',
  wmsOutOrdersList = '/wave/wmsWaveMaster/listWmsOutOrdersByMainId',
  wmsPickTasksList = '/wave/pickingTasks/list',
  wmsShipmentsList = '/shipment/wmsShipment/list',
  sendApi = '/shipment/waybill/send',
  printWaybill = '/shipment/waybill/printWaybill',
  wmsOutOrdersSave='/wave/wmsWaveMaster/addWmsOutOrders',
  wmsOutOrdersEdit='/wave/wmsWaveMaster/editWmsOutOrders',
  wmsOutOrdersDelete = '/wave/wmsWaveMaster/deleteWmsOutOrders',
  wmsOutOrdersDeleteBatch = '/wave/wmsWaveMaster/deleteBatchWmsOutOrders',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 褒词列表
 */
export const waveListUrl = Api.list;

/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 波次下出库单列表
 */
export const wmsOutOrdersList = Api.wmsOutOrdersList;
/**
 * 波次下拣货任务列表
 */
export const wmsPickTasksList = Api.wmsPickTasksList;
/**
 * 波次下包裹列表
 */
export const wmsShipmentsList = Api.wmsShipmentsList;
/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});
/**
 * 列表接口查询状态为创建 的
 * @param params
 */
export const listByCreate = (params) =>{
  params['status']='CREATED';
  return defHttp.get({url: Api.list,params});
}
/**
 * 列表接口查询状态为拣货中 的
 * @param params
 */
export const listByPicking = (params) =>{
  params['status']='PICKING';
  return defHttp.get({url: Api.list,params});
}
/**
 * 列表接口查询状态为拣货完成 的
 * @param params
 */
export const listByPicked = (params) =>{
  params['status']='PICKED';
  return defHttp.get({url: Api.list,params});
}
// /**
//  * 列表接口查询状态为打包中 的
//  * @param params
//  */
// export const listByPacking = (params) =>{
//   params['status']='PACKING';
//   return defHttp.get({url: Api.list,params});
// }
/**
 * 列表接口查询状态为打包完成 的
 * @param params
 */
export const listByPacked = (params) =>{
  params['status']='PACKED';
  return defHttp.get({url: Api.list,params});
}
/**
 * 列表接口查询状态为已配送 的
 * @param params
 */
export const listByShipped = (params) =>{
  params['status']='SHIPPED';
  return defHttp.get({url: Api.list,params});
}
/**
 * 列表接口查询状态为已完成 的
 * @param params
 */
export const listByCompleted = (params) =>{
  params['status']='COMPLETED';
  return defHttp.get({url: Api.list,params});
}

/**
 * 打印运单
 */
export const printWaybill = (params,handleSuccess) => {
  return defHttp.get({url: Api.printWaybill, params}).then((result) => {
    handleSuccess(result);
  });
}
/**
 * 配送
 */
export const send = (params,handleSuccess) => {
  return defHttp.get({url: Api.sendApi, params}).then((result) => {
    handleSuccess(result);
  });
}


/**
 * 删除单个
 */
export const deleteOne = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteOne, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const batchDelete = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.deleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 创建拣货任务
 */
export const createPickTask = (params,handleSuccess) => {
  return defHttp.post({url: '/wave/pickingTasks/createPickTask',  data: params}, {joinParamsToUrl: true,}).then(() => {
    handleSuccess();
  });
}
/**
 * 完成拣货
 */
export const completePickTask = (params,handleSuccess) => {
  return defHttp.post({url: '/wave/pickingTasks/completePickTask',  data: params}, {joinParamsToUrl: true,}).then(() => {
    handleSuccess();
  });
}
/**
 * 完成打包
 */
export const completePack = (params,handleSuccess) => {
  return defHttp.post({url: '/shipment/wmsShipment/completePackByWave',  data: params}, {joinParamsToUrl: true,}).then(() => {
    handleSuccess();
  });
}
/**
 * 创建包裹
 */
export const createShipment = (params,handleSuccess) => {
  return defHttp.post({url: '/shipment/wmsShipment/createShipment',  data: params}, {joinParamsToUrl: true,}).then(() => {
    handleSuccess();
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({url: url, params});
}
/**
 * 创建波次
 */
export const createWave = (params) => {
  return defHttp.post({url: Api.createWave, params});
}
// /**
//  * 列表接口
//  * @param params
//  */
// export const wmsOutOrdersList = (params) => {
//   if(params['waveId']){
//     return defHttp.get({url: Api.wmsOutOrdersList, params});
//   }
//   return Promise.resolve({});
// }


/**
 * 删除单个
 */
export const wmsOutOrdersDelete = (params,handleSuccess) => {
  return defHttp.delete({url: Api.wmsOutOrdersDelete, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 批量删除
 * @param params
 */
export const wmsOutOrdersDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.wmsOutOrdersDeleteBatch, data: params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  });
}
/**
 * 保存或者更新
 * @param params
 */
export const  wmsOutOrdersSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.wmsOutOrdersEdit : Api.wmsOutOrdersSave;
  return defHttp.post({url: url, params});
}
/**
 * 导入
 */
export const wmsOutOrdersImportUrl = '/wave/wmsWaveMaster/importWmsOutOrders'

/**
 * 导出
 */
export const wmsOutOrdersExportXlsUrl = '/wave/wmsWaveMaster/exportWmsOutOrders'
