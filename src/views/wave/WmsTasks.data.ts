import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
import {list, listByPickType} from "@/views/warehouse/WmsStorageLocations.api";
//列表数据
export const pickColumns: BasicColumn[] = [
   {
    title: '任务号',
    align:"center",
    dataIndex: 'taskNumber'
   },
   {
    title: '任务id',
    align:"center",
    dataIndex: 'id',
     ifShow: false
   },
  //波次id
   {
     title: '波次id',
      align:"center",
     dataIndex: 'waveOrderId',
     ifShow: false
   },
   {
    title: '任务类型',
    align:"center",
    dataIndex: 'taskType_dictText',
   },
   {
    title: '任务状态',
    align:"center",
    dataIndex: 'taskStatus_dictText',
   },
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
    title: '冷库',
    align:"center",
    dataIndex: 'warehouseName'
   },
  //冷库id
   {
     title: '冷库id',
     align:"center",
     dataIndex: 'targetWarehouseId',
     ifShow: false
   },
   {
    title: '来源货位编码',
    align:"center",
    dataIndex: 'sourceLocationCode'
   },
   // {
   //  title: '目的货位编码',
   //  align:"center",
   //  dataIndex: 'targetLocationCode'
   // },
   // {
   //  title: '实际目的货位编码',
   //  align:"center",
   //  dataIndex: 'actualTargetLocationCode'
   // },
   {
    title: '来源容器编码',
    align:"center",
    dataIndex: 'sourceContainerCode'
   },
  /**
   * 批次号
   */
  {
    title: '批次号',
    align:"center",
    dataIndex: 'batchNumber'
   },
  /**
   * 保鲜期
   */
  {
    title: '保鲜期',
    align:"center",
    dataIndex: 'expiryDate',
   },
  {
    title: '待拣货数量',
    align:"center",
    dataIndex: 'quantity'
  },
  {
    title: '完成数量',
    align:"center",
    dataIndex: 'completedQuantity'
  },
   // {
   //  title: '目的容器编码',
   //  align:"center",
   //  dataIndex: 'targetContainerCode'
   // },
   // {
   //  title: '执行人',
   //  align:"center",
   //  dataIndex: 'operator'
   // },
   // {
   //  title: '执行时间',
   //  align:"center",
   //  dataIndex: 'operationTime'
   // },
   // {
   //  title: '完成时间',
   //  align:"center",
   //  dataIndex: 'completedAt'
   // },
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
];
//收货任务列表
export const receiveColumns: BasicColumn[] = [
  {
    title: '任务号',
    align:"center",
    dataIndex: 'taskNumber'
  },
  {
    title: '任务类型',
    align:"center",
    dataIndex: 'taskType',
    customRender: ({text}) => {
      return render.renderDict(text, 'task_type');
    }
  },
  {
    title: '任务状态',
    align:"center",
    dataIndex: 'taskStatus',
    customRender: ({text}) => {
      return render.renderDict(text, 'task_status');
    }
  },
  //入库单号
  {
    title: '入库单号',
    align:"center",
    dataIndex: 'stockInOrderNumber'
  },
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
    title: '数量',
    align:"center",
    dataIndex: 'quantity'
  },
  {
    title: '完成数量',
    align:"center",
    dataIndex: 'completedQuantity'
  },
  // {
  //   title: '来源货位编码',
  //   align:"center",
  //   dataIndex: 'sourceLocationCode'
  // },
  // {
  //   title: '目的货位编码',
  //   align:"center",
  //   dataIndex: 'targetLocationCode'
  // },
  // {
  //   title: '实际目的货位编码',
  //   align:"center",
  //   dataIndex: 'actualTargetLocationCode'
  // },
  // {
  //   title: '来源容器编码',
  //   align:"center",
  //   dataIndex: 'sourceContainerCode'
  // },
  // {
  //   title: '目的容器编码',
  //   align:"center",
  //   dataIndex: 'targetContainerCode'
  // },
  // {
  //   title: '执行人',
  //   align:"center",
  //   dataIndex: 'operator'
  // },
  // {
  //   title: '执行时间',
  //   align:"center",
  //   dataIndex: 'operationTime'
  // },
  // {
  //   title: '完成时间',
  //   align:"center",
  //   dataIndex: 'completedAt'
  // },
  // {
  //   title: '入库单id',
  //   align:"center",
  //   dataIndex: 'stockInOrderId'
  // },
  // {
  //   title: '入库明细id',
  //   align:"center",
  //   dataIndex: 'stockInOrderItemId'
  // },
  // {
  //   title: '波次单id',
  //   align:"center",
  //   dataIndex: 'waveOrderId'
  // },
];
//查询数据
export const pickSearchFormSchema: FormSchema[] = [
  {
    label: '任务号',
    field: 'taskNumber',
    component: 'Input',
    colProps: {span: 6},
  },
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
  {
    label: '任务状态',
    field: 'taskStatus',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"task_status"
    },
    colProps: {span: 6},
  },
];
//表单数据
export const pickFormSchema: FormSchema[] = [
  {
    label: '任务号',
    field: 'taskNumber',
    component: 'Input',
    componentProps:{
      disabled: true
    },
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

  // {
  //   label: '任务类型',
  //   field: 'taskType',
  //   component: 'Input',
  // },
  {
    label: '任务状态',
    field: 'taskStatus',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"task_status",
      disabled: true
    },
  },
  {
    label: '供应商',
    field: 'ownerName',
    component: 'Input',
    //不可编辑
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '农产品',
    field: 'productName',
    component: 'Input',
    //不可编辑
    componentProps: {
      disabled: true,
    },
  },
  // {
  //   label: '完成数量',
  //   field: 'completedQuantity',
  //   component: 'InputNumber',
  // },
  {
    label: '来源货位',
    field: 'sourceLocationCode',
    component: 'Input',
    //不可编辑
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '所属冷库',
    field: 'warehouseName',
    component: 'Input',
    componentProps: {
      disabled: true,
    }
  },
  {
    label: '所属冷库id',
    field: 'targetWarehouseId',
    component: 'Input',
    show: false
  },
  {
    label: '目的货位',
    field: 'targetLocationCode',
    component: 'ApiSelect',
    componentProps: ({ formModel, formActionType }) => {
      return {
        api: listByPickType,
        params:{warehouseId: formModel.targetWarehouseId},
        resultField: 'records',
        labelField: 'locationCode',
        valueField: 'locationCode',
      }
    },
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入目的货位!'},
      ];
    },
  },
  // {
  //   label: '目的货位',
  //   field: 'targetLocationCode',
  //   component: 'JTreeSelect',
  //   // helpMessage: ['component模式'],
  //   componentProps: {
  //     // dict: 'sys_test,name,id',
  //     dict: 'wms_storage_locations_view,name,id',
  //     pidField: 'parent_id',
  //   },
  //   dynamicRules: ({values}) => {
  //     return [
  //       { required: true, message: '请选择所属货位!',
  //         validator: (_, value) => {
  //           //如果value以'A'开头说明是冷库不是温区
  //           if (value && (value.startsWith('A') || value.startsWith('B'))) {
  //             return Promise.reject(new Error('请选择所属货位'));
  //           } else {
  //             return Promise.resolve();
  //           }
  //         },
  //       },
  //
  //     ];
  //   },
  // },
  // {
  //   label: '目的货位',
  //   field: 'targetLocationCode',
  //   component: 'Input',
  // },
  //
  // {
  //   label: '实际目的货位编码',
  //   field: 'actualTargetLocationCode',
  //   component: 'Input',
  // },
  // {
  //   label: '来源容器',
  //   field: 'sourceContainerCode',
  //   component: 'Input',
  //   //不可编辑
  //   componentProps: {
  //     disabled: true,
  //   },
  // },
  /**
   * 批次号
   */
  {
    label: '批次号',
    field: 'batchNumber',
    component: 'Input',
    //不可编辑
    componentProps: {
      disabled: true,
    },
  },
  // {
  //   label: '目的容器',
  //   field: 'targetContainerCode',
  //   component: 'Input',
  // },
  {
    label: '已拣数量',
    field: 'completedQuantity',
    component: 'InputNumber',
    //不可编辑
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '待拣货数量',
    field: 'quantity',
    component: 'InputNumber',
    //不可编辑
    componentProps: {
      disabled: true,
    },
  },

  {
    label: '本次拣货数量',
    field: 'execQuantity',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入本次拣货数量!'},
      ];
    },
  },
  // {
  //   label: '执行人',
  //   field: 'operator',
  //   component: 'Input',
  // },
  // {
  //   label: '执行时间',
  //   field: 'operationTime',
  //   component: 'DatePicker',
  //   componentProps: {
  //      showTime: true,
  //      valueFormat: 'YYYY-MM-DD HH:mm:ss'
  //    },
  // },
  // {
  //   label: '完成时间',
  //   field: 'completedAt',
  //   component: 'DatePicker',
  //   componentProps: {
  //      showTime: true,
  //      valueFormat: 'YYYY-MM-DD HH:mm:ss'
  //    },
  // },
  // {
  //   label: '入库单id',
  //   field: 'stockInOrderId',
  //   component: 'Input',
  //   //隐藏
  //   show: false
  // },
  // {
  //   label: '入库明细id',
  //   field: 'stockInOrderItemId',
  //   component: 'Input',
  //   //隐藏
  //   show: false
  // },
  // {
  //   label: '波次单id',
  //   field: 'waveOrderId',
  //   component: 'Input',
  //   //隐藏
  //   show: false
  // },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
//查询数据
export const receiveSearchFormSchema: FormSchema[] = [
  {
    label: '任务号',
    field: 'taskNumber',
    component: 'Input',
    colProps: {span: 6},
  },
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
  {
    label: '任务状态',
    field: 'taskStatus',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"task_status"
    },
    colProps: {span: 6},
  },
  //入库单号
  {
    label: '入库单号',
    field: 'stockInOrderNumber',
    component: 'Input',
    colProps: {span: 6},
  },
];
//收货表单数据
export const receiveFormSchema: FormSchema[] = [
  {
    label: '任务号',
    field: 'taskNumber',
    component: 'Input',
    componentProps:{
      disabled: true
    },
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

  // {
  //   label: '任务类型',
  //   field: 'taskType',
  //   component: 'Input',
  // },
  {
    label: '任务状态',
    field: 'taskStatus',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"task_status",
      disabled: true
    },
  },
  {
    label: '供应商',
    field: 'ownerName',
    component: 'Input',
    //不可编辑
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '农产品',
    field: 'productName',
    component: 'Input',
    //不可编辑
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '收货数量',
    field: 'quantity',
    component: 'InputNumber',

  },
  {
    label: '库存属性',
    field: 'inventoryAttribute',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"inventory_attribute",
    },
  },
  // {
  //   label: '货位编码',
  //   field: 'targetLocationCode',
  //   component: 'Input',
  // },
  {
    label: '货位编码',
    field: 'targetLocationCode',
    component: 'JTreeSelect',
    // helpMessage: ['component模式'],
    componentProps: {
      // dict: 'sys_test,name,id',
      dict: 'wms_storage_locations_view,name,id',
      pidField: 'parent_id',
    },
    dynamicRules: ({values}) => {
      return [
        { required: true, message: '请选择所属货位!',
          validator: (_, value) => {
            //如果value以'A'开头说明是冷库不是温区
            if (value && (value.startsWith('A') || value.startsWith('B'))) {
              return Promise.reject(new Error('请选择所属货位'));
            } else {
              return Promise.resolve();
            }
          },
        },

      ];
    },
  },
  {
    label: '托盘编码',
    field: 'targetContainerCode',
    component: 'Input',
  },
  {
    label: '收货日期',
    field: 'receivingDate',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    },
  },
  {
    label: '批次号',
    field: 'batchNumber',
    component: 'Input',
  },
  {
    label: '保鲜期到期日',
    field: 'expiryDate',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD'
    },
  },
  // {
  //   label: '执行时间',
  //   field: 'operationTime',
  //   component: 'DatePicker',
  //   componentProps: {
  //      showTime: true,
  //      valueFormat: 'YYYY-MM-DD HH:mm:ss'
  //    },
  // },
  {
    label: '入库单id',
    field: 'stockInOrderId',
    component: 'Input',
    //隐藏
    show: false
  },
  {
    label: '入库明细id',
    field: 'stockInOrderItemId',
    component: 'Input',
    //隐藏
    show: false
  },
  {
    label: '波次单id',
    field: 'waveOrderId',
    component: 'Input',
    //隐藏
    show: false
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
  taskStatus: {title: '任务状态',order: 2,view: 'text', type: 'string',},
  ownerId: {title: '供应商id',order: 3,view: 'text', type: 'string',},
  productId: {title: '产品id',order: 4,view: 'text', type: 'string',},
  quantity: {title: '数量',order: 5,view: 'number', type: 'number',},
  completedQuantity: {title: '完成数量',order: 6,view: 'number', type: 'number',},
  sourceLocationCode: {title: '来源货位编码',order: 7,view: 'text', type: 'string',},
  targetLocationCode: {title: '目的货位编码',order: 8,view: 'text', type: 'string',},
  // actualTargetLocationCode: {title: '实际目的货位编码',order: 9,view: 'text', type: 'string',},
  sourceContainerCode: {title: '来源容器编码',order: 10,view: 'text', type: 'string',},
  targetContainerCode: {title: '目的容器编码',order: 11,view: 'text', type: 'string',},
  operator: {title: '执行人',order: 12,view: 'text', type: 'string',},
  operationTime: {title: '执行时间',order: 13,view: 'datetime', type: 'string',},
  completedAt: {title: '完成时间',order: 14,view: 'datetime', type: 'string',},
  stockInOrderId: {title: '入库单id',order: 15,view: 'text', type: 'string',},
  stockInOrderItemId: {title: '入库明细id',order: 16,view: 'text', type: 'string',},
  waveOrderId: {title: '波次单id',order: 17,view: 'text', type: 'string',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
// export function getBpmFormSchema(_formData): FormSchema[]{
//   // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
//   return formSchema;
// }
