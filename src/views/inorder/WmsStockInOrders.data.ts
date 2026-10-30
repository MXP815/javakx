import {BasicColumn} from '/@/components/Table';
import {FormSchema} from '/@/components/Table';
import { rules} from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import {JVxeTypes,JVxeColumn} from '/@/components/jeecg/JVxeTable/types'
import { getWeekMonthQuarterYear } from '/@/utils';
import {computed, h} from "vue";
import {Input} from "ant-design-vue";
import {list} from "@/views/warehouse/WmsWarehouses.api";
import {defHttp} from "@/utils/http/axios";
import {getTenantId, getToken} from '/@/utils/auth';
//列表数据
export const columns: BasicColumn[] = [
   {
    title: '入库单号',
    align:"center",
    dataIndex: 'orderNumber'
   },
   {
    title: '入库类型',
    align:"center",
    dataIndex: 'orderType_dictText'
   },
   {
    title: '来源单号',
    align:"center",
    dataIndex: 'sourceNumber'
   },
   {
    title: '供应商',
    align:"center",
    dataIndex: 'ownerId'
   },
  //冷库
   {
     title: '冷库',
     align:"center",
     dataIndex: 'warehouseName',
   },
  //冷库
   {
     title: '冷库id',
     align:"center",
     dataIndex: 'warehouseId',
     //不显示
     ifShow: false,
   },
   {
    title: '预计到货时间',
    align:"center",
    dataIndex: 'expectedArrivalTime'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status_dictText'
   },
   // {
   //  title: '备注',
   //  align:"center",
   //  dataIndex: 'remarks'
   // },
   {
    title: '预期总数量',
    align:"center",
    dataIndex: 'totalExpectedQuantity'
   },
   {
    title: '实际收货总量',
    align:"center",
    dataIndex: 'totalReceivedQuantity'
   },
   {
    title: '已上架总量',
    align:"center",
    dataIndex: 'totalShelvedQuantity'
   },
   {
    title: '不良品总数量',
    align:"center",
    dataIndex: 'totalDefectiveQuantity'
   },
];
export const userlist = (params) =>{
  let tenantId = getTenantId();
  return defHttp.get({url: '/sys/tenant/getTenantUserList?column=createTime&order=desc&pageNo=1&pageSize=10&userTenantId='+tenantId+'&_t=1755166496064', params});
}

//创建收货任务
//表单数据
export const receiveTaskAdd: FormSchema[] = [
  //执行人
  {
    label: '执行人',
    field: 'operator',
    component: 'ApiSelect',
    componentProps: {
      api: userlist,
      resultField: 'records',
      labelField: 'realname',
      valueField: 'id',
    },
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请选择收货任务的执行人!'},
      ];
    },
  },
//   {
//     label: '执行人',
//     field: 'operator',
//     component: 'JSearchSelect',
//     componentProps: {
//       dict: "sys_user,realname,id",
//       //是否为搜索模式
//       showSearch: true,
//       //是否禁用
//       disabled: false
//     },
//     dynamicRules: ({model,schema}) => {
//       return [
//         { required: true, message: '请选择收货任务的执行人!'},
//       ];
//     },
//   },
]
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '入库单号',
    field: 'orderNumber',
    component: 'Input',
  },
  {
    label: '入库类型',
    field: 'orderType',
    component: 'JDictSelectTag',
    componentProps:{
      dictCode:"asn_type"
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
  }
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '入库单号',
    field: 'orderNumber',
    component: 'Input',
    //不可操作
    componentProps: {
      disabled: true
    }
  },
  {
    label: '入库类型',
    field: 'orderType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"asn_type"
     },
  },
  {
    label: '来源单号',
    field: 'sourceNumber',
    component: 'Input',
  },
/*  {
    label: '供应商id',
    field: 'ownerId',
    component: 'Input',
  },*/
  {
    label: '供应商',
    field: 'ownerId',
    component: 'JSearchSelect',
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入供应商!'},
      ];
    },
    componentProps: {
      dict: "wms_cargo_owners,owner_name,id",
      //是否为搜索模式
      showSearch: true,
      onChange: (e: any) => {
      },
      disabled: true
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
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入供应商!'},
      ];
    },
  },
  {
    label: '预计到货时间',
    field: 'expectedArrivalTime',
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
        dictCode:"asn_status",
        disabled: true
     },
  },
  {
    label: '备注',
    field: 'remarks',
    component: 'Input',
  },
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
//表单数据
export const formAddSchema: FormSchema[] = [
  {
    label: '入库单号',
    field: 'orderNumber',
    component: 'Input',
    //不可操作
    componentProps: {
      disabled: true
    }
  },
  {
    label: '入库类型',
    field: 'orderType',
    component: 'JDictSelectTag',
    componentProps:{
        dictCode:"asn_type"
     },
  },
  {
    label: '来源单号',
    field: 'sourceNumber',
    component: 'Input',
  },
  {
    label: '供应商',
    field: 'ownerId',
    component: 'JSearchSelect',
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入供应商!'},
      ];
    },
    componentProps: {
      dict: "wms_cargo_owners,owner_name,id",
      //是否为搜索模式
      showSearch: true,
      onChange: (e: any) => {
      },
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
    dynamicRules: ({model,schema}) => {
      return [
        { required: true, message: '请输入供应商!'},
      ];
    },
  },
  {
    label: '预计到货时间',
    field: 'expectedArrivalTime',
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
        dictCode:"asn_status",
        disabled: true
     },
    //默认
    defaultValue: 'INITIAL',
  },
  {
    label: '备注',
    field: 'remarks',
    component: 'Input',
  },
	{
	  label: '',
	  field: 'id',
	  component: 'Input',
	  show: false
	},
];
//审核表单数据
export const auditFormSchema: FormSchema[] = [

  {
    label: '审核状态',
    field: 'status',
    //包括审核通过和不通过
    component: 'RadioGroup',
    componentProps: {
      options: [
        {
          label: '审核通过',
          value: 'APPROVED',
        },
        {
          label: '不通过',
          value: 'REJECTED',
        },
      ],
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
//子表单数据
//子表列表数据
export const wmsStockInOrderItemsColumns: BasicColumn[] = [
   {
    title: '入库单id',
    align:"center",
    dataIndex: 'orderId'
   },
   {
    title: '产品id',
    align:"center",
    dataIndex: 'productId'
   },
   {
    title: '采购数量',
    align:"center",
    dataIndex: 'expectedQuantity'
   },
   {
    title: '实际收货数量',
    align:"center",
    dataIndex: 'receivedQuantity'
   },
   {
    title: '上架数量',
    align:"center",
    dataIndex: 'shelvedQuantity'
   },
   {
    title: '不良品数量',
    align:"center",
    dataIndex: 'defectiveQuantity'
   },
   {
    title: '备注',
    align:"center",
    dataIndex: 'remarks'
   },
   {
    title: '状态',
    align:"center",
    dataIndex: 'status'
   },
];
export function createWmsStockInOrderItemsJVxeColumns(getFieldsValue) {
  return [
    {
      title: '农产品',
      key: 'productId',
      type: JVxeTypes.popup,
      width: "200px",
      popupCode: 'wms_products',
      params: computed(() => {
        if(getFieldsValue() != undefined){
          return ({ ownerId:getFieldsValue().ownerId});
        }
        }),
      fieldConfig: [
        { source: 'id', target: 'productId' },
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
      title: '采购数量',
      key: 'expectedQuantity',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
    {
      title: '备注',
      key: 'remarks',
      type: JVxeTypes.input,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
    },
    {
      title: '状态',
      key: 'status',
      type: JVxeTypes.select,
      dictCode: 'asn_item_status',
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
      disabled: true
    },
    {
      title: '实际收货数量',
      key: 'receivedQuantity',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
      //不可操作
      disabled: true
    },
    {
      title: '上架数量',
      key: 'shelvedQuantity',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
      disabled: true
    },
    {
      title: '不良品数量',
      key: 'defectiveQuantity',
      type: JVxeTypes.inputNumber,
      width:"200px",
      placeholder: '请输入${title}',
      defaultValue:'',
      disabled: true
    },

    // 其他列...
  ] as JVxeColumn[];
}
// //子表表格配置
// export const wmsStockInOrderItemsJVxeColumns: JVxeColumn[] = [
//     // {
//     //   title: '入库单id',
//     //   key: 'orderId',
//     //   type: JVxeTypes.input,
//     //   width:"200px",
//     //   placeholder: '请输入${title}',
//     //   defaultValue:'',
//     // },
//     // {
//     //   title: '产品id',
//     //   key: 'productId',
//     //   type: JVxeTypes.input,
//     //   width:"200px",
//     //   placeholder: '请输入${title}',
//     //   defaultValue:'',
//     // },
//   {
//     title: '农产品',
//     key: 'productId',
//     type: JVxeTypes.popup,
//     width: "200px",
//     popupCode: 'wms_products',
//     // params: {ownerId:'1911408773194924033'},
//     fieldConfig: [
//       { source: 'id', target: 'productId' },
//       { source: 'product_name', target: 'productName' },
//     ],
//   },
//   {
//     title: '农产品名称',
//     key: 'productName',
//     type: JVxeTypes.input,
//     width:"200px",
//     placeholder: '请输入${title}',
//     defaultValue:'',
//     disabled:true,
//   },
//     {
//       title: '采购数量',
//       key: 'expectedQuantity',
//       type: JVxeTypes.inputNumber,
//       width:"200px",
//       placeholder: '请输入${title}',
//       defaultValue:'',
//     },
//     {
//       title: '实际收货数量',
//       key: 'receivedQuantity',
//       type: JVxeTypes.inputNumber,
//       width:"200px",
//       placeholder: '请输入${title}',
//       defaultValue:'',
//     },
//     {
//       title: '上架数量',
//       key: 'shelvedQuantity',
//       type: JVxeTypes.inputNumber,
//       width:"200px",
//       placeholder: '请输入${title}',
//       defaultValue:'',
//     },
//     {
//       title: '不良品数量',
//       key: 'defectiveQuantity',
//       type: JVxeTypes.inputNumber,
//       width:"200px",
//       placeholder: '请输入${title}',
//       defaultValue:'',
//     },
//     {
//       title: '备注',
//       key: 'remarks',
//       type: JVxeTypes.input,
//       width:"200px",
//       placeholder: '请输入${title}',
//       defaultValue:'',
//     },
//     {
//       title: '状态',
//       key: 'status',
//       type: JVxeTypes.select,
//       dictCode: 'asn_item_status',
//       width:"200px",
//       placeholder: '请输入${title}',
//       defaultValue:'',
//     },
//     // {
//     //   title: '状态',
//     //   key: 'status',
//     //   type: JVxeTypes.input,
//     //   width:"200px",
//     //   placeholder: '请输入${title}',
//     //   defaultValue:'',
//     // },
//   ]

// 高级查询数据
export const superQuerySchema = {
  orderNumber: {title: '入库单号',order: 0,view: 'text', type: 'string',},
  orderType: {title: '入库类型',order: 1,view: 'list', type: 'string',dictCode: 'asn_type',},
  sourceNumber: {title: '来源单号',order: 2,view: 'text', type: 'string',},
  ownerId: {title: '供应商id',order: 3,view: 'text', type: 'string',},
  expectedArrivalTime: {title: '预计到货时间',order: 4,view: 'datetime', type: 'string',},
  status: {title: '状态',order: 5,view: 'list', type: 'string',dictCode: 'asn_status',},
  remarks: {title: '备注',order: 6,view: 'text', type: 'string',},
  totalExpectedQuantity: {title: '预期总数量(冗余字段)',order: 7,view: 'number', type: 'number',},
  totalReceivedQuantity: {title: '实际收货总量',order: 8,view: 'number', type: 'number',},
  totalShelvedQuantity: {title: '已上架总量',order: 9,view: 'number', type: 'number',},
  totalDefectiveQuantity: {title: '不良品总数量(冗余字段)',order: 10,view: 'number', type: 'number',},
  //子表高级查询
  wmsStockInOrderItems: {
    title: '入库单明细',
    view: 'table',
    fields: {
        orderId: {title: '入库单id',order: 0,view: 'text', type: 'string',},
        productId: {title: '产品id',order: 1,view: 'text', type: 'string',},
        expectedQuantity: {title: '采购数量',order: 2,view: 'number', type: 'number',},
        receivedQuantity: {title: '实际收货数量',order: 3,view: 'number', type: 'number',},
        shelvedQuantity: {title: '上架数量',order: 4,view: 'number', type: 'number',},
        defectiveQuantity: {title: '不良品数量',order: 5,view: 'number', type: 'number',},
        remarks: {title: '备注',order: 6,view: 'text', type: 'string',},
        status: {title: '状态',order: 7,view: 'text', type: 'string',},
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
