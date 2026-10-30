import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
import {JVxeColumn, JVxeTypes} from "@/components/jeecg/JVxeTable/src/types";
import {list} from "@/views/warehouse/WmsWarehouses.api";
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '波次编号',
    align:"center",
    dataIndex: 'waveNo',
     width:"200px",
   },

   {
    title: '波次策略',
    align:"center",
    dataIndex: 'waveRuleId'
   },
   {
    title: '订单数量',
    align:"center",
    dataIndex: 'totalOrders'
   },
   {
    title: '分拣订单数量',
    align:"center",
    dataIndex: 'sortingOrderQuantity'
   },
   {
    title: 'sku种类数量',
    align:"center",
    dataIndex: 'totalItems'
   },
  {
    title: 'sku数量',
    align:"center",
    dataIndex: 'totalSkus'
  },
   {
     title: '拣货数量',
     align:"center",
     dataIndex: 'pickedQuantity'
   },
   {
     title: '分拣数量',
     align:"center",
     dataIndex: 'sortingQuantity'
   },
  {
    title: '包裹数量',
    align:"center",
    dataIndex: 'totalShipments'
  },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status',
     customRender: ({text}) => {
       return render.renderDict(text, 'wave_status');
     }
   },
  {
    title: '冷库',
    align:"center",
    dataIndex: 'warehouseId',
    //不显示
    ifShow:false,
  },
  {
    title: '冷库',
    align:"center",
    dataIndex: 'warehouseName'
  },
  {
    title: '温区',
    align:"center",
    dataIndex: 'zoneId'
  },
   {
    title: '备注',
    align:"center",
    dataIndex: 'remark'
   },

];
//查询数据
export const searchFormSchema: FormSchema[] = [
  //波次号 waveNo
  {
    label: '波次号',
    field: 'waveNo',
    component: 'Input',
  },
  {
    label: '波次状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode:"wave_status"
    },


  }
];

//表单数据
export const formSchemaAdd: FormSchema[] = [
  //冷库
   {
     label: '冷库',
     field: 'warehouseId',
     component: 'ApiSelect',
     componentProps: {
       api: list,
       resultField: 'records',
       labelField: 'warehouseName',
       valueField: 'id',
     },
     dynamicRules: ({model,schema}) => {
       return [
         { required: true, message: '请选择冷库!'},
       ];
     },
   },
  //波次策略 多选
  {
    label: '波次策略',
    field: 'strategyCodes',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'wms_wave_strategy,strategy_name,strategy_code',
      triggerChange:true
    },
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请选择波次策略!'},
      ];
    },
  },
]
//暂时不用
export const formSchema: FormSchema[] = [
  {
    label: '波次编号',
    field: 'waveNo',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入波次编号!'},
          ];
     },
  },
  {
    label: '冷库',
    field: 'warehouseId',
    component: 'ApiSelect',
    componentProps: {
      api: list,
      resultField: 'records',
      labelField: 'warehouseName',
      valueField: 'id',
    },
  },
  // {
  //   label: '温区id',
  //   field: 'zoneId',
  //   component: 'Input',
  // },
  {
    label: '波次策略',
    field: 'waveRuleId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "wms_wave_strategy,strategy_name,strategy_code",
      //是否为搜索模式
      showSearch: true,
      //是否禁用
      disabled: false
    },
    // component: 'Input',
    // dynamicRules: ({model,schema}) => {
    //       return [
    //              { required: true, message: '请输入波次策略!'},
    //       ];
    //  },
  },
  {
    label: '订单数量',
    field: 'totalOrders',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入订单数量!'},
          ];
     },
  },
  {
    label: 'sku种类数量',
    field: 'totalItems',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入sku种类数量!'},
          ];
     },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"out_order_status"
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
  },
  {
    label: 'sku数量',
    field: 'totalSkus',
    component: 'InputNumber',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入sku数量!'},
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
//子表列表数据-波次下拣货任务列表
export const wmsShipmentsColumns: JVxeColumn[] = [
  {
    title: '出库单',
    key: 'orderId',
    width:"200px",
    defaultValue:'',
  },
  {
    title: '包裹编号',
    key: 'shipmentNo',
    width:"200px",
    defaultValue:'',
  },
  {
    title: '物流商',
    key: 'carrierName',
    width:"200px",
    defaultValue:'',
  },
  {
    title: '物流单号',
    key: 'trackingNo',
    width:"200px",
    defaultValue:'',
  },
  {
    title: '总重量(kg)',
    key: 'totalWeight',
    width:"200px",
    defaultValue:'',
  },
  {
    title: '件数',
    key: 'packageCount',
    width:"200px",
    defaultValue:'',
  },
  {
    title: '状态',
    key: 'status',
    width:"200px",
    type: JVxeTypes.select,
    dictCode: 'shipment_status',
    disabled:true,
  },
]
//子表列表数据-波次下拣货任务列表
export const wmsPickTasksColumns: JVxeColumn[] = [
  {
    title: '拣货任务编号',
    key: 'taskNumber',
    width:"150px",
  },
  {
    title: '任务类型',
    key: 'taskType',
    width:"150px",
    type: JVxeTypes.select,
    dictCode: 'task_type',
    disabled:true,
  },
  {
    title: '任务状态',
    key: 'taskStatus',
    width:"150px",
    type: JVxeTypes.select,
    dictCode: 'task_status',
    disabled:true,
  },
  {
    title: '供应商',
    align:"center",
    width:"150px",
    key: 'ownerName'
  },
  {
    title: '农产品',
    align:"center",
    width:"150px",
    key: 'productName'
  },
  {
    title: '来源货位编码',
    align:"center",
    width:"150px",
    key: 'sourceLocationCode'
  },
  {
    title: '来源容器编码',
    align:"center",
    width:"150px",
    key: 'sourceContainerCode'
  },
  /**
   * 批次号
   */
  {
    title: '批次号',
    align:"center",
    width:"150px",
    key: 'batchNumber'
  },
  /**
   * 保鲜期
   */
  {
    title: '保鲜期',
    align:"center",
    width:"150px",
    key: 'expiryDate',
  },
  {
    title: '待拣货数量',
    align:"center",
    width:"150px",
    key: 'quantity'
  },
  {
    title: '完成数量',
    align:"center",
    width:"150px",
    key: 'completedQuantity'
  },

]
//子表列表数据-波次下出库单列表
export const wmsOutOrdersColumns: JVxeColumn[] = [
  {
    title: '出库单号',
    key: 'orderNo',
    width:"200px",
    defaultValue:'',
  },
  {
    title: '出库类型',
    key: 'orderType',
    type: JVxeTypes.select,
    dictCode: 'out_order_type',
    width:"200px",
    defaultValue:'',
    disabled:true,
  },
  {
    title: '订单来源',
    key: 'orderSource',
    type: JVxeTypes.select,
    dictCode: 'out_order_source',
    width:"200px",
    defaultValue:'',
    disabled:true,
  },
  {
   title: '来源单号',
   align:"center",
    width:"200px",
    type: JVxeTypes.input,
    key: 'orderSourceNo',
    disabled:true,
  },
  {
   title: '总农产品数量',
   align:"center",
    width:"200px",
    type: JVxeTypes.input,
    key: 'totalQuantity'
  },
  {
   title: '总sku种类数',
   align:"center",
    width:"200px",
    type: JVxeTypes.input,
    key: 'totalSku'
  },
  {
   title: '总重量',
   align:"center",
    width:"200px",
    type: JVxeTypes.input,
    key: 'totalWeight'
  },
  {
   title: '总体积',
   align:"center",
    width:"200px",
    type: JVxeTypes.input,
    key: 'totalVolume'
  },
  {
   title: '状态',
   align:"center",
    type: JVxeTypes.select,
    key: 'status',
    dictCode: 'out_order_status',
    width:"200px",
    defaultValue:'',
    disabled:true,
  },
];
//子表表单数据
export const wmsOutOrdersFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false
  },
  {
    label: '出库单号',
    field: 'orderNo',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入出库单号!'},
          ];
     },
  },
  {
    label: '出库类型',
    field: 'orderType',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入出库类型!'},
          ];
     },
  },
  {
    label: '订单来源',
    field: 'orderSource',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入订单来源!'},
          ];
     },
  },
  {
    label: '来源单号',
    field: 'orderSourceNo',
    component: 'Input',
  },
  {
    label: '冷库id',
    field: 'warehouseId',
    component: 'Input',
  },
  {
    label: '供应商id',
    field: 'ownerId',
    component: 'Input',
  },
  {
    label: '客户id',
    field: 'customerId',
    component: 'Input',
  },
  {
    label: '预计配送时间',
    field: 'expectedShipTime',
    component: 'DatePicker',
    componentProps: {
       showTime:true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '实际配送时间',
    field: 'actualShipTime',
    component: 'DatePicker',
    componentProps: {
       showTime:true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '总农产品数量',
    field: 'totalQuantity',
    component: 'InputNumber',
  },
  {
    label: '总sku种类数',
    field: 'totalSku',
    component: 'InputNumber',
  },
  {
    label: '总重量',
    field: 'totalWeight',
    component: 'InputNumber',
  },
  {
    label: '总体积',
    field: 'totalVolume',
    component: 'InputNumber',
  },
  {
    label: '物流商编码',
    field: 'carrierCode',
    component: 'Input',
  },
  {
    label: '物流单号',
    field: 'trackingNo',
    component: 'Input',
  },
  {
    label: '收货人',
    field: 'consignee',
    component: 'Input',
  },
  {
    label: '收货时间',
    field: 'shippingTime',
    component: 'DatePicker',
    componentProps: {
       showTime:true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '收货地址',
    field: 'shippingAddress',
    component: 'Input',
  },
  {
    label: '联系方式',
    field: 'contact',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入状态!'},
          ];
     },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
  },
  {
    label: '波次id',
    field: 'waveId',
    component: 'Input',
  },
];

// 高级查询数据
export const superQuerySchema = {
  waveNo: {title: '波次编号',order: 0,view: 'text', type: 'string',},
  warehouseId: {title: '冷库id',order: 1,view: 'text', type: 'string',},
  zoneId: {title: '温区id',order: 2,view: 'text', type: 'string',},
  waveRuleId: {title: '波次策略',order: 3,view: 'text', type: 'string',},
  totalOrders: {title: '订单数量',order: 4,view: 'number', type: 'number',},
  totalItems: {title: 'sku种类数量',order: 5,view: 'number', type: 'number',},
  status: {title: '状态',order: 6,view: 'text', type: 'string',},
  remark: {title: '备注',order: 7,view: 'text', type: 'string',},
  totalSkus: {title: 'sku数量',order: 8,view: 'number', type: 'number',},
};
