import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '承运商编码',
    align:"center",
    dataIndex: 'carrierCode'
   },
   {
    title: '承运商名称',
    align:"center",
    dataIndex: 'carrierName'
   },
   {
    title: '类型',
    align:"center",
    dataIndex: 'carrierType'
   },
   {
    title: '联系人',
    align:"center",
    dataIndex: 'contactPerson'
   },
   {
    title: '联系电话',
    align:"center",
    dataIndex: 'contactPhone'
   },
   {
    title: '城市',
    align:"center",
    dataIndex: 'city'
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
    label: '承运商名称',
    field: 'carrierName',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '承运商编码',
    field: 'carrierCode',
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
    label: '承运商编码',
    field: 'carrierCode',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入承运商编码' }];
    },
  },
  {
    label: '承运商名称',
    field: 'carrierName',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入承运商名称' }];
    },
  },
  {
    label: '类型',
    field: 'carrierType',
    component: 'Input',
  },
  {
    label: '联系人',
    field: 'contactPerson',
    component: 'Input',
  },
  {
    label: '联系电话',
    field: 'contactPhone',
    component: 'Input',
  },
  {
    label: '联系邮箱',
    field: 'contactEmail',
    component: 'Input',
  },
  {
    label: '地址',
    field: 'address',
    component: 'Input',
  },
  {
    label: '国家',
    field: 'country',
    component: 'Input',
  },
  {
    label: '省份',
    field: 'province',
    component: 'Input',
  },
  {
    label: '城市',
    field: 'city',
    component: 'Input',
  },
  {
    label: '邮编',
    field: 'postalCode',
    component: 'Input',
  },
  {
    label: '税号',
    field: 'taxId',
    component: 'Input',
  },
  {
    label: '银行账户',
    field: 'bankAccount',
    component: 'Input',
  },
  {
    label: '开户银行',
    field: 'bankName',
    component: 'Input',
  },
  {
    label: '账户持有人',
    field: 'accountHolder',
    component: 'Input',
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
  carrierCode: {title: '承运商编码',order: 0,view: 'text', type: 'string',},
  carrierName: {title: '承运商名称',order: 1,view: 'text', type: 'string',},
  carrierType: {title: '类型',order: 2,view: 'text', type: 'string',},
  contactPerson: {title: '联系人',order: 3,view: 'text', type: 'string',},
  contactPhone: {title: '联系电话',order: 4,view: 'text', type: 'string',},
  contactEmail: {title: '联系邮箱',order: 5,view: 'text', type: 'string',},
  address: {title: '地址',order: 6,view: 'text', type: 'string',},
  country: {title: '国家',order: 7,view: 'text', type: 'string',},
  province: {title: '省份',order: 8,view: 'text', type: 'string',},
  city: {title: '城市',order: 9,view: 'text', type: 'string',},
  postalCode: {title: '邮编',order: 10,view: 'text', type: 'string',},
  taxId: {title: '税号',order: 11,view: 'text', type: 'string',},
  bankAccount: {title: '银行账户',order: 12,view: 'text', type: 'string',},
  bankName: {title: '开户银行',order: 13,view: 'text', type: 'string',},
  accountHolder: {title: '账户持有人',order: 14,view: 'text', type: 'string',},
  status: {title: '状态',order: 15,view: 'list', type: 'string',dictCode: 'dict_item_status',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  return formSchema;
}
