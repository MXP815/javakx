import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { validateSpaceStr, validateSpace } from '/@/utils/validate';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '产品图片',
    align: 'center',
    dataIndex: 'imageUrl',
    customRender: render.renderImage,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'productName',
  },
  {
    title: '产品编码',
    align: 'center',
    dataIndex: 'productCode',
  },
  {
    title: '节点类型',
    align: 'center',
    dataIndex: 'nodeType_dictText',
  },
  {
    title: '连网方式',
    align: 'center',
    dataIndex: 'networkMode_dictText',
  },
  {
    title: '认证方式',
    align: 'center',
    dataIndex: 'authType',
  },
  {
    title: '关联设备数',
    align: 'center',
    dataIndex: 'num',
  },
  {
    title: '产品描述',
    width: '260px',
    align: 'center',
    dataIndex: 'productDesc',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
  },
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   width: '280px', // 固定宽度
  //   fixed: 'right', // 固定在右侧
  // },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '产品名称',
    field: 'productName',
    component: 'JInput',
    componentProps: {
      placeholder: '请输入',
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '产品图片',
    field: 'imageUrl',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '产品图片不能为空' }];
    },
    // slot: 'JImageUpload',
  },
  {
    label: '产品名称',
    field: 'productName',
    component: 'Input',
    componentProps: {
      maxlength: 30,
      showCount: true,
      placeholder: '请输入',
    },
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '产品名称不能为空' },
        {
          validator: () => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              console.log(model);
              validateSpaceStr(model.productName, resolve, reject);
            });
          },
        },
      ];
    },
  },
  {
    label: '产品编码',
    field: 'productCode',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '产品编码不能为空' },
        {
          validator: () => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              validateSpace(model.productCode, resolve, reject);
            });
          },
        },
      ];
    },
    componentProps: {
      maxlength: 50,
      showCount: true,
      placeholder: '请输入',
    },
    // 使用dynamicDisabled动态控制表单组件禁用
    dynamicDisabled: ({ values }) => {
      return values.id;
    },
  },
  {
    label: '节点类型',
    field: 'nodeType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'product_node_type_dict',
      placeholder: '请选择',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '节点类型不能为空' }];
    },
    // 使用dynamicDisabled动态控制表单组件禁用
    dynamicDisabled: ({ values }) => {
      return values.id;
    },
  },
  {
    label: '连网方式',
    field: 'networkMode',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'product_network_mode_dict',
      placeholder: '请选择',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '连网方式不能为空' }];
    },
    // 使用dynamicDisabled动态控制表单组件禁用
    dynamicDisabled: ({ values }) => {
      return values.id;
    },
  },
  {
    label: '认证方式',
    field: 'authType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'auth_type_dict',
      placeholder: '请选择',
    },
    // 使用dynamicDisabled动态控制表单组件禁用
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '连网方式不能为空' }];
    },
  },
  // {
  //   label: '认证方式',
  //   field: 'authType',
  //   component: 'Input',
  //   componentProps: {
  //     maxlength: 50,
  //     showCount: true,
  //     placeholder: '请输入',
  //   },
  //   // 使用dynamicDisabled动态控制表单组件禁用
  //   dynamicDisabled: ({ values }) => {
  //     return values.id;
  //   },
  //   dynamicRules: ({ model, schema }) => {
  //     return [
  //       { required: true, message: '认证方式不能为空' },
  //       {
  //         validator: () => {
  //           //需要return 一个Promise对象
  //           return new Promise((resolve, reject) => {
  //             validateSpaceStr(model.authType, resolve, reject);
  //           });
  //         },
  //       },
  //     ];
  //   },
  // },
  {
    label: '产品描述',
    field: 'productDesc',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 500,
      showCount: true,
      // autosize: true,
      rows: 3,
      placeholder: '请输入内容',
    },
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '产品描述不能为空' },
        {
          validator: () => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              validateSpaceStr(model.productDesc, resolve, reject);
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
  imageUrl: { title: '产品图片', order: 0, view: 'image', type: 'string' },
  productName: { title: '产品名称', order: 1, view: 'text', type: 'string' },
  productCode: { title: '产品编码', order: 2, view: 'text', type: 'string' },
  nodeType: { title: '节点类型', order: 3, view: 'list', type: 'string', dictCode: 'product_node_type_dict' },
  networkMode: { title: '连网方式', order: 4, view: 'list', type: 'string', dictCode: 'product_network_mode_dict' },
  authType: { title: '认证方式', order: 5, view: 'text', type: 'string' },
  productDesc: { title: '产品描述', order: 6, view: 'textarea', type: 'string' },
  createTime: { title: '创建日期', order: 7, view: 'datetime', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
