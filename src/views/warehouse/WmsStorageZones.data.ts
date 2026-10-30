import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '温区编码',
    align:"center",
    dataIndex: 'zoneCode'
   },
   {
    title: '温区名称',
    align:"center",
    dataIndex: 'zoneName'
   },
   {
    title: '温区类型',
    align:"center",
    dataIndex: 'zoneType_dictText'
   },
   {
    title: '状态: 创建,禁用, 启用',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '是否可售库存 0-否, 1-是',
    align:"center",
    dataIndex: 'isSellable_dictText'
   },
   {
    title: '所属冷库',
    align:"center",
    dataIndex: 'warehouseName'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '温区编码',
    field: 'zoneCode',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入温区编码!'},
          ];
     },
  },
  {
    label: '温区名称',
    field: 'zoneName',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入温区名称!'},
          ];
     },
  },
  {
    label: '温区类型',
    field: 'zoneType',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"zone_type"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入温区类型!'},
          ];
     },
  },
  {
    label: '状态: 创建,禁用, 启用',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"wms_status"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入状态: 创建,禁用, 启用!'},
          ];
     },
  },
  {
    label: '是否可售库存 0-否, 1-是',
    field: 'isSellable',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"yn"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入是否可售库存 0-否, 1-是!'},
          ];
     },
  },
  {
    label: '所属冷库',
    field: 'warehouseId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入所属冷库!'},
          ];
     },
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];

// 高级查询数据
export const superQuerySchema = {
  zoneCode: {title: '温区编码',order: 0,view: 'text', type: 'string',},
  zoneName: {title: '温区名称',order: 1,view: 'text', type: 'string',},
  zoneType: {title: '温区类型',order: 2,view: 'text', type: 'string',dictCode: 'zone_type'},
  status: {title: '状态: 创建,禁用, 启用',order: 3,view: 'list', type: 'string',dictCode: 'wms_status',},
  isSellable: {title: '是否可售库存 0-否, 1-是',order: 4,view: 'list', type: 'string',dictCode: 'yn',},
  warehouseId: {title: '所属冷库',order: 5,view: 'link_table', type: 'string',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
