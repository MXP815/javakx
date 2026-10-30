import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '包材编号',
    align:"center",
    dataIndex: 'materialCode'
   },
   {
    title: '包材名称',
    align:"center",
    dataIndex: 'materialName'
   },
   {
    title: '包材类型',
    align:"center",
    dataIndex: 'materialType'
   },
   {
    title: '所属货主',
    align:"center",
    dataIndex: 'ownerId_dictText'
   },
   {
    title: '长',
    align:"center",
    dataIndex: 'length'
   },
   {
    title: '宽',
    align:"center",
    dataIndex: 'width'
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
    title: '重量',
    align:"center",
    dataIndex: 'weight'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '包材名称',
    field: 'materialName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '包材编号',
    field: 'materialCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '包材类型',
    field: 'materialType',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'dict_item_status',
      placeholder: '请选择状态',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '包材编号',
    field: 'materialCode',
    component: 'Input',
  },
  {
    label: '包材名称',
    field: 'materialName',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入包材名称' }];
    },
  },
  {
    label: '包材类型',
    field: 'materialType',
    component: 'Input',
  },
  {
    label: '所属货主',
    field: 'ownerId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'wms_cargo_owners,owner_name,id',
      placeholder: '请选择所属货主',
    },
  },
  {
    label: '长',
    field: 'length',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '宽',
    field: 'width',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '高',
    field: 'height',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '体积',
    field: 'volume',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '重量',
    field: 'weight',
    component: 'InputNumber',
    defaultValue: 0,
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'dict_item_status',
      placeholder: '请选择状态',
      defaultValue: '1',
    },
    defaultValue: '1',
  },
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

// 高级查询数据
export const superQuerySchema = {
  materialCode: {title: '包材编号',order: 0,view: 'text', type: 'string',},
  materialType: {title: '包材类型',order: 1,view: 'text', type: 'string',},
  materialName: {title: '包材名称',order: 2,view: 'text', type: 'string',},
  ownerId: {title: '所属货主',order: 3,view: 'list', type: 'string',dictCode: 'wms_cargo_owners,owner_name,id',},
  length: {title: '长',order: 4,view: 'number', type: 'number',},
  width: {title: '宽',order: 5,view: 'number', type: 'number',},
  height: {title: '高',order: 6,view: 'number', type: 'number',},
  volume: {title: '体积',order: 7,view: 'number', type: 'number',},
  weight: {title: '重量',order: 8,view: 'number', type: 'number',},
  status: {title: '状态',order: 9,view: 'list', type: 'string',dictCode: 'dict_item_status',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  return formSchema;
}
