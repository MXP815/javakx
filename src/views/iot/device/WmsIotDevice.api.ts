import { defHttp } from '@/utils/http/axios';
import { useMessage } from '@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  devicelist = '/iot/manage/device/list',
  servicelist = '/iot/manage/device/queryServices',
  fieldlist = '/iot/manage/device/queryFields',
  save = '/iot/manage/device/add',
  edit = '/iot/manage/device/edit',
  detail = '/iot/manage/device/queryById',
  deleteOne = '/iot/manage/device/delete',
  deleteBatch = '/iot/manage/device/deleteBatch',
  importExcel = '/iot/manage/device/importExcel',
  exportXls = '/iot/manage/device/exportXls',
  history = '/iot/manage/device/data/history',
  ctrl = '/iot/manage/device/ctrl',
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
export const devicelist = (params) => defHttp.get({ url: Api.devicelist, params });

/**
 * 历史记录列表接口
 * @param params
 */
export const getHistorylist = (params) => defHttp.get({ url: Api.history, params });

/**
 * 服务列表接口
 * @param params
 */
export const getServicelist = (params) => defHttp.get({ url: Api.servicelist, params });

/**
 * 属性列表接口
 * @param params
 */
export const getFieldlist = (params) => defHttp.get({ url: Api.fieldlist, params });
/**
 * 详情接口
 * @param params
 */
export const detail = (params) => defHttp.get({ url: Api.detail, params });
/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
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
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  const url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 设备控制
 * @param params
 */
export const setCtrl = (params) => {
  return defHttp.post({ url: Api.ctrl, params });
};
