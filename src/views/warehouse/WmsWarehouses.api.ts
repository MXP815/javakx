import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  list = '/warehouse/wmsWarehouses/list',
  save='/warehouse/wmsWarehouses/add',
  edit='/warehouse/wmsWarehouses/edit',
  deleteOne = '/warehouse/wmsWarehouses/delete',
  deleteBatch = '/warehouse/wmsWarehouses/deleteBatch',
  importExcel = '/warehouse/wmsWarehouses/importExcel',
  exportXls = '/warehouse/wmsWarehouses/exportXls',
  // 启用或者禁用的 API
  enable = "/warehouse/wmsWarehouses/enable",
  disable = "/warehouse/wmsWarehouses/disable",
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
 * 启用
 */
export const enable = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认启用',
    content: '是否启用选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.put({url: Api.enable, data: params},{joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  })
}
/**
 * 禁用
 */
export const disable = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认禁用',
    content: '是否禁用选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.put({url: Api.disable, data: params},{joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    }
  })
}
