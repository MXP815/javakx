import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { validateSpaceStr } from '/@/utils/validate';
import { useMessage } from '/@/hooks/web/useMessage';
import { options } from '../monitor/mynews/XssWhiteList';
const { createMessage } = useMessage();
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '报警规则名称',
    align: 'center',
    dataIndex: 'ruleName',
  },
  {
    title: '报警级别',
    align: 'center',
    dataIndex: 'alertLevel',
    slots: { customRender: 'alertLevel' },
  },
  {
    title: '所属产品',
    align: 'center',
    dataIndex: 'productName',
  },
  {
    title: '关联设备',
    align: 'center',
    dataIndex: 'deviceName',
  },
  {
    title: '异常数据',
    align: 'center',
    dataIndex: 'alertData',
    slots: { customRender: 'alertData' },
  },
  {
    title: '所属仓库',
    align: 'center',
    dataIndex: 'warehouseName',
  },
  {
    title: '处理进度',
    align: 'center',
    dataIndex: 'processStatus',
    slots: { customRender: 'processStatus' },
  },
  {
    title: '报警时间',
    align: 'center',
    dataIndex: 'alertTime',
  },
];
// //查询数据
// export const searchFormSchema: FormSchema[] = [
//   {
//     label: '所属产品',
//     field: 'productCode',
//     component: 'JSearchSelect',
//     componentProps: {
//       dict: 'wms_iot_product,product_name,product_code',
//       //是否为搜索模式
//       showSearch: false,
//       //是否禁用
//       disabled: false,
//       placeholder: '请选择',
//     },
//   },
//   {
//     label: '设备名称',
//     field: 'deviceCode',
//     component: 'JSearchSelect',
//     componentProps: {
//       dict: 'wms_iot_device,device_name,device_code',
//       //是否为搜索模式
//       showSearch: false,
//       //是否禁用
//       disabled: false,
//       placeholder: '请选择',
//     },
//   },
//   {
//     label: '报警级别',
//     field: 'alertLevel',
//     component: 'JDictSelectTag',
//     componentProps: {
//       dictCode: 'alert_level_dict',
//       placeholder: '请选择',
//     },
//     //colProps: {span: 6},
//   },
// ];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '处理进度',
    field: 'processStatus',
    defaultValue: '1',
    component: 'JDictSelectTag',
    componentProps: {
      // dictCode: 'alert_process_status_dict',
      options: [
        { label: '已解决', value: '1' },
        { label: '不予解决', value: '2' },
      ],
      type: 'radio',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入处理进度!' }];
    },
  },
  {
    label: '处理方案',
    field: 'processPlan',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 500,
      showCount: true,
      placeholder: '请输入内容',
    },
    ifShow: ({ values }) => {
      return values.processStatus === '1';
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '处理方案不能为空' }];
    },
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 500,
      showCount: true,
      rows: 3,
      placeholder: '请输入内容',
      // onChange: (e) => {
      //   const reg = /^\S*$/;
      //   if (!reg.test(e.target.value)) {
      //     createMessage.error('仅支持中英文、数字、下划线、短划线、@、英文括号！');
      //   }
      // },
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

// 高级查询数据
export const superQuerySchema = {
  ruleName: { title: '报警规则名称', order: 1, view: 'text', type: 'string' },
  alertLevel: { title: '报警级别', order: 3, view: 'list', type: 'string', dictCode: 'alert_level_dict' },
  productName: { title: '所属产品', order: 4, view: 'link_table', type: 'string' },
  deviceName: { title: '关联设备', order: 6, view: 'link_table', type: 'string' },
  alertData: { title: '异常数据', order: 7, view: 'number', type: 'number' },
  warehouseName: { title: '所属仓库', order: 8, view: 'link_table', type: 'string' },
  processStatus: { title: '处理进度', order: 9, view: 'text', type: 'string' },
  alertTime: { title: '报警时间', order: 12, view: 'datetime', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
