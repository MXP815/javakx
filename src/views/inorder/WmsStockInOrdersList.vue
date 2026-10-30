<template>
  <div id="abc">
    <!--引用表格-->
   <BasicTable @register="registerTable" :rowSelection="rowSelection" :expandedRowKeys="expandedRowKeys"  @expand="handleExpand">
      <!-- 内嵌table区域 begin -->
<!--           <template #expandedRowRender="{record}">
             <a-tabs tabPosition="top">
               <a-tab-pane tab="入库单明细" key="wmsStockInOrderItems" forceRender>
                  <wmsStockInOrderItemsSubTable :id="expandedRowKeys[0]"/>
               </a-tab-pane>
             </a-tabs>
           </template>-->
     <!-- 内嵌table区域 end -->
     <!--插槽:table标题-->
      <template #tableTitle>
          <a-button type="primary" v-auth="'inorder:wms_stock_in_orders:add'"  @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
          <a-button type="primary"  @click="handleCreateReceiveTask" preIcon="ant-design:save-filled"> 创建收货任务</a-button>
          <a-button  type="primary"   preIcon="ant-design:export-outlined" @click="handlePrint"> 打印</a-button>
          <a-button  type="primary" v-auth="'inorder:wms_stock_in_orders:exportXls'"  preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <!--<j-upload-button  type="primary" v-auth="'inorder:wms_stock_in_orders:importExcel'"  preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>-->
          <a-dropdown v-if="selectedRowKeys.length > 0">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="batchHandleDelete">
                    <Icon icon="ant-design:delete-outlined"></Icon>
                    删除
                  </a-menu-item>
                </a-menu>
              </template>
<!--              <a-button  v-auth="'inorder:wms_stock_in_orders:deleteBatch'">批量操作
                <Icon icon="mdi:chevron-down"></Icon>
              </a-button>-->
        </a-dropdown>
        <!-- 高级查询 -->
<!--        <super-query :config="superQueryConfig" @search="handleSuperQuery" />-->
      </template>
       <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
      </template>
      <!--字段回显插槽-->
      <template v-slot:bodyCell="{ column, record, index, text }">
      </template>
    </BasicTable>
    <!-- 表单区域 -->
    <WmsStockInOrdersPrintModal @register="registerPrintModal" @success="handleSuccess"></WmsStockInOrdersPrintModal>
    <WmsStockInOrdersModal @register="registerModal" @success="handleSuccess"></WmsStockInOrdersModal>
    <WmsStockInOrdersAddModal @register="registerAddModal" @success="handleSuccess"></WmsStockInOrdersAddModal>
    <WmsStockInOrdersAuditModal @register="registerAuditModal" @success="handleSuccess"></WmsStockInOrdersAuditModal>
    <WmsReceiveTaskAddModal @register="registerReceiveTaskAddModal" @success="handleSuccess"></WmsReceiveTaskAddModal>
  </div>
</template>

<script lang="ts" name="inorder-wmsStockInOrders" setup>
  import {ref, reactive, computed, unref} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage'
  import {useModal} from '/@/components/Modal';
  import WmsStockInOrdersModal from './components/WmsStockInOrdersModal.vue'
  import WmsStockInOrdersAddModal from './components/WmsStockInOrdersAddModal.vue'
  import WmsStockInOrdersPrintModal from './components/WmsStockInOrdersPrintModal.vue'
  import WmsStockInOrdersAuditModal from './components/WmsStockInOrdersAuditModal.vue'
  import WmsReceiveTaskAddModal from './components/WmsReceiveTaskAddModal.vue'
  import {columns, searchFormSchema, superQuerySchema} from './WmsStockInOrders.data';
  import {
    list,
    deleteOne,
    batchDelete,
    getImportUrl,
    getExportUrl,
    createReceiveTask, submitAudit
  } from './WmsStockInOrders.api';
  import {downloadFile} from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';
  import {useMessage} from "@/hooks/web/useMessage";
  import { useMethods } from '@/hooks/system/useMethods';
  const { handleExportXlsx } = useMethods();
  import { getLodop } from '/@/assets/LodopFuncs' //导入模块
  import {defHttp} from '/@/utils/http/axios';
  const queryParam = reactive<any>({});
  const { createMessage } = useMessage();
   // 展开key
  const expandedRowKeys = ref<any[]>([]);
  //注册model
  const [registerModal, {openModal}] = useModal();
  const [registerPrintModal, {openModal:openPrintModal}] = useModal();
  const [registerAuditModal, {openModal:openAuditModal}] = useModal();
  const [registerAddModal, {openModal:openAddModal}] = useModal();
  const [registerReceiveTaskAddModal, {openModal:openReceiveTaskAddModal}] = useModal();
  const userStore = useUserStore();
   //注册table数据
  const { prefixCls,tableContext,onImportXls } = useListPage({
      tableProps:{
           title: '入库单主表',
           api: list,
           columns:columns,
           canResize:false,
           formConfig: {
                //labelWidth: 120,
                schemas: searchFormSchema,
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
            name:"入库单主表",
            url: getExportUrl,
            params: queryParam,
        },
        importConfig: {
            url: getImportUrl,
            success: handleSuccess
        },
    })

  const [registerTable, {reload},{ rowSelection, selectedRowKeys }] = tableContext

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
     * 展开事件
     * */
   function handleExpand(expanded, record){
        expandedRowKeys.value=[];
        if (expanded === true) {
           expandedRowKeys.value.push(record.id)
        }
    }
   /**
    * 新增事件
    */
  function handleAdd() {
     openAddModal(true, {
       isUpdate: false,
       showFooter: true,
     });
  }

  /**
   * 创建收货任务
   */
  async function handleCreateReceiveTask() {
    //如果没有选择数据则提示
    if(selectedRowKeys.value.length == 0){
      createMessage.warn('请至少选择一条数据')
      return;
    }
    //遍历rowSelection.selectedRows,如果存在状态不为APPROVED的则不能继续
    for(let i=0;i<rowSelection.selectedRows.length;i++){
      if(rowSelection.selectedRows[i].status != "APPROVED"){
        createMessage.warn('存在未审核通过的记录，审核通过时方可创建收货任务')
        return;
      }
    }
    //打开创建收货任务窗口
    openReceiveTaskAddModal(true, {
      orderIds: selectedRowKeys.value,
    });

    // //审核通过时方可创建收货任务
    // if(rowSelection.selectedRows[0].status != "APPROVED"){
    //   createMessage.warn('审核通过时方可创建收货任务')
    //   return;
    // }
    //调用createReceiveTask
    // createReceiveTask({orderIds: selectedRowKeys.value}, handleSuccess);

  }
  /**
   * 审核入库单
   */
  function handleAudit(record: Recordable) {
    openAuditModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }

  /**
   * 提交审核
   */
  function handleSubmitAudit(record: Recordable) {
    submitAudit({id: record.id}, handleSuccess);
  }
  /**
    * 编辑事件
    */
  function handleEdit(record: Recordable) {
    //初始状态、审核失败状态可以修改
    // if(record.status != "1" && record.taskStatus !="8"){
    //   createMessage.warn('初始状态或审核失败状态可以修改')
    //   return;
    // }
     openModal(true, {
       record,
       isUpdate: true,
       showFooter: true,
     });
   }
  /**
    * 打印
    */
  function handlePrint() {
    //如果没有选择数据则提示
    if(selectedRowKeys.value.length == 0){
      createMessage.warn('请选择一条数据')
      return;
    }
    //如果选中多条数据则提示只允许选一条数据
    if(selectedRowKeys.value.length > 1){
      createMessage.warn('只允许选一条数据')
      return;
    }
    let record = rowSelection.selectedRows[0]
    //打开新窗口
    // window.open('http://localhost:8089/jeecg-boot/jmreport/shareView/1099569871519473664?id=' + record.id);
    openPrintModal(true, {
       record,
       isUpdate: true,
       showFooter: true,
     });
   }
  function onExportXls() {
    //如果没有选择数据则提示
    if(selectedRowKeys.value.length == 0){
      createMessage.warn('请选择一条数据')
      return;
    }
    //如果选中多条数据则提示只允许选一条数据
    if(selectedRowKeys.value.length > 1){
      createMessage.warn('只允许选一条数据')
      return;
    }
    let record = rowSelection.selectedRows[0]
    handleExportXlsx('入库单'+record.orderNumber,'/inorder/wmsStockInOrders/download',{orderId:record.id})
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
    * 删除事件
    */
  async function handleDelete(record) {
     //初始状态、审核失败状态可以删除
     if(record.status != "INITIAL" && record.taskStatus !="REJECTED"){
       createMessage.warn('初始状态或审核失败状态可以删除')
       return;
     }
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
         {
           label: '编辑',
           onClick: handleEdit.bind(null, record),
           auth: 'inorder:wms_stock_in_orders:edit'
         },
         {
           label: '提交审核',
           onClick: handleSubmitAudit.bind(null, record),
         },
       ]
   }


  /**
   * 下拉操作栏
   */
  function getDropDownAction(record){
    return [
      {
        label: '详情',
        onClick: handleDetail.bind(null, record),
      }, {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft'
        },
        auth: 'inorder:wms_stock_in_orders:delete'
      },{
        label: '审核',
        onClick: handleAudit.bind(null, record),
      }
    ]
  }

</script>

<style lang="less" scoped>
  :deep(.ant-picker),:deep(.ant-input-number){
    width: 100%;
  }
</style>
