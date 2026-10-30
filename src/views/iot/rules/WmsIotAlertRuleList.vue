<template>
  <div class="p-2">
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
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'manage:wms_iot_alert_rule:add'" @click="handleAdd" preIcon="ant-design:plus-outlined">创建规则</a-button>
        <a-button type="primary" v-auth="'manage:wms_iot_alert_rule:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls">
          导出</a-button
        >
        <j-upload-button type="primary" v-auth="'manage:wms_iot_alert_rule:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls"
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
          <a-button v-auth="'manage:wms_iot_alert_rule:deleteBatch'"
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
        <!-- 高级查询 -->
      </template>
      <template #modelName="{ text, record }">
        {{ record.modelName }}
        <span v-if="record.operator === 'gt'">{{ '>' }}</span>
        <span v-if="record.operator === 'lt'">{{ '<' }}</span>
        <span v-if="record.operator === 'eq'">{{ '=' }}</span>
        <span v-if="record.operator === 'egt'">{{ '>=' }}</span>
        <span v-if="record.operator === 'elt'">{{ '<=' }}</span>
        <span v-if="record.operator === 'net'">{{ '!=' }}</span>
        {{ record.threshold }}，连续{{ record.cycle }}个周期
      </template>
      <template #ignoreDuration="{ text, record }">
        <span v-if="record.ignoreDuration === 1">1分钟</span>
        <span v-if="record.ignoreDuration === 2">10分钟</span>
        <span v-if="record.ignoreDuration === 3">30分钟</span>
        <span v-if="record.ignoreDuration === 4">1小时</span>
        <span v-if="record.ignoreDuration === 5">24小时</span>
      </template>
      <template #alertLevel="{ text, record }">
        <span v-if="text === 'CRIT'" class="colRed">紧急</span>
        <span v-if="text === 'WARN'" class="colWran">警告</span>
        <span v-if="text === 'GENERAL'" class="colBlur">一般</span>
      </template>
      <template #isEnable="{ text, record }">
        <a-switch v-if="text === '0'" :checked="text === '1' ? true : false" @change="(checked) => handleSwitch(record, checked)" />
        <a-popconfirm v-else :title="`请确认是否${text === '1' ? '禁用' : '启用'}【${record.deviceName}】`" @confirm="handleSwitch(record, !text)">
          <a-switch :checked="text === '1' ? true : false" />
        </a-popconfirm>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <template #bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" name="manage-wmsIotAlertRule" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, superQuerySchema, searchFormSchema } from './WmsIotAlertRule.data';
  import { listRule, deleteOne, batchDelete, getImportUrl, getExportUrl } from './WmsIotAlertRule.api';
  import { router } from '/@/router';
  import { useUserStore } from '/@/store/modules/user';
  import { saveOrUpdate } from './WmsIotAlertRule.api';
  import JSelectMultiple from '/@/components/Form/src/jeecg/components/JSelectMultiple.vue';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import { devicelist } from './../device/WmsIotDevice.api';
  import { list } from './../product/WmsIotProduct.api';
  import { getUserDeparts } from '/@/views/system/depart/depart.api';
  import {list as getWarehouseList} from "@/views/warehouse/WmsWarehouses.api";
  const formRef = ref();
  const queryParam = reactive<any>({});
  const toggleSearchStatus = ref<boolean>(false);
  const registerModal = ref();
  const filteredOptions = ref([]);
  const recordsData = ref([]);
  const deviceData = ref([]);
  const departList = ref([]);
  const warehouseList = ref([]);
  //注册table数据
  //注册table数据
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '报警规则表',
      api: listRule,
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
        const param = {
          ...queryParam,
          warehouseCodes: filteredOptions.value ? filteredOptions.value.join(',') : undefined,
        };
        return Object.assign(params, param);
      },
    },
    exportConfig: {
      name: '报警规则表',
      url: getExportUrl,
      params: queryParam,
    },
    importConfig: {
      url: getImportUrl,
      success: handleSuccess,
    },
  });
  const [registerTable, { reload }, { rowSelection, selectedRowKeys }] = tableContext;
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
  onMounted(() => {
    getProList();
    getModelData();
    loadWarehouseList();
  });
  /**
   * 新增事件
   */
  function handleAdd() {
    // registerModal.value.disableSubmit = false;
    // registerModal.value.add();
    router.replace({
      path: '/iot/rules/WmsIotAlertRuleAdd',
      // query: {
      //   deviceId: record.id,
      // },
    });
  }

  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    console.log(record.id);
    router.replace({
      path: '/iot/rules/WmsIotAlertRuleAdd',
      query: {
        id: record.id + '',
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
        auth: 'manage:wms_iot_alert_rule:edit',
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: `请确认是否删除${record.alertName}，该操作无法撤销`,
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
        },
        auth: 'manage:wms_iot_alert_rule:delete',
      },
    ];
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

  async function handleSwitch(record, newStatus) {
    await saveOrUpdate({ id: record.id, isEnable: !newStatus ? '0' : '1' }, true);
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
  .jeecg-basic-table-form-container {
    padding: 0;
    .table-page-search-submitButtons {
      display: block;
      margin-bottom: 24px;
      white-space: nowrap;
    }
    .query-group-cust {
      min-width: 100px !important;
    }
    .query-group-split-cust {
      width: 30px;
      display: inline-block;
      text-align: center;
    }
    .ant-form-item:not(.ant-form-item-with-help) {
      margin-bottom: 16px;
      height: 32px;
    }
    :deep(.ant-picker),
    :deep(.ant-input-number) {
      width: 100%;
    }
  }
</style>
