import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';

import { list as warehouseList} from "@/views/warehouse/WmsWarehouses.api";
import {list as storageZones} from "@/views/warehouse/WmsStorageZones.api";
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '货位编码',
    align:"center",
    dataIndex: 'locationCode'
   },
   {
    title: '货位类别',
    align:"center",
    dataIndex: 'locationCategory'
   },
   {
    title: '货位类型',
    align:"center",
    dataIndex: 'locationType_dictText'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   {
    title: '所属冷库',
    align:"center",
    dataIndex: 'warehouseId'
   },
   {
    title: '所属温区',
    align:"center",
    dataIndex: 'zoneId'
   },
   {
    title: '巷道',
    align:"center",
    dataIndex: 'locationAisle'
   },
   {
    title: '排',
    align:"center",
    dataIndex: 'locationLine'
   },
   {
    title: '列',
    align:"center",
    dataIndex: 'locationRank'
   },
   {
    title: '层',
    align:"center",
    dataIndex: 'locationLayer'
   },
   {
    title: '长',
    align:"center",
    dataIndex: 'locationLength'
   },
   {
    title: '宽',
    align:"center",
    dataIndex: 'locationWidth'
   },
   {
    title: '容积',
    align:"center",
    dataIndex: 'locationCapacity'
   },
   {
    title: '承重',
    align:"center",
    dataIndex: 'loadCapacity'
   },
   {
    title: '是否可售',
    align:"center",
    dataIndex: 'isSellable_dictText'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '货位编码',
    field: 'locationCode',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入货位编码!'},
          ];
     },
  },
  {
    label: '货位类别',
    field: 'locationCategory',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入货位类别!'},
          ];
     },
  },
  {
    label: '货位类型',
    field: 'locationType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"location_type"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入货位类型!'},
          ];
     },
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: "1",
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"dict_item_status"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入状态!'},
          ];
     },
  },
  {
    label: '所属冷库',
    field: 'warehouseId',
    component: 'ApiSelect',
    componentProps: ({ formModel, formActionType }) => {
      return {
        api: warehouseList,
        resultField: 'records',
        labelField: 'warehouseName',
        valueField: 'id',
        onChange: (e: any) => {
          formModel.zoneId = undefined;
          formModel.isStart='2'
          if (e === undefined) {
            const { updateSchema } = formActionType;
            updateSchema({
              field: 'zoneId',
              component: 'Select',
              componentProps: {
                options: [],
              },
            });
            return ;
          }else{
            //请求温区数据
            storageZones( {
              warehouseId: e
            }).then((res) => {
              //抽取温区数据
              const zones= res.records.map(item => ({
                value: item.id,
                label: item.zoneName
              }));
              // console.log(zones)
              const { updateSchema } = formActionType;
              updateSchema({
                field: 'zoneId',
                component: 'Select',
                componentProps: {
                  options: zones,
                },
              });
            });
          }

        },
      };
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入所属冷库!'},
          ];
     },
  },
  {
    label: '所属温区',
    field: 'zoneId',
    component: 'Select',
    componentProps: {
      options: [], // defalut []
      placeholder: '所属温区',
    }
  },
  {
    label: '巷道',
    field: 'locationAisle',
    component: 'Input',
  },
  {
    label: '排',
    field: 'locationLine',
    component: 'Input',
  },
  {
    label: '列',
    field: 'locationRank',
    component: 'Input',
  },
  {
    label: '层',
    field: 'locationLayer',
    component: 'Input',
  },
  {
    label: '长',
    field: 'locationLength',
    component: 'InputNumber',
  },
  {
    label: '宽',
    field: 'locationWidth',
    component: 'InputNumber',
  },
  {
    label: '容积',
    field: 'locationCapacity',
    component: 'InputNumber',
  },
  {
    label: '承重',
    field: 'loadCapacity',
    component: 'InputNumber',
  },
  {
    label: '是否可售',
    field: 'isSellable',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"yn"
     },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入是否可售!'},
          ];
     },
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];

// 高级查询数据
export const superQuerySchema = {
  locationCode: {title: '货位编码',order: 0,view: 'text', type: 'string',},
  locationCategory: {title: '货位类别',order: 1,view: 'text', type: 'string',},
  locationType: {title: '货位类型',order: 2,view: 'list', type: 'string',dictCode: 'location_type',},
  status: {title: '状态',order: 3,view: 'list', type: 'string',dictCode: 'dict_item_status',},
  warehouseId: {title: '所属冷库',order: 4,view: 'link_table', type: 'string',},
  zoneId: {title: '所属温区',order: 5,view: 'link_table', type: 'string',},
  locationAisle: {title: '巷道',order: 6,view: 'text', type: 'string',},
  locationLine: {title: '排',order: 7,view: 'text', type: 'string',},
  locationRank: {title: '列',order: 8,view: 'text', type: 'string',},
  locationLayer: {title: '层',order: 9,view: 'text', type: 'string',},
  locationLength: {title: '长',order: 10,view: 'number', type: 'number',},
  locationWidth: {title: '宽',order: 11,view: 'number', type: 'number',},
  locationCapacity: {title: '容积',order: 12,view: 'number', type: 'number',},
  loadCapacity: {title: '承重',order: 13,view: 'number', type: 'number',},
  isSellable: {title: '是否可售',order: 14,view: 'list', type: 'string',dictCode: 'yn',},
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
