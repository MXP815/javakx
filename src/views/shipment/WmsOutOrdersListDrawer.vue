<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="出库单列表" width="800px">
    <!--引用表格-->
   <BasicTable @register="registerTable" :rowSelection="rowSelection">
     <!--插槽:table标题-->
      <template #tableTitle>
        <!-- 高级查询 -->
        <!--        <super-query :config="superQueryConfig" @search="handleSuperQuery" />-->
      </template>
       <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template v-slot:bodyCell="{ column, record, index, text }">
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <WmsShipmentList @register="registerDrawer2"></WmsShipmentList>
    <!-- 表单区域 -->
    <WmsOutOrdersSortingModal @register="registerModal" @success="handleSuccess"></WmsOutOrdersSortingModal>
  </BasicDrawer>
</template>

<script lang="ts" name="outorder-wmsOutOrders" setup>
  import {ref, reactive, computed, unref} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import {BasicDrawer,useDrawer, useDrawerInner} from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage'
  import WmsShipmentList from './components/WmsShipmentList.vue'
  import {columns, searchFormSchema, superQuerySchema} from './WmsOutOrders.data';
  import WmsOutOrdersSortingModal from '../wave/components/WmsOutOrdersSortingModal.vue'
  import {
    list,
    deleteOne,
    batchDelete,
    getImportUrl,
    getExportUrl,
    allocateStock
  } from './WmsOutOrders.api';
  import {downloadFile} from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';

  const queryParam = reactive<any>({});
  const checkedKeys = ref<Array<string | number>>([]);
  const userStore = useUserStore();
  //注册model
  const [registerModal, {openModal}] = useModal();
  const [registerShipmentModal, {openModal:openShipmentModal}] = useModal();
  //字典配置drawer
  // const [registerDrawer] = useDrawerInner(async (data) => {
  // });
  const [registerDrawer2, { openDrawer:openDrawer2 }] = useDrawer();
  const [registerDrawer] = useDrawerInner(async (data) => {
    setProps({ searchInfo: { waveId: unref(data.waveId) } });
    reload();
  });
   //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '出库单',
           api: list,
           columns,
           canResize:false,
           formConfig: {
                //labelWidth: 120,
                schemas: [],
                autoSubmitOnEnter:true,
                showAdvancedButton:true,
                fieldMapToNumber: [
                ],
                fieldMapToTime: [
                ],
            },
           actionColumn: {
               width: 120,
               fixed:'right'
           },
           beforeFetch: (params) => {
             return Object.assign(params, queryParam);
           },
        },
        exportConfig: {
            name:"出库单",
            url: getExportUrl,
            params: queryParam,
        },
        importConfig: {
            url: getImportUrl,
            success: handleSuccess
        },
    })

  const [registerTable, {reload,setProps},{ rowSelection, selectedRowKeys }] = tableContext

  // 高级查询配置
  const superQueryConfig = reactive(superQuerySchema);

  /**
   * 高级查询事件
   */
  function handleSuperQuery(params) {
    Object.keys(params).map((k) => {
      queryParam[k] = params[k];
    });
    reload();
  }

   /**
    * 新增事件
    */
  function handleAdd() {
     openModal(true, {
       isUpdate: false,
       showFooter: true,
     });
  }
   /**
    * 编辑事件
    */
  function handleEdit(record: Recordable) {
     openModal(true, {
       record,
       isUpdate: true,
       showFooter: true,
     });
   }
   /**
    * 包裹管理事件
    */
  function shipmentList(record: Recordable) {
     openDrawer2(true, {
       orderId: record.id,
       orderNo: record.orderNo,
     });
     // openShipmentModal(true, {
     //   record,
     //   isUpdate: true,
     //   showFooter: true,
     // });
   }
   /**
    * 详情
   */
  function handleDetail(record: Recordable) {
     openModal(true, {
       record,
       isUpdate: true,
       showFooter: false,
     });
   }
  /**
   * 库存分配
   */
  async function handleAllocateStock() {
    await allocateStock({ids: selectedRowKeys.value},handleSuccess);
  }
   /**
    * 删除事件
    */
  async function handleDelete(record) {
     await deleteOne({id: record.id}, handleSuccess);
   }
   /**
    * 批量删除事件
    */
  async function batchHandleDelete() {
     await batchDelete({ids: selectedRowKeys.value},handleSuccess);
   }
   /**
    * 成功回调
    */
  function handleSuccess() {
      (selectedRowKeys.value = []) && reload();
   }
   /**
      * 操作栏
      */
  function getTableAction(record){
       return [
         // {
         //   label: '详情',
         //   onClick: handleDetail.bind(null, record),
         // },
         {
           label: '分拣',
           onClick: handleDetail.bind(null, record),
         },
         {
           label: '包裹管理',
           onClick: shipmentList.bind(null, record),
           auth: 'outorder:wms_out_orders:edit'
         }
       ]
   }



</script>

<style lang="less" scoped>
  :deep(.ant-picker),:deep(.ant-input-number){
    width: 100%;
  }
</style>
