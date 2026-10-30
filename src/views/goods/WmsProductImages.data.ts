import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '所属农产品',
    align:"center",
    dataIndex: 'productId_dictText'
   },
   {
    title: '原始图片',
    align:"center",
    dataIndex: 'original',
    customRender: render.renderImage,
   },
   {
    title: '是否默认',
    align:"center",
    dataIndex: 'isDefault',
    customRender: ({text}) => {
      if (text === '1') {
        return '是';
      }
      if (text === '0') {
        return '否';
      }
      return text;
    },
   },
   {
    title: '小图',
    align:"center",
    dataIndex: 'small'
   },
   {
    title: '缩略图',
    align:"center",
    dataIndex: 'thumbnail'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '所属农产品',
    field: 'productId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'wms_products,product_name,id',
      placeholder: '请选择所属农产品',
    },
    colProps: { span: 6 },
  },
  {
    label: '是否默认',
    field: 'isDefault',
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属农产品',
    field: 'productId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'wms_products,product_name,id',
      placeholder: '请选择所属农产品',
    },
  },
  {
    label: '原始图片',
    field: 'original',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
  },
  {
    label: '是否默认',
    field: 'isDefault',
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
    },
    defaultValue: '0',
  },
  {
    label: '小图',
    field: 'small',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
  },
  {
    label: '缩略图',
    field: 'thumbnail',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
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
  productId: {title: '所属农产品',order: 0,view: 'list', type: 'string',dictCode: 'wms_products,product_name,id',},
  isDefault: {title: '是否默认',order: 1,view: 'list', type: 'string',},
  original: {title: '原始图片',order: 2,view: 'text', type: 'string',},
  small: {title: '小图',order: 3,view: 'text', type: 'string',},
  thumbnail: {title: '缩略图',order: 4,view: 'text', type: 'string',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  return formSchema;
}
