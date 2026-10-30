import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import {h} from 'vue';
import {Tag} from 'ant-design-vue';

//列表数据
export const columns: BasicColumn[] = [
   {
    title: '类别名称',
    align:"left",
    dataIndex: 'categoryName',
    width: 300
   },
   {
    title: '类别编码',
    align:"center",
    dataIndex: 'categoryCode'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status',
    customRender: ({text}) => {
      return text === '1' ? h(Tag, {color: 'green'}, () => '启用') : h(Tag, {color: 'red'}, () => '停用');
    },
   },
   {
    title: '创建时间',
    align:"center",
    dataIndex: 'createTime'
   },
];

//查询条件
export const searchFormSchema: FormSchema[] = [
   {
    label: '类别名称',
    field: 'categoryName',
    component: 'JInput',
    colProps: {span: 6},
   },
];

//表单数据
export const formSchema: FormSchema[] = [
   {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
   },
   {
    label: '父级节点',
    field: 'parentId',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'categoryName',
        value: 'id',
        children: 'children',
      },
      dropdownStyle: {
        maxHeight: '50vh',
      },
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: ({values}) => {
      return !!values.id;
    },
   },
   {
    label: '类别名称',
    field: 'categoryName',
    required: true,
    component: 'Input',
   },
   {
    label: '类别编码',
    field: 'categoryCode',
    component: 'Input',
   },
   {
    label: '状态',
    field: 'status',
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        {label: '启用', value: '1'},
        {label: '停用', value: '0'},
      ],
    },
   },
];
