import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '入库单号',
    align:"center",
    dataIndex: 'orderNumber'
   },
   {
    title: '农产品名称',
    align:"center",
    dataIndex: 'productName'
   },
   {
    title: '采购数量',
    align:"center",
    dataIndex: 'expectedQuantity'
   },
   {
    title: '实际收货数量',
    align:"center",
    dataIndex: 'receivedQuantity'
   },
   {
    title: '上架数量',
    align:"center",
    dataIndex: 'shelvedQuantity'
   },
   {
    title: '不良品数量',
    align:"center",
    dataIndex: 'defectiveQuantity'
   },
   {
    title: '备注',
    align:"center",
    dataIndex: 'remarks'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status',
     customRender: ({text}) => {
       return render.renderDict(text, 'asn_item_status');
     }
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '入库单号',
    field: 'orderNumber',
    component: 'Input',
    colProps: {span: 6},
  },
  {
    label: '农产品名称',
    field: 'productName',
    component: 'Input',
    colProps: {span: 6},
  },
  //状态
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"asn_item_status"
    },
    colProps: {span: 6},
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '入库单id',
    field: 'orderId',
    component: 'Input',
    show: false
  },
  {
    label: '入库单号',
    field: 'orderNumber',
    component: 'Input',
    //不可编辑
    componentProps:{
      disabled: true
    }
  },
  {
    label: '产品id',
    field: 'productId',
    component: 'Input',
    show: false
  },
  {
    label: '农产品名称',
    field: 'productName',
    component: 'Input',
    //不可编辑
    componentProps:{
      disabled: true
    }
  },
  {
    label: '采购数量',
    field: 'expectedQuantity',
    component: 'InputNumber',
    //不可编辑
    componentProps:{
      disabled: true
    }
  },
  {
    label: '实际收货数量',
    field: 'quantity',
    component: 'InputNumber',
  },
  //inventory_attribute库存属性，下拉
  {
    label: '库存属性',
    field: 'inventoryAttribute',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"inventory_attribute"
    },
  },
  //location_code货位编码
  {
    label: '货位编码',
    field: 'locationCode',
    component: 'Input',
  },
  //lpn
  {
    label: 'lpn',
    field: 'lpn',
    component: 'Input',
  },
  //batch_number批次号
  {
    label: '批次号',
    field: 'batchNumber',
    component: 'Input',
  },
  //expiry_date 保鲜期到期时间
  {
    label: '保鲜期到期时间',
    field: 'expiryDate',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
    }
  },
  //receiving_type收货类型 下拉
  {
    label: '收货类型',
    field: 'receivingType',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"receiving_type"
    },
  },
  // {
  //   label: '上架数量',
  //   field: 'shelvedQuantity',
  //   component: 'InputNumber',
  //   //不可编辑
  //   componentProps:{
  //     disabled: true
  //   }
  // },
  // {
  //   label: '不良品数量',
  //   field: 'defectiveQuantity',
  //   component: 'InputNumber',
  //   //不可编辑
  //   componentProps:{
  //     disabled: true
  //   }
  // },
  {
    label: '备注',
    field: 'remarks',
    component: 'Input',
  },
  // {
  //   label: '状态',
  //   field: 'status',
  //   component: 'JDictSelectTag',
  //   componentProps:{
  //     dictCode:"asn_item_status",
  //     disabled: true
  //   },
  // },
  // {
  //   label: '状态',
  //   field: 'status',
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
  orderId: {title: '入库单id',order: 0,view: 'text', type: 'string',},
  productId: {title: '产品id',order: 1,view: 'text', type: 'string',},
  expectedQuantity: {title: '采购数量',order: 2,view: 'number', type: 'number',},
  receivedQuantity: {title: '实际收货数量',order: 3,view: 'number', type: 'number',},
  shelvedQuantity: {title: '上架数量',order: 4,view: 'number', type: 'number',},
  defectiveQuantity: {title: '不良品数量',order: 5,view: 'number', type: 'number',},
  remarks: {title: '备注',order: 6,view: 'text', type: 'string',},
  status: {title: '状态',order: 7,view: 'text', type: 'string',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
