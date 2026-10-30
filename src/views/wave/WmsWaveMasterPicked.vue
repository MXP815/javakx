<template>
  <div class="p-2 cgformErpList">
    <div class="content">
      <!--引用表格-->
      <BasicTable @register="registerTable" :rowSelection="rowSelection">
        <!--插槽:table标题-->
        <template #tableTitle>
          <a-button type="primary"   @click="handleCreateShipment" preIcon="ant-design:plus-outlined"> 创建包裹</a-button>
          <a-button type="primary"  @click="handleCompletePack" preIcon="ant-design:plus-outlined"> 完成打包</a-button>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <template #overlay>
              <!--              <a-menu>-->
              <!--                <a-menu-item key="1" @click="batchHandleDelete">-->
              <!--                  <Icon icon="ant-design:delete-outlined"></Icon>-->
              <!--                  删除-->
              <!--                </a-menu-item>-->
              <!--              </a-menu>-->
            </template>
            <!--            <a-button  v-auth="'wave:wms_wave_master:deleteBatch'">批量操作-->
            <!--              <Icon icon="mdi:chevron-down"></Icon>-->
            <!--            </a-button>-->
          </a-dropdown>
          <!-- 高级查询 -->
          <!--          <super-query :config="superQueryConfig" @search="handleSuperQuery" />-->
        </template>
        <!--操作栏-->
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
        </template>
        <!--字段回显插槽-->
        <template v-slot:bodyCell="{ column, record, index, text }">
        </template>
      </BasicTable>
      <!--子表表格tab-->
      <!--      <a-tabs defaultActiveKey="1" style="margin: 10px">-->
      <!--        <a-tab-pane tab="出库单" key="1" >-->
      <!--          <WmsOutOrdersList />-->
      <!--        </a-tab-pane>-->
      <!--      </a-tabs>-->
    </div>
    <!-- 表单区域 -->
    <WmsWaveMasterModal @register="registerModal" @success="handleSuccess"></WmsWaveMasterModal>
    <WmsOutOrdersListDrawer @register="registerDrawer"></WmsOutOrdersListDrawer>
  </div>
</template>

<script lang="ts" name="wave-wmsWaveMaster" setup>
import {ref, reactive, computed, unref,provide} from 'vue';
import {BasicTable, useTable, TableAction} from '/@/components/Table';
import { useListPage } from '/@/hooks/system/useListPage'
import {useModal} from '/@/components/Modal';
import {useDrawer} from "/@/components/Drawer";
import WmsWaveMasterModal from './components/WmsWaveMasterModal.vue'
import { useUserStore } from '/@/store/modules/user';
import {columns, searchFormSchema, superQuerySchema} from './WmsWaveMaster.data';
import {
  list,
  deleteOne,
  batchDelete,
  getImportUrl,
  getExportUrl,
  completePack,
  createPickTask, createShipment, listByCreate, listByPicking, listByPacking, listByPicked
} from './WmsWaveMaster.api';
import {downloadFile} from '/@/utils/common/renderUtils';
import {useMessage} from "/@/hooks/web/useMessage";
import WmsOutOrdersListDrawer from '../shipment/WmsOutOrdersListDrawer.vue'
import { useGo } from '/@/hooks/web/usePage';
const queryParam = reactive<any>({});
//注册model
const [registerModal, {openModal}] = useModal();
const [registerDrawer, { openDrawer }] = useDrawer();
const [registerAddModal, {openModal:  openAddModal}] = useModal();
const { createMessage } = useMessage();
//注册table数据
const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
  tableProps:{
    title: '波次主表',
    api: listByPicked,
    columns,
    canResize: false,
    clickToRowSelect: true,
    rowSelection: {type: 'checkbox'},
    formConfig: {
      schemas: [],
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
    pagination:{
      current: 1,
      pageSize: 5,
      pageSizeOptions: ['5', '10', '20'],
    }
  },
  exportConfig: {
    name:"波次主表",
    url: getExportUrl,
    params: queryParam,
  },
  importConfig: {
    url: getImportUrl,
    success: handleSuccess
  },
})
const userStore = useUserStore();
const [registerTable, {reload},{ rowSelection, selectedRowKeys }] = tableContext

const mainId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
const go = useGo();

//下发 mainId,子组件接收
provide('mainId', mainId);

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
 * 完成打包
 */
async function handleCompletePack() {
  //如果没有选择数据则提示
  if (selectedRowKeys.value.length === 0) {
    createMessage.warn('请选择波次')
    return;
  }
  await completePack({ids: selectedRowKeys.value}, handleSuccess)
}

/**
 * 创建拣货任务
 */
async function handleCreatePickTask() {
  //如果没有选择数据则提示
  if (selectedRowKeys.value.length === 0) {
    createMessage.warn('请选择波次')
    return;
  }
  await createPickTask({ids: selectedRowKeys.value}, handleSuccess)
}
/**
 * 创建包裹
 */
async function handleCreateShipment() {
  //如果没有选择数据则提示
  if (selectedRowKeys.value.length === 0) {
    createMessage.warn('请选择波次')
    return;
  }
  await createShipment({id: selectedRowKeys.value[0]}, handleSuccess)
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
      label: '详情',
      onClick: handleDetail.bind(null, record),
    },
    {
      label: '分拣/包裹管理',
      onClick: shipmentList.bind(null, record),
    }
    // {
    //   label: '编辑',
    //   onClick: handleEdit.bind(null, record),
    //   auth: 'wave:wms_wave_master:edit'
    // }
  ]
}

/**
 * 包裹管理事件
 */
function shipmentList(record: Recordable) {
  openDrawer(true, {
    waveId: record.id,
  });

}
/**
 * 下拉操作栏
 */
function getDropDownAction(record){
  return [
    // {
    //   label: '详情',
    //   onClick: handleDetail.bind(null, record),
    // }, {
    //   label: '删除',
    //   popConfirm: {
    //     title: '是否确认删除',
    //     confirm: handleDelete.bind(null, record),
    //     placement: 'topLeft'
    //   },
    //   auth: 'wave:wms_wave_master:delete'
    // }
  ]
}

</script>

<style lang="less" scoped>
html[data-theme='light'] {
  .cgformErpList {
    height: 100%;
    .content {
      background-color: #fff;
      height: 100%;
    }
  }
}

:deep(.ant-picker),:deep(.ant-input-number){
  width: 100%;
}
</style>
