import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/outorder/wmsOutOrders/list',
  save='/outorder/wmsOutOrders/add',
  edit='/outorder/wmsOutOrders/edit',
  deleteOne = '/outorder/wmsOutOrders/delete',
  deleteBatch = '/outorder/wmsOutOrders/deleteBatch',
  importExcel = '/outorder/wmsOutOrders/importExcel',
  exportXls = '/outorder/wmsOutOrders/exportXls',
  wmsOutOrdersItemsList = '/outorder/wmsOutOrders/queryWmsOutOrdersItemsByMainId',
  wmsShipmentListApi = '/shipment/wmsShipment/list',
  wmsOutOrdersAllocationList = '/outorder/wmsOutOrders/queryWmsOutOrdersAllocationByMainId',
  allocateStock='/outorder/wmsOutOrders/allocateStock'//分配库存
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 查询子表数据
 * @param params
 */
export const wmsOutOrdersItemsList = Api.wmsOutOrdersItemsList;
/**
 * 查询包裹数据
 * @param params
 */
export const wmsShipmentListApi = Api.wmsShipmentListApi;
/**
 * 查询子表数据
 * @param params
 */
export const wmsOutOrdersAllocationList = Api.wmsOutOrdersAllocationList;
/**
 * 列表接口
 * @param params
 */
export const list = (params) =>{
  //当没有选择状态查询条件时只查询已拣货、打包、已打包、已发布的出库单
  // if(!params||!params.status){
  //   params.status = ['PICKED','PACKING','PACKED','SHIPPED'];
  // }
  return defHttp.get({url: Api.list, params});
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
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({url: url, params});
}
/**
 * 分配库存
 */
export const allocateStock = (params, handleSuccess) => {
  return defHttp.post({url: Api.allocateStock, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
