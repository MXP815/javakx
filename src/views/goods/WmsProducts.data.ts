import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '农产品名称',
    align:"center",
    dataIndex: 'productName'
   },
   {
    title: '供应商id',
    align:"center",
    dataIndex: 'ownerId'
   },
   {
    title: '产品编码',
    align:"center",
    dataIndex: 'productCode'
   },
   {
    title: '产品条码',
    align:"center",
    dataIndex: 'productBarcode'
   },
   {
    title: '宽',
    align:"center",
    dataIndex: 'width'
   },
   {
    title: '长',
    align:"center",
    dataIndex: 'length'
   },
   {
    title: '高',
    align:"center",
    dataIndex: 'height'
   },
   {
    title: '体积',
    align:"center",
    dataIndex: 'volume'
   },
   {
    title: '毛重',
    align:"center",
    dataIndex: 'grossWeight'
   },
   {
    title: '净重',
    align:"center",
    dataIndex: 'netWeight'
   },
   {
    title: '农产品品类id',
    align:"center",
    dataIndex: 'categoryId'
   },
   {
    title: '包装规格',
    align:"center",
    dataIndex: 'packagingSpec'
   },
   {
    title: '质检周期(天)',
    align:"center",
    dataIndex: 'maintenanceCycle'
   },
   {
    title: '保鲜期(天)',
    align:"center",
    dataIndex: 'shelfLife'
   },
   {
    title: '计量单位',
    align:"center",
    dataIndex: 'unit'
   },
   {
    title: '是否保鲜期管控',
    align:"center",
    dataIndex: 'isExpiryControlled'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '农户条码',
    align:"center",
    dataIndex: 'supplierBarcode'
   },
   {
    title: '产品规格',
    align:"center",
    dataIndex: 'productSpec'
   },
   {
    title: '产品批次',
    align:"center",
    dataIndex: 'productBatch'
   },
   {
    title: '产地品牌',
    align:"center",
    dataIndex: 'productBrand'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '农产品名称',
    field: 'productName',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入农产品名称!'},
          ];
     },
  },
  {
    label: '供应商id',
    field: 'ownerId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入供应商id!'},
          ];
     },
  },
  {
    label: '产品编码',
    field: 'productCode',
    component: 'Input',
  },
  {
    label: '产品条码',
    field: 'productBarcode',
    component: 'Input',
  },
  {
    label: '宽',
    field: 'width',
    component: 'InputNumber',
  },
  {
    label: '长',
    field: 'length',
    component: 'InputNumber',
  },
  {
    label: '高',
    field: 'height',
    component: 'InputNumber',
  },
  {
    label: '体积',
    field: 'volume',
    component: 'InputNumber',
  },
  {
    label: '毛重',
    field: 'grossWeight',
    component: 'InputNumber',
  },
  {
    label: '净重',
    field: 'netWeight',
    component: 'InputNumber',
  },
  {
    label: '农产品品类id',
    field: 'categoryId',
    component: 'Input',
  },
  {
    label: '包装规格',
    field: 'packagingSpec',
    component: 'Input',
  },
  {
    label: '质检周期(天)',
    field: 'maintenanceCycle',
    component: 'InputNumber',
  },
  {
    label: '保鲜期(天)',
    field: 'shelfLife',
    component: 'InputNumber',
  },
  {
    label: '计量单位',
    field: 'unit',
    component: 'Input',
  },
  {
    label: '是否保鲜期管控',
    field: 'isExpiryControlled',
    component: 'InputNumber',
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"dict_item_status"
     },
  },
  {
    label: '农户条码',
    field: 'supplierBarcode',
    component: 'Input',
  },
  {
    label: '产品规格',
    field: 'productSpec',
    component: 'Input',
  },
  {
    label: '产品批次',
    field: 'productBatch',
    component: 'Input',
  },
  {
    label: '产地品牌',
    field: 'productBrand',
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
  productName: {title: '农产品名称',order: 0,view: 'text', type: 'string',},
  ownerId: {title: '供应商id',order: 1,view: 'text', type: 'string',},
  productCode: {title: '产品编码',order: 2,view: 'text', type: 'string',},
  productBarcode: {title: '产品条码',order: 3,view: 'text', type: 'string',},
  width: {title: '宽',order: 4,view: 'number', type: 'number',},
  length: {title: '长',order: 5,view: 'number', type: 'number',},
  height: {title: '高',order: 6,view: 'number', type: 'number',},
  volume: {title: '体积',order: 7,view: 'number', type: 'number',},
  grossWeight: {title: '毛重',order: 8,view: 'number', type: 'number',},
  netWeight: {title: '净重',order: 9,view: 'number', type: 'number',},
  categoryId: {title: '农产品品类id',order: 10,view: 'text', type: 'string',},
  packagingSpec: {title: '包装规格',order: 11,view: 'text', type: 'string',},
  maintenanceCycle: {title: '质检周期(天)',order: 12,view: 'number', type: 'number',},
  shelfLife: {title: '保鲜期(天)',order: 13,view: 'number', type: 'number',},
  unit: {title: '计量单位',order: 14,view: 'text', type: 'string',},
  isExpiryControlled: {title: '是否保鲜期管控',order: 15,view: 'number', type: 'number',},
  status: {title: '状态',order: 16,view: 'list', type: 'string',dictCode: 'dict_item_status',},
  supplierBarcode: {title: '农户条码',order: 17,view: 'text', type: 'string',},
  productSpec: {title: '产品规格',order: 18,view: 'text', type: 'string',},
  productBatch: {title: '产品批次',order: 19,view: 'text', type: 'string',},
  productBrand: {title: '产地品牌',order: 20,view: 'text', type: 'string',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}