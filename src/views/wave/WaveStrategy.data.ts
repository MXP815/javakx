import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '策略名称',
    align:"center",
    dataIndex: 'strategyName'
   },
   {
    title: '策略编码',
    align:"center",
    dataIndex: 'strategyCode'
   },
   {
    title: '优先级',
    align:"center",
    dataIndex: 'priority'
   },
   {
    title: '最小订单数',
    align:"center",
    dataIndex: 'minOrderCount'
   },
   {
    title: '最大订单数',
    align:"center",
    dataIndex: 'maxOrderCount'
   },
   {
    title: '最小sku品项数',
    align:"center",
    dataIndex: 'minSkuItems'
   },
   {
    title: '最大sku品项数',
    align:"center",
    dataIndex: 'maxSkuItems'
   },
   {
    title: '最小sku件数',
    align:"center",
    dataIndex: 'minSkuQuantity'
   },
   {
    title: '最大sku件数',
    align:"center",
    dataIndex: 'maxSkuQuantity'
   },
   {
    title: '是否自动执行',
    align:"center",
    dataIndex: 'isAutoExecute',
     customRender: ({text}) => {
       return render.renderDict(text, 'yn');
     }
   },
   {
    title: '是否按供应商分组',
    align:"center",
    dataIndex: 'groupByOwner',
     customRender: ({text}) => {
       return render.renderDict(text, 'yn');
     }
   },
   {
    title: '是否按物流商分组',
    align:"center",
    dataIndex: 'groupByCarrier',
     customRender: ({text}) => {
       return render.renderDict(text, 'yn');
     }
   },
   {
    title: '温区编码',
    align:"center",
    dataIndex: 'storageAreaCode'
   },
   {
    title: '温区名称',
    align:"center",
    dataIndex: 'storageAreaName'
   },
   {
    title: '波次内最大温区数',
    align:"center",
    dataIndex: 'maxStorageAreas'
   },
   {
    title: '单订单最小sku数',
    align:"center",
    dataIndex: 'minSkuPerOrder'
   },
   {
    title: '单订单最大sku数',
    align:"center",
    dataIndex: 'maxSkuPerOrder'
   },
   {
    title: '是否启用',
    align:"center",
    dataIndex: 'isEnabled',
     customRender: ({text}) => {
       return render.renderDict(text, 'yn');
     }
   },
   {
    title: '备注',
    align:"center",
    dataIndex: 'remark'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '策略名称',
    field: 'strategyName',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入策略名称!'},
          ];
     },
  },
  {
    label: '策略编码',
    field: 'strategyCode',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入策略编码!'},
          ];
     },
  },
  {
    label: '优先级',
    field: 'priority',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入优先级!'},
          ];
     },
  },
  {
    label: '最小订单数',
    field: 'minOrderCount',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入最小订单数!'},
          ];
     },
  },
  {
    label: '最大订单数',
    field: 'maxOrderCount',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入最大订单数!'},
          ];
     },
  },
  {
    label: '最小sku品项数',
    field: 'minSkuItems',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入最小sku品项数!'},
          ];
     },
  },
  {
    label: '最大sku品项数',
    field: 'maxSkuItems',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入最大sku品项数!'},
          ];
     },
  },
  {
    label: '最小sku件数',
    field: 'minSkuQuantity',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入最小sku件数!'},
          ];
     },
  },
  {
    label: '最大sku件数',
    field: 'maxSkuQuantity',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入最大sku件数!'},
          ];
     },
  },
  {
    label: '是否自动执行',
    field: 'isAutoExecute',
    // component: 'Input',
    defaultValue: 0,
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'yn',
    },

  },
  {
    label: '是否按供应商分组',
    field: 'groupByOwner',
    defaultValue: 0,
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'yn',
    },
  },
  {
    label: '是否按物流商分组',
    field: 'groupByCarrier',
    defaultValue: 0,
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'yn',
    },
  },
  {
    label: '温区编码',
    field: 'storageAreaCode',
    component: 'Input',
  },
  {
    label: '温区名称',
    field: 'storageAreaName',
    component: 'Input',
  },
  {
    label: '波次内最大温区数',
    field: 'maxStorageAreas',
    component: 'InputNumber',
  },
  {
    label: '单订单最小sku数',
    field: 'minSkuPerOrder',
    component: 'InputNumber',
  },
  {
    label: '单订单最大sku数',
    field: 'maxSkuPerOrder',
    component: 'InputNumber',
  },
  {
    label: '是否启用',
    field: 'isEnabled',
    defaultValue: "0",
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'dict_item_status',
    },
  },
  {
    label: '备注',
    field: 'remark',
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
  strategyName: {title: '策略名称',order: 0,view: 'text', type: 'string',},
  strategyCode: {title: '策略编码',order: 1,view: 'text', type: 'string',},
  priority: {title: '优先级',order: 2,view: 'number', type: 'number',},
  minOrderCount: {title: '最小订单数',order: 3,view: 'number', type: 'number',},
  maxOrderCount: {title: '最大订单数',order: 4,view: 'number', type: 'number',},
  minSkuItems: {title: '最小sku品项数',order: 5,view: 'number', type: 'number',},
  maxSkuItems: {title: '最大sku品项数',order: 6,view: 'number', type: 'number',},
  minSkuQuantity: {title: '最小sku件数',order: 7,view: 'number', type: 'number',},
  maxSkuQuantity: {title: '最大sku件数',order: 8,view: 'number', type: 'number',},
  isAutoExecute: {title: '是否自动执行',order: 9,view: 'text', type: 'string',},
  groupByOwner: {title: '是否按供应商分组',order: 10,view: 'text', type: 'string',},
  groupByCarrier: {title: '是否按物流商分组',order: 11,view: 'text', type: 'string',},
  storageAreaCode: {title: '温区编码',order: 12,view: 'text', type: 'string',},
  storageAreaName: {title: '温区名称',order: 13,view: 'text', type: 'string',},
  maxStorageAreas: {title: '波次内最大温区数',order: 14,view: 'number', type: 'number',},
  minSkuPerOrder: {title: '单订单最小sku数',order: 15,view: 'number', type: 'number',},
  maxSkuPerOrder: {title: '单订单最大sku数',order: 16,view: 'number', type: 'number',},
  isEnabled: {title: '是否启用',order: 17,view: 'text', type: 'string',},
  remark: {title: '备注',order: 18,view: 'text', type: 'string',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
