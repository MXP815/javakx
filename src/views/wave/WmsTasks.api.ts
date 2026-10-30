import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
  putawaylist = '/inorder/putawayTasks/list',
  picklist = '/wave/pickingTasks/list',
  receivelist = '/inorder/receiveTasks/list',
  receive='/inorder/receiveTasks/addRecords',
  putaway='/inorder/putawayTasks/addRecords',
  pick='/wave/pickingTasks/addRecords',

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
export const putawaylist = (params) =>
  defHttp.get({url: Api.putawaylist, params});
/**
 * 拣货任务查询接口
 * @param params
 */
export const picklist = (params) =>
  defHttp.get({url: Api.picklist, params});
/**
 * 收货任务查询接口
 * @param params
 */
export const receivelist = (params) =>
  defHttp.get({url: Api.receivelist, params});

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
 * 收货
 * @param params
 */
export const receive = (params) => {
  let url = Api.receive;
  return defHttp.post({url: url, params});
}
/**
 * 上架
 * @param params
 */
export const putaway = (params) => {
  let url = Api.putaway;
  return defHttp.post({url: url, params});
}
/**
 * 拣货
 * @param params
 */
export const pick = (params) => {
  let url = Api.pick;
  return defHttp.post({url: url, params});
}
/**
 * 完成分拣
 */
export const completeSorting = (params,handleSuccess) => {
  return defHttp.post({url: '/wave/pickingTasks/completeSorting',  params}, {joinParamsToUrl: true,}).then(() => {
    handleSuccess();
  });
}

/**
 * 查看拣货路径
 * @param params
 */
export const viewPickPath = (params,handleSuccess) =>{
   defHttp.get({url: '/wave/pickingTasks/viewPickPath', params}).then((res) => {
    handleSuccess(res);
  });
}
