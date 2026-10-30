import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  putawaylist = '/inorder/putawayTasks/list',
  receivelist = '/inorder/receiveTasks/list',
  receive = '/inorder/receiveTasks/addRecords',
  putaway = '/inorder/putawayTasks/addRecords',
  deleteOne = '/wmstask/wmsTasks/delete',
  deleteBatch = '/wmstask/wmsTasks/deleteBatch',
  importExcel = '/wmstask/wmsTasks/importExcel',
  exportXls = '/wmstask/wmsTasks/exportXls',
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
 * 上架任务查询接口
 * @param params
 */
export const putawaylist = (params) => defHttp.get({ url: Api.putawaylist, params });
/**
 * 收货任务查询接口
 * @param params
 */
export const receivelist = (params) => defHttp.get({ url: Api.receivelist, params });

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
 * 收货
 * @param params
 */
export const receive = (params) => {
  const url = Api.receive;
  return defHttp.post({ url: url, params });
};
/**
 * 上架
 * @param params
 */
export const putaway = (params) => {
  const url = Api.putaway;
  return defHttp.post({ url: url, params });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  const url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
