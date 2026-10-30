import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '品牌名称',
    align:"center",
    dataIndex: 'name'
   },
   {
    title: '品牌logo',
    align:"center",
    dataIndex: 'logo',
    customRender: render.renderImage,
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '创建人',
    align:"center",
    dataIndex: 'createBy'
   },
   {
    title: '创建时间',
    align:"center",
    dataIndex: 'createTime',
    customRender:({text}) =>{
      text = !text ? "" : (text.length > 10 ? text.substr(0,10) : text);
      return text;
    },
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '品牌名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'wms_status',
      placeholder: '请选择状态',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '品牌名称',
    field: 'name',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入品牌名称' }];
    },
  },
  {
    label: '品牌logo',
    field: 'logo',
    component: 'JImageUpload',
    componentProps: {
      fileMax: 1,
    },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'wms_status',
      placeholder: '请选择状态',
      defaultValue: 'CREATED',
    },
    defaultValue: 'CREATED',
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
  name: {title: '品牌名称',order: 0,view: 'text', type: 'string',},
  status: {title: '状态',order: 1,view: 'list', type: 'string',dictCode: 'wms_status',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  return formSchema;
}
