<template>
  <div class="logModelBox">
    <!--查询区域-->
    <div class="jeecg-basic-table-form-container">
      <a-form ref="formRef" @keyup.enter.native="queryParam" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="24">
          <a-col :lg="6">
            <a-form-item name="productCode">
              <template #label><span title="产品编码">所属产品</span></template>
              <!-- <a-input placeholder="请输入产品编码" v-model:value="queryParam.productCode" allow-clear /> -->
              <a-select v-model:value="queryParam.productCode" placeholder="请选择" :options="recordsData" allowClear />
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item name="deviceCode">
              <template #label><span title="关联设备">设备名称</span></template>
              <a-select v-model:value="queryParam.deviceCode" placeholder="请选择" :options="deviceData" allowClear />
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
          <a-col :lg="6">
            <a-form-item name="alertLevel">
              <template #label><span title="报警级别">报警级别</span></template>
              <j-dict-select-tag v-model:value="queryParam.alertLevel" dictCode="alert_level_dict" placeholder="请选择" allow-clear />
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
    <BasicTable @register="registerTable" ref="tableRef">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-tabs v-model="activeKey" @tab-click="handleTab">
          <a-tab-pane v-for="(item, index) in tabData" :key="index">
            <template #tab>{{ item.label }}（{{ item.num }}）</template>
          </a-tab-pane>
        </a-tabs>
        <a-button type="primary" v-auth="'manage:wms_iot_alert_log:add'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 新增</a-button>
        <a-button type="primary" v-auth="'manage:wms_iot_alert_log:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls">
          导出</a-button
        >
        <j-upload-button type="primary" v-auth="'manage:wms_iot_alert_log:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls"
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
          <a-button v-auth="'manage:wms_iot_alert_log:deleteBatch'"
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <template #alertLevel="{ text, record }">
        <span v-if="text === 'CRIT'" class="colRed">紧急</span>
        <span v-if="text === 'WARN'" class="colWran">警告</span>
        <span v-if="text === 'GENERAL'" class="colBlur">一般</span>
      </template>
      <template #alertData="{ text, record }">
        <span>{{ text }}</span>
      </template>
      <template #processStatus="{ text, record }">
        <span v-if="text === '0'" class="colWran">待处理</span>
        <span v-if="text === '1'" class="colGreen">已解决</span>
        <span v-if="text === '2'" class="colGray">不予解决</span>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <!-- 表单区域 -->
    <WmsIotAlertLogModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="manage-wmsIotAlertLog" setup>
  import { ref, reactive, computed, onMounted, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useListPage } from '/@/hooks/system/useListPage';
  import WmsIotAlertLogModal from './components/WmsIotAlertLogModal.vue';
  import { columns,  superQuerySchema } from './WmsIotAlertLog.data';
  import { listAlert, deleteOne, batchDelete, getImportUrl, getExportUrl } from './WmsIotAlertLog.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { useUserStore } from '/@/store/modules/user';
  import { list } from './../product/WmsIotProduct.api';
  import { devicelist } from './../device/WmsIotDevice.api';
  import { modellist } from './../objectModel/WmsIotProductModel.api';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import { router } from '/@/router';
  import { getUserDeparts } from '/@/views/system/depart/depart.api';
  import {list as getWarehouseList} from "@/views/warehouse/WmsWarehouses.api";
  const params = new URLSearchParams(window.location.search);
  let alertLogId = params.get('id');

  const queryParam = reactive<any>({});
  const formRef = ref();
  const checkedKeys = ref<Array<string | number>>([]);
  const userStore = useUserStore();
  const activeKey = ref('0');
  const tabNums = ref({} as any);
  const recordsData = ref([]);
  const deviceData = ref([]);
  const filteredOptions = ref([]);
  const departList = ref([]);
  const warehouseList = ref([]);
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
  const tabData = ref([
    {
      label: '全部',
      value: null,
      num: 0,
    },
    {
      label: '待处理',
      value: '1',
      num: 0,
    },
    {
      label: '已处理',
      value: '2',
      num: 0,
    },
    {
      label: '不予解决',
      value: '3',
      num: 0,
    },
  ]);
  //注册model
  const [registerModal, { openModal }] = useModal();
  let processStatusTab = ref(null);
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '报警日志表',
      api: listAlert,
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
        width: 120,
        fixed: 'right',
      },
      beforeFetch: (params) => {
        const data = {
          id: alertLogId ? alertLogId : null,
          ...queryParam,
          processStatus: processStatusTab.value,
          warehouseCodes: filteredOptions.value ? filteredOptions.value.join(',') : undefined,
        };
        return Object.assign(params, data);
      },
    },
    exportConfig: {
      name: '报警日志表',
      url: getExportUrl,
      params: queryParam,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });

  const [registerTable, { reload, getRawDataSource }, { selectedRowKeys }] = tableContext;
  // 手动获取数据
  const getCurrentData = () => {
    tabNums.value = getRawDataSource();
    tabData.value[0].num = tabNums.value.allCount;
    tabData.value[1].num = tabNums.value.unsolvedCount;
    tabData.value[2].num = tabNums.value.solvedCount;
    tabData.value[3].num = tabNums.value.ignoreCount;
    console.log(tabData.value);
  };
  onMounted(() => {
    setTimeout(() => {
      getCurrentData();
    }, 1200);
    getProList();
    getModelData();
    loadWarehouseList();
  });
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
  // 获取设备，功能数据
  const getModelData = async () => {
    const params = {
      pageSize: 10000,
    };
    const deviceParams = {
      ...params,
      isEnable: '1',
    };
    const data = await devicelist(deviceParams);
    const renamedUsers = data.records.map((val) => ({
      ...val,
      label: val.deviceName,
      value: val.deviceCode,
    }));

    deviceData.value = renamedUsers;
  };
  /**
   * 新增
   */
  function handleAdd() {
    openModal(true, {
      record: {},
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 处理
   */
  function handleDispose(record: Recordable) {
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
      path: '/iot/logModel/LogDetail',
      query: {
        id: record.id,
      },
    });
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
    setTimeout(() => {
      getCurrentData();
    }, 500);
  }
  function handleTab(val) {
    if (val === 0) {
      processStatusTab.value = null;
    } else {
      processStatusTab.value = val - 1;
    }

    reload();
  }
  /**
   * 操作栏
   */
  function getTableAction(record) {
    return [
      {
        label: '查看',
        onClick: handleDetail.bind(null, record),
        auth: 'manage:wms_iot_alert_log:edit',
      },
      {
        label: '处理',
        disabled: record.processStatus !== '0',
        onClick: handleDispose.bind(null, record),
        auth: 'manage:wms_iot_alert_log:dispose',
      },
    ];
  }
  /**
   * 查询
   */
  function searchQuery() {
    router.replace({
      path: '/iot/logModel/WmsIotAlertLogList',
    });
    reload();
    setTimeout(() => {
      getCurrentData();
    }, 300);
  }

  /**
   * 重置
   */
  function searchReset() {
    formRef.value.resetFields();
    selectedRowKeys.value = [];
    queryParam.productCode = null;
    queryParam.deviceCode = null;
    queryParam.alertLevel = null;
    filteredOptions.value = [];
    router.replace({
      path: '/iot/logModel/WmsIotAlertLogList',
    });
    //刷新数据
    reload();
    setTimeout(() => {
      getCurrentData();
    }, 300);
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
