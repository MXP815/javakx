import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '报警规则名称',
    align: 'center',
    dataIndex: 'alertName',
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
    title: '所属仓库',
    align: 'center',
    dataIndex: 'warehouseName',
  },
  {
    title: '报警级别',
    align: 'center',
    dataIndex: 'alertLevel',
    slots: { customRender: 'alertLevel' },
  },
  {
    title: '报警规则',
    width: '280px',
    align: 'center',
    dataIndex: 'modelName',
    slots: { customRender: 'modelName' },
  },
  {
    title: '沉默周期',
    align: 'center',
    dataIndex: 'ignoreDuration',
    slots: { customRender: 'ignoreDuration' },
  },
  {
    title: '启用/禁用',
    align: 'center',
    dataIndex: 'isEnable',
    slots: { customRender: 'isEnable' },
  },
  {
    title: '创建时间',
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
      placeholder: '请选择',
    },
  },
  {
    label: '设备名称',
    field: 'deviceCode',
    component: 'JSearchSelect',
    componentProps: {
      dict: 'wms_iot_device,device_name,device_code',
      //是否为搜索模式
      showSearch: false,
      //是否禁用
      disabled: false,
      placeholder: '请选择',
    },
  },
  {
    label: '设备级别',
    field: 'alertLevel',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'alert_level_dict',
      placeholder: '请选择',
    },
    //colProps: {span: 6},
  },
];
// 高级查询数据
export const superQuerySchema = {
  alertName: { title: '报警规则名称', order: 0, view: 'text', type: 'string' },
  productName: { title: '所属产品', order: 1, view: 'link_table', type: 'string' },
  deviceName: { title: '关联设备', order: 2, view: 'link_table', type: 'string' },
  alertLevel: { title: '报警级别', order: 4, view: 'list', type: 'string', dictCode: 'alert_level_dict' },
  ignoreDuration: { title: '沉默周期', order: 8, view: 'number', type: 'number', dictCode: 'ignore_duration_dict' },
  isEnable: { title: '启用/禁用', order: 9, view: 'switch', type: 'string' },
  createTime: { title: '创建时间', order: 11, view: 'datetime', type: 'string' },
};
