import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '产品id',
    align:"center",
    dataIndex: 'productId'
   },
   {
    title: '货位编码',
    align:"center",
    dataIndex: 'locationCode'
   },
   {
    title: '容器编码',
    align:"center",
    dataIndex: 'containerCode'
   },
   {
    title: '变更数量',
    align:"center",
    dataIndex: 'changeQuantity'
   },
   {
    title: '变更类型',
    align:"center",
    dataIndex: 'transactionType'
   },
   {
    title: '关联单据号',
    align:"center",
    dataIndex: 'referenceNumber'
   },
   {
    title: '备注',
    align:"center",
    dataIndex: 'remarks'
   },
   {
    title: '变更时间',
    align:"center",
    dataIndex: 'transactionTime'
   },
   {
    title: '批次号',
    align:"center",
    dataIndex: 'batchNumber'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '产品id',
    field: 'productId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入产品id!'},
          ];
     },
  },
  {
    label: '货位编码',
    field: 'locationCode',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入货位编码!'},
          ];
     },
  },
  {
    label: '容器编码',
    field: 'containerCode',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入容器编码!'},
          ];
     },
  },
  {
    label: '变更数量',
    field: 'changeQuantity',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入变更数量!'},
          ];
     },
  },
  {
    label: '变更类型',
    field: 'transactionType',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入变更类型!'},
          ];
     },
  },
  {
    label: '关联单据号',
    field: 'referenceNumber',
    component: 'Input',
  },
  {
    label: '备注',
    field: 'remarks',
    component: 'Input',
  },
  {
    label: '变更时间',
    field: 'transactionTime',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入变更时间!'},
          ];
     },
  },
  {
    label: '批次号',
    field: 'batchNumber',
    component: 'Input',
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
  productId: {title: '产品id',order: 0,view: 'text', type: 'string',},
  locationCode: {title: '货位编码',order: 1,view: 'text', type: 'string',},
  containerCode: {title: '容器编码',order: 2,view: 'text', type: 'string',},
  changeQuantity: {title: '变更数量',order: 3,view: 'number', type: 'number',},
  transactionType: {title: '变更类型',order: 4,view: 'text', type: 'string',},
  referenceNumber: {title: '关联单据号',order: 5,view: 'text', type: 'string',},
  remarks: {title: '备注',order: 6,view: 'text', type: 'string',},
  transactionTime: {title: '变更时间',order: 7,view: 'datetime', type: 'string',},
  batchNumber: {title: '批次号',order: 8,view: 'text', type: 'string',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}