import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {JVxeTypes,JVxeColumn} from '/@/components/jeecg/JVxeTable/types'
import { getWeekMonthQuarterYear } from '/@/utils';
import {computed} from "vue";
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '包裹编码',
    align:"center",
    dataIndex: 'shipmentNo'
   },
   {
    title: '出库单',
    align:"center",
    dataIndex: 'orderNo'
   },
   {
    title: '波次号',
    align:"center",
    dataIndex: 'waveNo'
   },
   {
    title: '包裹类型',
    align:"center",
    dataIndex: 'shipmentType',
     customRender: ({ text }) => {
       return render.renderDict(text, 'shipment_type');
     },
   },
   {
    title: '物流商',
    align:"center",
    dataIndex: 'carrierName'
   },
   {
    title: '物流单号',
    align:"center",
    dataIndex: 'trackingNo'
   },
   {
    title: '包材',
    align:"center",
    dataIndex: 'packagingId'
   },
   {
    title: '总重量',
    align:"center",
    dataIndex: 'totalWeight'
   },
   {
    title: '重量单位',
    align:"center",
    dataIndex: 'weightUnit'
   },
   {
    title: '长',
    align:"center",
    dataIndex: 'sizeLength'
   },
   {
    title: '宽',
    align:"center",
    dataIndex: 'sizeWidth'
   },
   {
    title: '高',
    align:"center",
    dataIndex: 'sizeHeight'
   },
   {
    title: '尺寸单位',
    align:"center",
    dataIndex: 'sizeUnit'
   },
   {
    title: '总体积',
    align:"center",
    dataIndex: 'totalVolume'
   },
   {
    title: '体积单位',
    align:"center",
    dataIndex: 'volumeUnit'
   },
   {
    title: '包裹件数',
    align:"center",
    dataIndex: 'packageCount'
   },
   {
    title: '送货地址',
    align:"center",
    dataIndex: 'fromAddress'
   },
   {
    title: '收货地址',
    align:"center",
    dataIndex: 'toAddress'
   },
   {
    title: '联系方式',
    align:"center",
    dataIndex: 'contact'
   },
   {
    title: '预计到达时间',
    align:"center",
    dataIndex: 'estimatedArrival'
   },
   {
    title: '实际配送时间',
    align:"center",
    dataIndex: 'actualDeparture'
   },
   {
    title: '实际到达时间',
    align:"center",
    dataIndex: 'actualArrival'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status',
     customRender: ({ text }) => {
       return render.renderDict(text, 'shipment_status');
     },
   },
   {
    title: '打包人',
    align:"center",
    dataIndex: 'packerId'
   },
   {
    title: '配送人',
    align:"center",
    dataIndex: 'shipperId'
   },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  //包裹号
   {
     label: '包裹号',
     field: 'shipmentNo',
     component: 'Input'
   },
  //出库单号
   {
     label: '出库单号',
     field: 'orderNo',
     component: 'Input'
   },
  //波次单号
   {
     label: '波次单号',
      field: 'waveNo',
     component: 'Input'
   }
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '包裹编码',
    field: 'shipmentNo',
    component: 'Input',
    //不可编辑
    componentProps: {
      disabled: true,
    }
  },
  {
    label: '出库单',
    field: 'orderId',
    component: 'Input',
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入出库单id!'},
          ];
     },
  },
  // {
  //   label: '波次id',
  //   field: 'waveId',
  //   component: 'Input',
  //   dynamicRules: ({model,schema}) => {
  //         return [
  //                { required: true, message: '请输入波次id!'},
  //         ];
  //    },
  // },
  {
    label: '包裹类型',
    field: 'shipmentType',
    //下拉
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"shipment_type"
    },
    dynamicRules: ({model,schema}) => {
          return [
                 { required: true, message: '请输入包裹类型!'},
          ];
     },
  },
  {
    label: '物流商',
    field: 'carrierId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "wms_carrier where status = '1',carrier_name,id",
      //是否为搜索模式
      showSearch: true,
      //是否禁用
      disabled: false
    },
  },
  {
    label: '物流单号',
    field: 'trackingNo',
    component: 'Input',
  },
  {
    label: '包材',
    field: 'packagingId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "wms_packaging_material where status = '1',material_name,id",
      //是否为搜索模式
      showSearch: true,
      //是否禁用
      disabled: false
    },
  },
  {
    label: '总重量',
    field: 'totalWeight',
    component: 'InputNumber',
  },
  {
    label: '重量单位',
    field: 'weightUnit',
    component: 'Input',
  },
  // {
  //   label: '长',
  //   field: 'sizeLength',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '宽',
  //   field: 'sizeWidth',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '高',
  //   field: 'sizeHeight',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '尺寸单位',
  //   field: 'sizeUnit',
  //   component: 'Input',
  // },
  // {
  //   label: '总体积',
  //   field: 'totalVolume',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '体积单位',
  //   field: 'volumeUnit',
  //   component: 'Input',
  // },
  {
    label: '包裹件数',
    field: 'packageCount',
    component: 'InputNumber',
  },
  // {
  //   label: '送货地址',
  //   field: 'fromAddress',
  //   component: 'Input',
  // },
  // {
  //   label: '收货地址',
  //   field: 'toAddress',
  //   component: 'Input',
  // },
  {
    label: '联系方式',
    field: 'contact',
    component: 'Input',
  },
  {
    label: '预计到达时间',
    field: 'estimatedArrival',
    component: 'DatePicker',
    componentProps: {
       showTime:true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '实际配送时间',
    field: 'actualDeparture',
    component: 'DatePicker',
    componentProps: {
       showTime:true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '实际到达时间',
    field: 'actualArrival',
    component: 'DatePicker',
    componentProps: {
       showTime:true,
       valueFormat: 'YYYY-MM-DD HH:mm:ss'
     },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"shipment_status"
    },
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入状态'},
      ];
    },
  },
  {
    label: '打包人',
    field: 'packerId',
    component: 'Input',
  },
  {
    label: '配送人',
    field: 'shipperId',
    component: 'Input',
  },
	// TODO 主键隐藏字段，目前写死为ID
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
//子表单数据
export const wmsWaveListColumns: JVxeColumn[] = [
  {
    title: '波次编号',
    align:"center",
    key: 'waveNo'
  }
  ]
//查询农产品时需要传入orderId参数
export function createWmsShipmentDetailColumns(getOrderId) {
  return [
    {
      title: '农产品',
      key: 'skuId',
      type: JVxeTypes.popup,
      width: "200px",
      popupCode: 'out_orders_item',
      params: computed(() => ({ orderId: getOrderId() })),
      fieldConfig: [
        { source: 'id', target: 'orderItemId' },
        { source: 'sku_id', target: 'skuId' },
        { source: 'product_name', target: 'productName' },
        // { source: 'surplus_quantity', target: 'surplusQuantity' },
      ],
    },
    {
      title: '农产品名称',
      key: 'productName',
      type: JVxeTypes.input,
      width:"200px",
      disabled: true,
    },
    // {
    //   title: '剩余数量',
    //   key: 'surplusQuantity',
    //   type: JVxeTypes.inputNumber,
    //   width:"100px",
    //   disabled: true,
    // },
    {
      title: '打包数量',
      key: 'quantity',
      type: JVxeTypes.inputNumber,
      width:"150px",
      defaultValue:'',
      validateRules: [
        { required: true, message: '${title}不能为空' },
      ],
    },
    {
      title: 'orderItemId',
      key: 'orderItemId',
      type: JVxeTypes.inputNumber,
      //不可编辑
      disabled: true,
      //不显示
      visible: false,
    },
    // 其他列...
  ] as JVxeColumn[];
}
//子表表格配置
// export const wmsShipmentDetailColumns: JVxeColumn[] = [
  // {
  //   title: '波次编号',
  //   align:"center",
  //   key: 'waveNo'
  // },
  //   {
  //     title: '包裹id',
  //     key: 'shipmentId',
  //     type: JVxeTypes.input,
  //     width:"200px",
  //     placeholder: '请输入${title}',
  //     defaultValue:'',
  //       validateRules: [
  //         { required: true, message: '${title}不能为空' },
  //       ],
  //   },
  //   {
  //     title: '出库单id',
  //     key: 'orderId',
  //     type: JVxeTypes.input,
  //     width:"200px",
  //     placeholder: '请输入${title}',
  //     defaultValue:'',
  //       validateRules: [
  //         { required: true, message: '${title}不能为空' },
  //       ],
  //   },
  //   {
  //     title: '出库单明细id',
  //     key: 'orderItemId',
  //     type: JVxeTypes.input,
  //     width:"200px",
  //     placeholder: '请输入${title}',
  //     defaultValue:'',
  //       validateRules: [
  //         { required: true, message: '${title}不能为空' },
  //       ],
  //   },

  // {
  //   title: '农产品',
  //   key: 'productId',
  //   type: JVxeTypes.popup,
  //   width: "200px",
  //   popupCode: 'out_orders_item',
  //   // params: {orderId:'1932801500302082049'},
  //   fieldConfig: [
  //     { source: 'id', target: 'productId' },
  //     { source: 'product_name', target: 'productName' },
  //     { source: 'picked_quantity', target: 'quantity' },
  //   ],
  // },
  // {
  //   title: '农产品名称',
  //   key: 'productName',
  //   type: JVxeTypes.input,
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  //   validateRules: [
  //     { required: true, message: '${title}不能为空' },
  //   ],
  // },
  //   {
  //     title: '数量',
  //     key: 'quantity',
  //     type: JVxeTypes.inputNumber,
  //     width:"200px",
  //     placeholder: '请输入${title}',
  //     defaultValue:'',
  //   },
  //   {
  //     title: 'id',
  //     key: 'id',
  //     type: JVxeTypes.inputNumber,
  //     width:"200px",
  //     defaultValue:'',
  //   },
  // ]


// 高级查询数据
export const superQuerySchema = {
  shipmentNo: {title: '包裹编码',order: 0,view: 'text', type: 'string',},
  orderId: {title: '出库单id',order: 1,view: 'text', type: 'string',},
  waveId: {title: '波次id',order: 2,view: 'text', type: 'string',},
  shipmentType: {title: '包裹类型',order: 3,view: 'text', type: 'string',},
  carrierId: {title: '物流商id',order: 4,view: 'text', type: 'string',},
  trackingNo: {title: '物流单号',order: 5,view: 'text', type: 'string',},
  packagingId: {title: '包材id',order: 6,view: 'text', type: 'string',},
  totalWeight: {title: '总重量',order: 7,view: 'number', type: 'number',},
  weightUnit: {title: '重量单位',order: 8,view: 'text', type: 'string',},
  sizeLength: {title: '长',order: 9,view: 'number', type: 'number',},
  sizeWidth: {title: '宽',order: 10,view: 'number', type: 'number',},
  sizeHeight: {title: '高',order: 11,view: 'number', type: 'number',},
  sizeUnit: {title: '尺寸单位',order: 12,view: 'text', type: 'string',},
  totalVolume: {title: '总体积',order: 13,view: 'number', type: 'number',},
  volumeUnit: {title: '体积单位',order: 14,view: 'text', type: 'string',},
  packageCount: {title: '包裹件数',order: 15,view: 'number', type: 'number',},
  fromAddress: {title: '送货地址',order: 16,view: 'text', type: 'string',},
  toAddress: {title: '收货地址',order: 17,view: 'text', type: 'string',},
  contact: {title: '联系方式',order: 18,view: 'text', type: 'string',},
  estimatedArrival: {title: '预计到达时间',order: 19,view: 'datetime', type: 'string',},
  actualDeparture: {title: '实际配送时间',order: 20,view: 'datetime', type: 'string',},
  actualArrival: {title: '实际到达时间',order: 21,view: 'datetime', type: 'string',},
  status: {title: '状态',order: 22,view: 'text', type: 'string',},
  packerId: {title: '打包人',order: 23,view: 'text', type: 'string',},
  shipperId: {title: '配送人',order: 24,view: 'text', type: 'string',},
  //子表高级查询
  wmsShipmentDetail: {
    title: '包裹明细表',
    view: 'table',
    fields: {
        shipmentId: {title: '包裹id',order: 0,view: 'text', type: 'string',},
        orderId: {title: '出库单id',order: 1,view: 'text', type: 'string',},
        orderItemId: {title: '出库单明细id',order: 2,view: 'text', type: 'string',},
        skuId: {title: '产品id',order: 3,view: 'text', type: 'string',},
        quantity: {title: '数量',order: 4,view: 'number', type: 'number',},
    }
  },
};

/**
* 流程表单调用这个方法获取formSchema
* @param param
*/
export function getBpmFormSchema(_formData): FormSchema[]{
// 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
