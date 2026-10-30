import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const pick_list_columns: BasicColumn[] = [
   {
    title: '任务号',
    align:"center",
    dataIndex: 'taskNumber'
   },
   {
    title: '任务类型',
    align:"center",
    dataIndex: 'taskType',
     customRender: ({ text }) => {
       return render.renderDict(text, 'task_type');
     },
   },
   {
    title: '农产品',
    align:"center",
    dataIndex: 'productName'
   },
   {
    title: '拣货数量',
    align:"center",
    dataIndex: 'execQuantity'
   },
  // {
  //   title: '库存属性',
  //   align:"center",
  //   dataIndex: 'inventoryAttribute',
  //   //根据数据字典编码显示对应的名称
  //   customRender: ({ text }) => {
  //     return render.renderDict(text, 'inventory_attribute');
  //   },
  // },
   {
    title: '来源货位编码',
    align:"center",
    dataIndex: 'sourceLocationCode'
   },
  //批次号
   {
     title: '批次号',
     align:"center",
     dataIndex: 'batchNumber'
   },
   // {
   //  title: '目的货位编码',
   //  align:"center",
   //  dataIndex: 'targetLocationCode'
   // },
   // {
   //  title: '来源容器编码',
   //  align:"center",
   //  dataIndex: 'sourceContainerCode'
   // },
   // {
   //  title: '目的容器编码',
   //  align:"center",
   //  dataIndex: 'targetContainerCode'
   // },
   {
    title: '执行人',
    align:"center",
    dataIndex: 'operator'
   },
   {
    title: '执行时间',
    align:"center",
    dataIndex: 'operationTime'
   },
   // {
   //  title: '入库单id',
   //  align:"center",
   //  dataIndex: 'stockInOrderId'
   // },
   // {
   //  title: '入库明细id',
   //  align:"center",
   //  dataIndex: 'stockInOrderItemId'
   // },
   // {
   //  title: '波次单id',
   //  align:"center",
   //  dataIndex: 'waveOrderId'
   // },

   // {
   //  title: '任务id',
   //  align:"center",
   //  dataIndex: 'taskId'
   // },
];
//列表数据
export const receive_list_columns: BasicColumn[] = [
   {
    title: '任务号',
    align:"center",
    dataIndex: 'taskNumber'
   },
   {
    title: '任务类型',
    align:"center",
    dataIndex: 'taskType',
     customRender: ({ text }) => {
       return render.renderDict(text, 'task_type');
     },
   },
  //入库单号
  {
    title: '入库单号',
    align:"center",
    dataIndex: 'stockInOrderNumber'
   },
  //供应商
  {
    title: '供应商',
    align:"center",
    dataIndex: 'ownerName'
   },
   {
    title: '农产品',
    align:"center",
    dataIndex: 'productName'
   },
   {
    title: '执行数量',
    align:"center",
    dataIndex: 'quantity'
   },
  {
    title: '库存属性',
    align:"center",
    dataIndex: 'inventoryAttribute',
    //根据数据字典编码显示对应的名称
    customRender: ({ text }) => {
      return render.renderDict(text, 'inventory_attribute');
    },
  },
   {
    title: '货位编码',
    align:"center",
    dataIndex: 'targetLocationCode'
   },
   {
    title: '容器编码',
    align:"center",
    dataIndex: 'targetContainerCode'
   },
   {
    title: '执行人',
    align:"center",
    dataIndex: 'operator'
   },
   {
    title: '执行时间',
    align:"center",
    dataIndex: 'operationTime'
   },
   // {
   //  title: '入库单id',
   //  align:"center",
   //  dataIndex: 'stockInOrderId'
   // },
   // {
   //  title: '入库明细id',
   //  align:"center",
   //  dataIndex: 'stockInOrderItemId'
   // },
   //
   // {
   //  title: '任务id',
   //  align:"center",
   //  dataIndex: 'taskId'
   // },
];
//查询收货记录数据
export const searchReceiveTaskFormSchema: FormSchema[] = [
  {
    label: '任务号',
    field: 'taskNumber',
    component: 'Input',
    colProps: {span: 8},
  },
  //任务类型默认为收货任务
  {
    label: '任务类型',
    field: 'taskType',
    component: 'JDictSelectTag',
    defaultValue:"RECEIVING_TASK", //指定任务类型为RECEIVING_TASK 收货任务
    componentProps:{
      dictCode:"task_type",
      disabled: true,
    },
    colProps: {span: 6},
  },


];
//查询上架记录数据
export const searchPickTaskFormSchema: FormSchema[] = [
  {
    label: '任务号',
    field: 'taskNumber',
    component: 'Input',
    colProps: {span: 8},
  },
  //任务类型默认为收货任务
  {
    label: '任务类型',
    field: 'taskType',
    component: 'JDictSelectTag',
    defaultValue:"PICKING_TASK", //指定任务类型为PUTAWAY_TASK 上架任务
    componentProps:{
      dictCode:"task_type",
      disabled: true,
    },
    colProps: {span: 6},
  },


];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '任务号',
    field: 'taskNumber',
    component: 'Input',
  },
  {
    label: '任务类型',
    field: 'taskType',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"task_type",
      disabled: true
    },
  },
  {
    label: '产品id',
    field: 'productId',
    component: 'Input',
  },
  {
    label: '执行数量',
    field: 'completedQuantity',
    component: 'InputNumber',
  },
  {
    label: '来源货位编码',
    field: 'sourceLocationCode',
    component: 'Input',
  },
  {
    label: '目的货位编码',
    field: 'targetLocationCode',
    component: 'Input',
  },
  {
    label: '来源容器编码',
    field: 'sourceContainerCode',
    component: 'Input',
  },
  {
    label: '目的容器编码',
    field: 'targetContainerCode',
    component: 'Input',
  },
  {
    label: '执行人',
    field: 'operator',
    component: 'Input',
  },
  {
    label: '执行时间',
    field: 'operationTime',
    component: 'DatePicker',
    componentProps: {
       showTime: true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '入库单id',
    field: 'stockInOrderId',
    component: 'Input',
  },
  {
    label: '入库明细id',
    field: 'stockInOrderItemId',
    component: 'Input',
  },
  {
    label: '波次单id',
    field: 'waveOrderId',
    component: 'Input',
  },
  {
    label: '库存属性',
    field: 'inventoryAttribute',
    component: 'Input',
  },
  {
    label: '任务id',
    field: 'taskId',
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
  taskNumber: {title: '任务号',order: 0,view: 'text', type: 'string',},
  taskType: {title: '任务类型',order: 1,view: 'text', type: 'string',},
  productId: {title: '产品id',order: 2,view: 'text', type: 'string',},
  completedQuantity: {title: '执行数量',order: 3,view: 'number', type: 'number',},
  sourceLocationCode: {title: '来源货位编码',order: 4,view: 'text', type: 'string',},
  targetLocationCode: {title: '目的货位编码',order: 5,view: 'text', type: 'string',},
  sourceContainerCode: {title: '来源容器编码',order: 6,view: 'text', type: 'string',},
  targetContainerCode: {title: '目的容器编码',order: 7,view: 'text', type: 'string',},
  operator: {title: '执行人',order: 8,view: 'text', type: 'string',},
  operationTime: {title: '执行时间',order: 9,view: 'datetime', type: 'string',},
  stockInOrderId: {title: '入库单id',order: 10,view: 'text', type: 'string',},
  stockInOrderItemId: {title: '入库明细id',order: 11,view: 'text', type: 'string',},
  waveOrderId: {title: '波次单id',order: 12,view: 'text', type: 'string',},
  inventoryAttribute: {title: '库存属性',order: 13,view: 'text', type: 'string',},
  taskId: {title: '任务id',order: 14,view: 'text', type: 'string',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
