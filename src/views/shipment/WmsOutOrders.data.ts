import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {JVxeTypes,JVxeColumn} from '/@/components/jeecg/JVxeTable/types'
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '出库单号',
    align:"center",
    dataIndex: 'orderNo'
  },
  {
    title: '出库类型',
    align:"center",
    dataIndex: 'orderType',
    customRender: ({text}) => {
      return render.renderDict(text, 'out_order_type');
    }
  },
  {
    title: '状态',
    align:"center",
    dataIndex: 'status',
    customRender: ({text}) => {
      return render.renderDict(text, 'out_order_status');
    }
  },
  {
    title: '供应商',
    align:"center",
    dataIndex: 'ownerName'
  },
  {
    title: '订单来源',
    align:"center",
    dataIndex: 'orderSource',
    customRender: ({text}) => {
      return render.renderDict(text, 'out_order_source');
    }
  },
  {
    title: '来源单号',
    align:"center",
    dataIndex: 'orderSourceNo'
  },
  {
    title: '冷库',
    align:"center",
    dataIndex: 'warehouseId'
  },

  // {
  //  title: '客户id',
  //  align:"center",
  //  dataIndex: 'customerId'
  // },
  {
    title: '预计配送时间',
    align:"center",
    dataIndex: 'expectedShipTime'
  },
  {
    title: '实际配送时间',
    align:"center",
    dataIndex: 'actualShipTime'
  },
  {
    title: '总农产品数量',
    align:"center",
    dataIndex: 'totalQuantity'
  },
  {
    title: '总sku种类数',
    align:"center",
    dataIndex: 'totalSku'
  },
  {
    title: '总重量',
    align:"center",
    dataIndex: 'totalWeight'
  },
  {
    title: '总体积',
    align:"center",
    dataIndex: 'totalVolume'
  },
  {
    title: '物流商编码',
    align:"center",
    dataIndex: 'carrierCode'
  },
  {
    title: '物流单号',
    align:"center",
    dataIndex: 'trackingNo'
  },
  {
    title: '收货人',
    align:"center",
    dataIndex: 'consignee'
  },
  {
    title: '收货时间',
    align:"center",
    dataIndex: 'shippingTime'
  },
  {
    title: '收货地址',
    align:"center",
    dataIndex: 'shippingAddress'
  },
  {
    title: '联系方式',
    align:"center",
    dataIndex: 'contact'
  },

  {
    title: '备注',
    align:"center",
    dataIndex: 'remark'
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  //出库单号
  {
    label: '出库单号',
    field: 'orderNo',
    component: 'Input',
    colProps: {span: 8},
  },
  //状态下拉
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode:"out_order_status"
    },
    // dynamicRules: ({model,schema}) => {
    //       return [
    //              { required: true, message: '请输入状态!'},
    //       ];
    //  },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '出库单号',
    field: 'orderNo',
    component: 'Input',
    //禁止输入
    componentProps: {
      disabled: true
    },
    // dynamicRules: ({model,schema}) => {
    //       return [
    //              { required: true, message: '请输入出库单号!'},
    //       ];
    //  },
  },
  {
    label: '出库类型',
    field: 'orderType',
    //下拉，数据字典 out_order_type
    component: 'JDictSelectTag',
    componentProps: {
      dictCode:"out_order_type"
    },
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入出库类型!'},
      ];
    },
  },
  {
    label: '订单来源',
    field: 'orderSource',
    //下拉，数据字典out_order_source
    component: 'JDictSelectTag',
    componentProps: {
      dictCode:"out_order_source"
    },
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
    label: '冷库',
    field: 'warehouseId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "wms_warehouses where status = '1',warehouse_name,id",
      //是否为搜索模式
      showSearch: true,
      //是否禁用
      disabled: false
    },
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入冷库!'},
      ];
    },
  },
  {
    label: '供应商',
    field: 'ownerId',
    component: 'JSearchSelect',
    componentProps: {
      dict: "wms_cargo_owners,owner_name,id",
      //是否为搜索模式
      showSearch: true,
      //是否禁用
      disabled: false
    },
    dynamicRules: ({model,schema}) => {
      //修改供应商时修改农产品弹窗的param
     if(model.ownerId){
       console.log(wmsOutOrdersItemsColumns)
       // let ownerId=model.ownerId;
       // wmsOutOrdersItemsColumns[0].params={owner_id:ownerId}
       // wmsOutOrdersItemsColumns[0].params={owner_id:'1911408773194924033'}
     }
      return [
        { required: true, message: '请输入供应商!'},
      ];
    },
  },
  // {
  //   label: '客户id',
  //   field: 'customerId',
  //   component: 'Input',
  // },
  {
    label: '预计配送时间',
    field: 'expectedShipTime',
    component: 'DatePicker',
    componentProps: {
      showTime:true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    },
  },
  // {
  //   label: '实际配送时间',
  //   field: 'actualShipTime',
  //   component: 'DatePicker',
  //   componentProps: {
  //      showTime:true,
  //      valueFormat: 'YYYY-MM-DD HH:mm:ss'
  //    },
  // },
  // {
  //   label: '总农产品数量',
  //   field: 'totalQuantity',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '总sku种类数',
  //   field: 'totalSku',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '总重量',
  //   field: 'totalWeight',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '总体积',
  //   field: 'totalVolume',
  //   component: 'InputNumber',
  // },
  // {
  //   label: '物流商编码',
  //   field: 'carrierCode',
  //   component: 'Input',
  // },
  // {
  //   label: '物流单号',
  //   field: 'trackingNo',
  //   component: 'Input',
  // },
  {
    label: '收货人',
    field: 'consignee',
    component: 'Input',
  },
  // {
  //   label: '收货时间',
  //   field: 'shippingTime',
  //   component: 'DatePicker',
  //   componentProps: {
  //      showTime:true,
  //      valueFormat: 'YYYY-MM-DD HH:mm:ss'
  //    },
  // },
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
  // {
  //   label: '状态',
  //   field: 'status',
  //   component: 'Input',
  //   dynamicRules: ({model,schema}) => {
  //         return [
  //                { required: true, message: '请输入状态!'},
  //         ];
  //    },
  // },
  {
    label: '备注',
    field: 'remark',
    //多行文本
    component: 'InputTextArea',

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
//子表表格配置
export const wmsShipmentListColumns: JVxeColumn[] = [
  {
    title: '包裹编号',
    key: 'shipmentNo',
    width:"200px",
    defaultValue:'',
  },
  {
    title: '物流商',
    key: 'carrierId',
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

export const wmsOutOrdersItemsColumns: JVxeColumn[] = [
  // {
  //   title: '产品id',
  //   key: 'skuId',
  //   type: JVxeTypes.input,
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  //     validateRules: [
  //       { required: true, message: '${title}不能为空' },
  //     ],
  // },
  {
    title: '农产品',
    key: 'skuId',
    type: JVxeTypes.popup,
    width: "200px",
    popupCode: 'wms_products',
    // params: {owner_id:'1911408773194924033'},
    fieldConfig: [
      { source: 'id', target: 'skuId' },
      { source: 'product_name', target: 'productName' },
    ],
  },
  {
    title: '农产品名称',
    key: 'productName',
    type: JVxeTypes.input,
    width:"200px",
    placeholder: '请输入${title}',
    defaultValue:'',
    disabled:true,
  },
  {
    title: '预期出库数量',
    key: 'expectedQuantity',
    type: JVxeTypes.inputNumber,
    width:"200px",
    placeholder: '请输入${title}',
    defaultValue:'',
    validateRules: [
      { required: true, message: '${title}不能为空' },
    ],
  },
  // {
  //   title: '分配数量',
  //   key: 'allocatedQuantity',
  //   type: JVxeTypes.inputNumber,
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  // },
  // {
  //   title: '拣货数量',
  //   key: 'pickedQuantity',
  //   type: JVxeTypes.inputNumber,
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  // },
  // {
  //   title: '打包数量',
  //   key: 'packedQuantity',
  //   type: JVxeTypes.inputNumber,
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  // },
  // {
  //   title: '单位',
  //   key: 'unit',
  //   type: JVxeTypes.input,
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  // },
  // {
  //   title: '批次号',
  //   key: 'batchNo',
  //   type: JVxeTypes.input,
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  // },
  // {
  //   title: '批次号',
  //   key: 'batchNo',
  //   type: JVxeTypes.selectDictSearch,
  //   dict: 'wms_products_batchnum,batch_number,batch_number',
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  // },
  {
    title: '批次号',
    key: 'batchNumber',
    type: JVxeTypes.popup,
    width: "200px",
    popupCode: 'wms_products_batchnum',
    // params: {owner_id:'1911408773194924033'},
    fieldConfig: [
      { source: 'batch_number', target: 'batchNo' },
    ],
  },
  {
    title: '状态',
    key: 'status',
    type: JVxeTypes.select,
    width: "200px",
    dictCode: 'out_order_item_status',
    disabled:true,
  },
  // {
  //   title: '保鲜期',
  //   key: 'expiryDate',
  //   type: JVxeTypes.date,
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  // },
  // {
  //   title: '状态',
  //   key: 'status',
  //   type: JVxeTypes.input,
  //   width:"200px",
  //   placeholder: '请输入${title}',
  //   defaultValue:'',
  //     validateRules: [
  //       { required: true, message: '${title}不能为空' },
  //     ],
  // },
]
export const wmsOutOrdersAllocationColumns: JVxeColumn[] = [
    {
      title: '出库单id',
      key: 'orderId',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '出库单明细ID',
      key: 'orderItemId',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '产品id',
      key: 'skuId',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '货位编号',
      key: 'locationCode',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '批次号',
      key: 'batchNo',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
    {
      title: '容器编号',
      key: 'containerCode',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
    {
      title: '分配数量',
      key: 'allocatedQuantity',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
        validateRules: [
          { required: true, message: '${title}不能为空' },
        ],
    },
    {
      title: '拣货数量',
      key: 'pickedQuantity',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
  ]


// 高级查询数据
export const superQuerySchema = {
  orderNo: {title: '出库单号',order: 0,view: 'text', type: 'string',},
  orderType: {title: '出库类型',order: 1,view: 'text', type: 'string',},
  orderSource: {title: '订单来源',order: 2,view: 'text', type: 'string',},
  orderSourceNo: {title: '来源单号',order: 3,view: 'text', type: 'string',},
  warehouseId: {title: '冷库id',order: 4,view: 'text', type: 'string',},
  ownerId: {title: '供应商id',order: 5,view: 'text', type: 'string',},
  customerId: {title: '客户id',order: 6,view: 'text', type: 'string',},
  expectedShipTime: {title: '预计配送时间',order: 7,view: 'datetime', type: 'string',},
  actualShipTime: {title: '实际配送时间',order: 8,view: 'datetime', type: 'string',},
  totalQuantity: {title: '总农产品数量',order: 9,view: 'number', type: 'number',},
  totalSku: {title: '总sku种类数',order: 10,view: 'number', type: 'number',},
  totalWeight: {title: '总重量',order: 11,view: 'number', type: 'number',},
  totalVolume: {title: '总体积',order: 12,view: 'number', type: 'number',},
  carrierCode: {title: '物流商编码',order: 13,view: 'text', type: 'string',},
  trackingNo: {title: '物流单号',order: 14,view: 'text', type: 'string',},
  consignee: {title: '收货人',order: 15,view: 'text', type: 'string',},
  shippingTime: {title: '收货时间',order: 16,view: 'datetime', type: 'string',},
  shippingAddress: {title: '收货地址',order: 17,view: 'text', type: 'string',},
  contact: {title: '联系方式',order: 18,view: 'text', type: 'string',},
  status: {title: '状态',order: 19,view: 'text', type: 'string',},
  remark: {title: '备注',order: 20,view: 'text', type: 'string',},
  //子表高级查询
  wmsOutOrdersItems: {
    title: '出库单明细',
    view: 'table',
    fields: {
        skuId: {title: '产品id',order: 0,view: 'text', type: 'string',},
        expectedQuantity: {title: '预期出库数量',order: 1,view: 'number', type: 'number',},
        allocatedQuantity: {title: '分配数量',order: 2,view: 'number', type: 'number',},
        pickedQuantity: {title: '拣货数量',order: 3,view: 'number', type: 'number',},
        packedQuantity: {title: '打包数量',order: 4,view: 'number', type: 'number',},
        unit: {title: '单位',order: 5,view: 'text', type: 'string',},
        batchNo: {title: '批次号',order: 6,view: 'text', type: 'string',},
        expiryDate: {title: '保鲜期',order: 7,view: 'date', type: 'string',},
        status: {title: '状态',order: 8,view: 'text', type: 'string',},
    }
  },
  wmsOutOrdersAllocation: {
    title: '出库单分配明细',
    view: 'table',
    fields: {
        orderId: {title: '出库单id',order: 0,view: 'text', type: 'string',},
        orderItemId: {title: '出库单明细ID',order: 1,view: 'text', type: 'string',},
        skuId: {title: '产品id',order: 2,view: 'text', type: 'string',},
        locationCode: {title: '货位编号',order: 3,view: 'text', type: 'string',},
        batchNo: {title: '批次号',order: 4,view: 'text', type: 'string',},
        containerCode: {title: '容器编号',order: 5,view: 'text', type: 'string',},
        allocatedQuantity: {title: '分配数量',order: 6,view: 'number', type: 'number',},
        pickedQuantity: {title: '拣货数量',order: 7,view: 'number', type: 'number',},
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
