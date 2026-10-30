import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Table';
import { rules } from '@/utils/helper/validator';
import { render } from '@/utils/common/renderUtils';
import { validateSpaceStr, validateSpace } from '@/utils/validate';
import {list as warehouseList} from "@/views/warehouse/WmsWarehouses.api";

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '设备名称',
    align: 'center',
    dataIndex: 'deviceName',
  },
  {
    title: '设备编码',
    align: 'center',
    dataIndex: 'deviceCode',
  },
  {
    title: '所属产品',
    align: 'center',
    dataIndex: 'productName',
  },
  {
    title: '所属仓库',
    align: 'center',
    dataIndex: 'warehouseName',
  },
  {
    title: '设备状态',
    align: 'center',
    dataIndex: 'deviceStatus',
    key: 'deviceStatus',
    slots: { customRender: 'deviceStatus' },
  },
  {
    title: '启用/禁用',
    align: 'center',
    dataIndex: 'isEnable',
    slots: { customRender: 'isEnable' },
  },
  {
    title: '创建日期',
    align: 'center',
    dataIndex: 'createTime',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '所属产品',
    field: 'productCode',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'wms_iot_product,product_name,product_code',
      //是否为搜索模式
      showSearch: false,
      //是否禁用
      disabled: false,
    },
  },
  {
    label: '设备名称',
    field: 'deviceName',
    component: 'Input',
    //colProps: {span: 6},
  },

  {
    label: '所属仓库',
    field: 'warehouseCode',
    component: 'JSelectMultiple',
    slot: 'warehouseCode',
    // componentProps: {
    //   dictCode: 'wms_warehouses,warehouse_name,id',
    //   //是否为搜索模式
    //   showSearch: false,
    //   //是否禁用
    //   disabled: false,
    // },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '所属产品',
    field: 'productCode',
    component: 'JSearchSelect',

    componentProps: {
      dict: 'wms_iot_product,product_name,product_code',
      //是否为搜索模式
      showSearch: true,
      //是否禁用
      disabled: false,
      placeholder: '请选择',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '所属产品不能为空' }];
    },
  },
  {
    label: '设备名称',
    field: 'deviceName',
    component: 'Input',
    componentProps: {
      maxlength: 30,
      showCount: true,
      placeholder: '请输入',
    },
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '设备名称不能为空' },
        {
          validator: () => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              validateSpaceStr(model.deviceName, resolve, reject);
            });
          },
        },
      ];
    },
  },
  {
    label: '设备编码',
    field: 'deviceCode',
    component: 'Input',
    componentProps: {
      maxlength: 50,
      showCount: true,
      placeholder: '请输入',
    },
    dynamicRules: ({ model, schema }) => {
      return [
        { required: true, message: '设备编码不能为空' },
        {
          validator: () => {
            //需要return 一个Promise对象
            return new Promise((resolve, reject) => {
              validateSpace(model.deviceCode, resolve, reject);
            });
          },
        },
      ];
    },
    // 使用dynamicDisabled动态控制表单组件禁用
    dynamicDisabled: ({ values }) => {
      return values.id;
    },
  },
  {
    label: '所属仓库',
    field: 'warehouseCode',
    component: 'ApiSelect',
    componentProps: {
      api: warehouseList,
      resultField: 'records',
      labelField: 'warehouseName',
      valueField: 'id',
      placeholder: '所属仓库',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '所属仓库不能为空' }];
    },
  },
  {
    label: '设备备注',
    field: 'remark',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 500,
      showCount: true,
      rows: 3,
      placeholder: '请输入',
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
  deviceName: { title: '设备名称', order: 0, view: 'text', type: 'string' },
  deviceCode: { title: '设备编码', order: 1, view: 'text', type: 'string' },
  isEnable: { title: '启用/禁用', order: 2, view: 'switch', type: 'string' },
  createTime: { title: '创建日期', order: 4, view: 'datetime', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
