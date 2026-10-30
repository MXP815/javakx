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
  wmsOutOrdersAllocationList = '/outorder/wmsOutOrders/queryWmsOutOrdersAllocationByMainId',
  allocateStock='/outorder/wmsOutOrders/allocateStock',//分配库存
  submitAudit='/outorder/wmsOutOrders/submitAudit',
    audit='/outorder/wmsOutOrders/audit',
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
 * 查询子表数据
 * @param params
 */
export const wmsOutOrdersAllocationList = Api.wmsOutOrdersAllocationList;
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
 * 保存或者更新
 * @param params
 */
export const submitAuditForm = (params) => {
  let url =  Api.audit;
  return defHttp.post({url: url, params});
}
