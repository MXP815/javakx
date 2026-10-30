import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '产品编码',
    align: "center",
    dataIndex: 'productCode'
  },
  {
    title: '产品名称',
    align: "center",
    dataIndex: 'productName'
  },
  {
    title: '设备编码',
    align: "center",
    dataIndex: 'deviceCode'
  },
  {
    title: '设备名称',
    align: "center",
    dataIndex: 'deviceName'
  },
  {
    title: '物模型编码',
    align: "center",
    dataIndex: 'modelCode'
  },
  {
    title: '物模型名称',
    align: "center",
    dataIndex: 'modelName'
  },
  {
    title: '单位',
    align: "center",
    dataIndex: 'unit'
  },
];

// 高级查询数据
export const superQuerySchema = {
  productCode: {title: '产品编码',order: 0,view: 'text', type: 'string',},
  productName: {title: '产品名称',order: 1,view: 'link_table', type: 'string',},
  deviceCode: {title: '设备编码',order: 2,view: 'text', type: 'string',},
  deviceName: {title: '设备名称',order: 3,view: 'link_table', type: 'string',},
  modelCode: {title: '物模型编码',order: 4,view: 'text', type: 'string',},
  modelName: {title: '物模型名称',order: 5,view: 'link_table', type: 'string',},
  unit: {title: '单位',order: 6,view: 'text', type: 'string',},
};
