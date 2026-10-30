<template>
  <div>
    <!--引用表格-->
   <BasicTable @register="registerTable" :rowSelection="rowSelection">
     <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'outorder:wms_out_orders:add'"  @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary"  @click="handleAllocateStock"  preIcon="ant-design:save-filled"> 库存分配</a-button>
        <!--          <a-button  type="primary" v-auth="'outorder:wms_out_orders:exportXls'"  preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>-->
        <!--          <j-upload-button  type="primary" v-auth="'outorder:wms_out_orders:importExcel'"  preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>-->
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <!--              <a-button v-auth="'outorder:wms_out_orders:deleteBatch'">批量操作
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
    <WmsOutOrdersModal @register="registerModal" @success="handleSuccess"></WmsOutOrdersModal>
    <WmsOutOrdersAddModal @register="registerAddModal" @success="handleSuccess"></WmsOutOrdersAddModal>
    <WmsOutOrdersAuditModal @register="registerAuditModal" @success="handleSuccess"></WmsOutOrdersAuditModal>
  </div>
</template>

<script lang="ts" name="outorder-wmsOutOrders" setup>
  import {ref, reactive, computed, unref} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import { useDrawer } from '/src/components/Drawer';
  import { useModal } from '/src/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage'
  import WmsOutOrdersModal from './components/WmsOutOrdersModal.vue'
  import WmsOutOrdersAddModal from './components/WmsOutOrdersAddModal.vue'
  import WmsOutOrdersAuditModal from './components/WmsOutOrdersAuditModal.vue'
  import {columns, searchFormSchema, superQuerySchema} from './WmsOutOrders.data';
  import {
    list,
    deleteOne,
    batchDelete,
    getImportUrl,
    getExportUrl,
    allocateStock,
    submitAudit
  } from './WmsOutOrders.api';
  import {downloadFile} from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';
  import {useMessage} from "@/hooks/web/useMessage";
  const { createMessage } = useMessage();
  const queryParam = reactive<any>({});
  const checkedKeys = ref<Array<string | number>>([]);
  const userStore = useUserStore();
  //注册model
  const [registerModal, {openModal}] = useModal();
  const [registerAddModal, {openModal:openAddModal}] = useModal();
  const [registerAuditModal, {openModal:openAuditModal}] = useModal();
  //字典配置drawer
  const [registerDrawer, { openDrawer }] = useDrawer();
   //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '出库单',
           api: list,
           columns,
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
            name:"出库单",
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
    * 新增事件
    */
  function handleAdd() {
     openAddModal(true, {
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
     openDrawer(true, {
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
    //如果没有选择数据则提示
    if (selectedRowKeys.value.length === 0) {
      createMessage.warn('请选择出库单')
      return;
    }
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
         {
           label: '编辑',
           onClick: handleEdit.bind(null, record),
           auth: 'outorder:wms_out_orders:edit'
         },
         {
           label: '提交审核',
           onClick: handleSubmitAudit.bind(null, record),
         },
       ]
   }

  /**
   * 提交审核
   */
  function handleSubmitAudit(record: Recordable) {
    submitAudit({id: record.id}, handleSuccess);
  }
  /**
   * 审核出库单
   */
  function handleAudit(record: Recordable) {
    openAuditModal(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
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
        auth: 'outorder:wms_out_orders:delete'
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
