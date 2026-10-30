import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  createReceiveTask='/inorder/receiveTasks/add',
  list = '/inorder/wmsStockInOrders/list',
  save='/inorder/wmsStockInOrders/add',
  edit='/inorder/wmsStockInOrders/edit',
  audit='/inorder/wmsStockInOrders/audit',
  deleteOne = '/inorder/wmsStockInOrders/delete',
  deleteBatch = '/inorder/wmsStockInOrders/deleteBatch',
  importExcel = '/inorder/wmsStockInOrders/importExcel',
  exportXls = '/inorder/wmsStockInOrders/exportXls',
  wmsStockInOrderItemsList = '/inorder/wmsStockInOrders/queryWmsStockInOrderItemsByMainId',
  submitAudit = '/inorder/wmsStockInOrders/submitAudit',
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
 * 子表单查询接口
 * @param params
 */
export const queryWmsStockInOrderItems = Api.wmsStockInOrderItemsList
/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 删除单个
 */
export const deleteOne = (params,handleSuccess) => {
  return defHttp.delete({url: Api.deleteOne, params}, {joinParamsToUrl: true}).then(() => {
    handleSuccess();
  });
}
/**
 * 提交审核
 */
export const submitAudit = (params,handleSuccess) => {
  //询问是否提交审核
  createConfirm({
    iconType: 'warning',
    title: '确认提交',
    content: '是否提交选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.post({url: Api.submitAudit, params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  })
}
/**
 * 创建收货任务
 */
export const createReceiveTask = (params) => {
  return defHttp.post({url: Api.createReceiveTask, params}, {joinParamsToUrl: true});
  // return defHttp.post({url: Api.createReceiveTask, params}, {joinParamsToUrl: true}).then(() => {
  //   handleSuccess();
  // });
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
 * 保存或者更新
 * @param params
 */
export const submitAuditForm = (params) => {
  let url =  Api.audit;
  return defHttp.post({url: url, params});
}
/**
 * 子表列表接口
 * @param params
 */
export const wmsStockInOrderItemsList = (params) =>
  defHttp.get({url: Api.wmsStockInOrderItemsList, params},{isTransformResponse:false});
