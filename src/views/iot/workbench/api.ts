import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  dashboard = '/iot/manage/workbench/dashboard',
}

/**
 * 列表接口
 * @param params
 */
export const dashboard = (params) => defHttp.get({ url: Api.dashboard, params });
