<template>
  <div>
    <!--查询区域-->
    <div class="jeecg-basic-table-form-container">
      <a-form ref="formRef" @keyup.enter.native="queryParam" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="24">
          <a-col :lg="6">
            <a-form-item name="productCode">
              <template #label><span title="产品编码">所属产品</span></template>
              <!-- <a-input placeholder="请输入产品编码" v-model:value="queryParam.productCode" allow-clear /> -->
              <a-select v-model:value="queryParam.productCode" placeholder="请选择所属产品" :options="recordsData" allowClear />
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item name="deviceName">
              <template #label><span title="关联设备">设备名称</span></template>
              <a-input v-model:value="queryParam.deviceName" placeholder="请输入设备名称" allowClear />
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item name="alertLevel">
              <template #label><span title="所属仓库">所属仓库</span></template>
              <a-select
                mode="single"
                style="width: 180px"
                placeholder="请选择所属仓库"
                :field-names="{ label: 'warehouseName', value: 'id' }"
                :options="warehouseList"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="6" :sm="24">
            <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery">查询</a-button>
            <a-button preIcon="ant-design:reload-outlined" @click="searchReset" style="margin-left: 8px">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'manage:wms_iot_device:add'" @click="handleAdd" preIcon="ant-design:plus-outlined">创建设备</a-button>
        <a-button type="primary" v-auth="'manage:wms_iot_device:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" v-auth="'manage:wms_iot_device:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls"
          >导入</j-upload-button
        >
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined" />
                删除
              </a-menu-item>
            </a-menu>
          </template>
          <a-button v-auth="'manage:wms_iot_device:deleteBatch'"
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <template #deviceStatus="{ record }">
        <span class="colWran" v-if="record.deviceStatus === -1">未激活</span>
        <span class="colGray" v-if="record.deviceStatus === 0">离线</span>
        <span class="colGreen" v-if="record.deviceStatus === 1">在线</span>
        <span class="colRed" v-if="record.deviceStatus === 2">禁用</span>
      </template>
      <template #isEnable="{ text, record }">
        <a-switch v-if="text === '0'" :checked="text === '1' ? true : false" @change="(checked) => handleSwitch(record, checked)" />
        <a-popconfirm
          v-else
          :title="`请确认是否${text === '1' ? '禁用' : '启用'}【${record.deviceName}】吗？`"
          @confirm="handleSwitch(record, !text)"
        >
          <a-switch :checked="text === '1' ? true : false" />
        </a-popconfirm>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <!-- 表单区域 -->
    <WmsIotDeviceModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="manage-wmsIotDevice" setup>
  import { reactive, onMounted, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import { useListPage } from '@/hooks/system/useListPage';
  import WmsIotDeviceModal from './components/WmsIotDeviceModal.vue';
  import { columns, searchFormSchema, superQuerySchema } from './WmsIotDevice.data';
  import { devicelist, deleteOne, saveOrUpdate, batchDelete, getImportUrl, getExportUrl } from './WmsIotDevice.api';
  import { getUserDeparts } from '@/views/system/depart/depart.api';
  import { list } from './../product/WmsIotProduct.api';
  import {list as getWarehouseList} from "@/views/warehouse/WmsWarehouses.api";
  const queryParam = reactive<any>({});
  import { router } from '@/router';
  const selectedItems = ref([]);
  const filteredOptions = ref([]);
  const recordsData = ref([]);
  const departList = ref([]);
  const warehouseList = ref([]);
  const formRef = ref();
  const labelCol = reactive({
    xs: 24,
    sm: 4,
    xl: 6,
    xxl: 4,
  });
  const wrapperCol = reactive({
    xs: 24,
    sm: 20,
  });
  //注册model
  const [registerModal, { openModal, resetSearch }] = useModal();
  //注册table数据
  const { tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '设备表',
      api: devicelist,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        // schemas: searchFormSchema,
        autoSubmitOnEnter: true,
        showAdvancedButton: true,
        fieldMapToNumber: [],
        fieldMapToTime: [],
      },
      actionColumn: {
        width: 180,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        const param = {
          ...queryParam,
          // warehouseCodes: filteredOptions.value ? filteredOptions.value.join(',') : undefined,
        };
        return Object.assign(params, param);
      },
    },
    exportConfig: {
      name: '设备表',
      url: getExportUrl,
      params: queryParam,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;

  // 高级查询配置
  const superQueryConfig = reactive(superQuerySchema);
  onMounted(() => {
    loadWarehouseList();
    getProList();
  });
  /**
   * 高级查询事件
   */
  function handleSuperQuery(params) {
    Object.keys(params).map((k) => {
      queryParam[k] = params[k];
    });
    reload();
  }
  // 获取产品列表
  async function getProList() {
    const params = {
      pageSize: 10000,
    };
    const data = await list(params);
    const renamedUsers = data.records.map((val) => ({
      ...val,
      label: val.productName,
      value: val.productCode,
    }));
    recordsData.value = renamedUsers;
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
   * 详情
   */
  function handleDetail(record: Recordable) {
    router.replace({
      path: '/iot/device/DeviceDetail',
      query: {
        deviceId: record.id,
      },
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }
  /**
   * 批量删除事件
   */
  async function batchHandleDelete() {
    await batchDelete({ ids: selectedRowKeys.value }, handleSuccess);
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
  function getTableAction(record) {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        auth: 'manage:wms_iot_device:edit',
      },
      {
        label: '管理',
        onClick: handleDetail.bind(null, record),
      },
      {
        label: '删除',
        popConfirm: {
          title: `请确认是否删除${record.deviceName}，该操作无法撤销`,
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
        },
        auth: 'manage:wms_iot_device:delete',
      },
    ];
  }
  async function handleSwitch(record, newStatus) {
    await saveOrUpdate({ id: record.id, isEnable: !newStatus ? '0' : '1' }, true);
    reload();
  }
  /**
   * 查询
   */
  function searchQuery() {
    reload();
  }

  /**
   * 重置
   */
  function searchReset() {
    formRef.value.resetFields();
    filteredOptions.value = [];
    //刷新数据
    reload();
  }
  /**
   *加载仓库信息
   */
  async function loadWarehouseList() {

    const result = await getWarehouseList({});
    // console.log(result)
    if (!result.records || result.records.length == 0) {
      return;
    }
    const records = result.records.map((val) => ({
      ...val,
      label: val.warehouseName,
      value: val.id,
    }));
    warehouseList.value = records;

  }
</script>

<style lang="less" scoped>
  :deep(.ant-picker),
  :deep(.ant-input-number) {
    width: 100%;
  }
</style>
