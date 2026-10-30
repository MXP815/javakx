import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Table';
import { validateSpaceStr, validateSpaceNum } from '@/utils/validate';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '功能名称',
    align: 'center',
    dataIndex: 'modelName',
  },
  {
    title: '功能类型',
    align: 'center',
    dataIndex: 'type_dictText',
  },
  {
    title: '功能编码',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '单位',
    align: 'center',
    dataIndex: 'unit',
  },
  {
    title: '功能描述',
    align: 'center',
    dataIndex: 'modelDesc',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '功能类型',
    field: 'type',
    defaultValue: 'field',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'model_type_dict',
      type: 'radio',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '功能类型不能为空' }];
    },
    // 使用dynamicDisabled动态控制表单组件禁用
    dynamicDisabled: ({ values }) => {
      return values.id;
    },
  },
  {
    label: '功能名称',
    field: 'modelName',
    component: 'Input',
    componentProps: {
      maxlength: 30,
      showCount: true,
      placeholder: '请输入',
    },
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '功能名称不能为空' },
        {
          validator: () => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              validateSpaceStr(model.modelName, resolve, reject);
            });
          },
        },
      ];
    },
  },
  {
    label: '功能编码',
    field: 'code',
    component: 'Input',
    componentProps: {
      maxlength: 50,
      showCount: true,
      placeholder: '请输入',
    },
    // 使用dynamicDisabled动态控制表单组件禁用
    dynamicDisabled: ({ values }) => {
      return values.id;
    },
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '功能编码不能为空' },
        {
          validator: () => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              validateSpaceNum(model.code, resolve, reject);
            });
          },
        },
      ];
    },
  },
  {
    label: '单位',
    field: 'unit',
    component: 'Input',
    ifShow: ({ values }) => {
      return values.type == 'field';
    },
    componentProps: {
      maxlength: 5,
      showCount: true,
      placeholder: '请输入',
    },
  },
  {
    label: '指令',
    field: 'command',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 200,
      showCount: true,
      rows: 3,
      placeholder: '请输入内容',
    },
    // 使用show或者ifShow 属性来控制表单组件的显示和隐藏
    ifShow: ({ values }) => {
      console.log(values, 123654);
      return values.type == 'service';
    },
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '指令不能为空' },
        {
          validator: () => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              console.log(model);
              validateSpaceNum(model.command, resolve, reject);
            });
          },
        },
      ];
    },
  },
  {
    label: '是否传参',
    field: 'needExtraArg',
    defaultValue: '1',
    component: 'JDictSelectTag',
    ifShow: ({ values }) => {
      return values.type == 'service';
    },
    componentProps: {
      dictCode: 'yes_no_dict',
      type: 'radio',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '是否传参不能为空' }];
    },
  },
  {
    label: '参数类型',
    field: 'argType',
    component: 'JDictSelectTag',
    ifShow: ({ values }) => {
      return values.needExtraArg == '1' && values.type == 'service';
    },
    componentProps: {
      dictCode: 'model_arg_type_dict',
      placeholder: '请选择',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '参数类型不能为空' }];
    },
  },
  {
    label: '功能描述',
    field: 'modelDesc',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 500,
      showCount: true,
      rows: 3,
      placeholder: '请输入内容',
    },
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '功能描述不能为空' },
        {
          validator: () => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              validateSpaceStr(model.modelDesc, resolve, reject);
            });
          },
        },
      ];
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
  modelName: { title: '功能名称', order: 0, view: 'text', type: 'string' },
  type: { title: '功能类型', order: 1, view: 'radio', type: 'string', dictCode: 'model_type_dict' },
  code: { title: '功能编码', order: 2, view: 'text', type: 'string' },
  modelDesc: { title: '功能描述', order: 3, view: 'textarea', type: 'string' },
  createTime: { title: '创建时间', order: 7, view: 'datetime', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
