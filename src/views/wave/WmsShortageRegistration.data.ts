import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '波次ID',
    align:"center",
    dataIndex: 'waveId'
   },
   {
    title: '波次拣货明细ID',
    align:"center",
    dataIndex: 'waveSkuSummaryId'
   },
   {
    title: '关联任务ID',
    align:"center",
    dataIndex: 'taskId'
   },
   {
    title: '农产品ID',
    align:"center",
    dataIndex: 'productId'
   },
   {
    title: '产品条码',
    align:"center",
    dataIndex: 'productBarcode'
   },
   {
    title: '货位编码',
    align:"center",
    dataIndex: 'locationCode'
   },
   {
    title: '批次号',
    align:"center",
    dataIndex: 'batchNumber'
   },
   {
    title: '缺货数量',
    align:"center",
    dataIndex: 'shortageQuantity'
   },
   {
    title: '状态(待处理/已补货/已取消)',
    align:"center",
    dataIndex: 'status'
   },
   {
    title: '处理方式(补货/换货/取消)',
    align:"center",
    dataIndex: 'processMethod'
   },
   {
    title: '处理人',
    align:"center",
    dataIndex: 'processor'
   },
   {
    title: '处理时间',
    align:"center",
    dataIndex: 'processTime'
   },
   {
    title: '处理备注',
    align:"center",
    dataIndex: 'processRemark'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '波次ID',
    field: 'waveId',
    component: 'Input',
    show: false
  },
  {
    label: '波次拣货明细ID',
    field: 'waveSkuSummaryId',
    component: 'Input',
    show: false
  },
  {
    label: '关联任务ID',
    field: 'taskId',
    component: 'Input',
    show: false
  },
  {
    label: '农产品ID',
    field: 'productId',
    component: 'Input',
    show: false
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
    label: '货位编码',
    field: 'sourceLocationCode',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '批次号',
    field: 'batchNumber',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '缺货数量',
    field: 'shortageQuantity',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入缺货数量!'},
      ];
    },
  },
  // {
  //   label: '状态(待处理/已补货/已取消)',
  //   field: 'status',
  //   component: 'Input',
  // },
  // {
  //   label: '处理方式(补货/换货/取消)',
  //   field: 'processMethod',
  //   component: 'Input',
  // },
  // {
  //   label: '处理人',
  //   field: 'processor',
  //   component: 'Input',
  // },
  // {
  //   label: '处理时间',
  //   field: 'processTime',
  //   component: 'DatePicker',
  //   componentProps: {
  //      showTime: true,
  //      valueFormat: 'YYYY-MM-DD HH:mm:ss'
  //    },
  // },
  // {
  //   label: '处理备注',
  //   field: 'processRemark',
  //   component: 'Input',
  // },
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
  waveId: {title: '波次ID',order: 0,view: 'text', type: 'string',},
  waveSkuSummaryId: {title: '波次拣货明细ID',order: 1,view: 'text', type: 'string',},
  taskId: {title: '关联任务ID',order: 2,view: 'text', type: 'string',},
  productId: {title: '农产品ID',order: 3,view: 'text', type: 'string',},
  productBarcode: {title: '产品条码',order: 4,view: 'text', type: 'string',},
  locationCode: {title: '货位编码',order: 5,view: 'text', type: 'string',},
  batchNumber: {title: '批次号',order: 6,view: 'text', type: 'string',},
  shortageQuantity: {title: '缺货数量',order: 7,view: 'number', type: 'number',},
  status: {title: '状态(待处理/已补货/已取消)',order: 8,view: 'text', type: 'string',},
  processMethod: {title: '处理方式(补货/换货/取消)',order: 9,view: 'text', type: 'string',},
  processor: {title: '处理人',order: 10,view: 'text', type: 'string',},
  processTime: {title: '处理时间',order: 11,view: 'datetime', type: 'string',},
  processRemark: {title: '处理备注',order: 12,view: 'text', type: 'string',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
