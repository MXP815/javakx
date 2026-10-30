<template>
  <div>
    <div class="jeecg-basic-table-form-container proModelBox">
      <a-card title="物模型">
        <a-form ref="formRef" class="antd-modal-form" name="WmsIotProductModelForm">
          <a-row>
            <a-col :lg="2">产品名称：</a-col><a-col :lg="10">{{ productVal.productName }}</a-col> <a-col :lg="2">产品描述：</a-col
            ><a-col :lg="10">{{ productVal.productDesc }}</a-col>
          </a-row>
        </a-form>
      </a-card>
    </div>
    <!--引用表格-->
    <BasicTable @register="registerTable">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" v-auth="'manage:wms_iot_product_model:add'" @click="handleAdd" preIcon="ant-design:plus-outlined">创建功能</a-button>
        <a-button type="primary" v-auth="'manage:wms_iot_product_model:exportXls'" preIcon="ant-design:export-outlined" @click="onExportXls">
          导出</a-button
        >
        <j-upload-button type="primary" v-auth="'manage:wms_iot_product_model:importExcel'" preIcon="ant-design:import-outlined" @click="onImportXls"
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
          <a-button v-auth="'manage:wms_iot_product_model:deleteBatch'"
            >批量操作
            <Icon icon="mdi:chevron-down" />
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" />
      </template>
      <!--字段回显插槽-->
      <template #bodyCell="{ column, record, index, text }"> </template>
    </BasicTable>
    <!-- 表单区域 -->
    <WmsIotProductModelModal @register="registerModal" @success="handleSuccess" />
    <DetailModal @register="register" :frameSrc="iframeUrl" />
    <div class="footBox">
      <a-button style="margin-left: 10px" @click="handleBack">返回</a-button>
    </div>
  </div>
</template>

<script lang="ts" name="manage-wmsIotProductModel" setup>
  import { ref, reactive } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import { useListPage } from '@/hooks/system/useListPage';
  import WmsIotProductModelModal from './components/WmsIotProductModelModal.vue';
  import { columns, searchFormSchema, superQuerySchema } from './WmsIotProductModel.data';
  import { modellist, deleteOne, batchDelete, getImportUrl, getExportUrl } from './WmsIotProductModel.api';
  import { router } from '@/router';
  const queryParam = reactive<any>({});
  const params = new URLSearchParams(window.location.search);
  let pCodeObj = params.get('product');
  let productVal = JSON.parse(decodeURIComponent(pCodeObj));
  //注册model
  const [registerModal, { openModal }] = useModal();
  //注册table数据
  const { tableContext, onExportXls, onImportXls } = useListPage({
    tableProps: {
      title: '产品物模型',
      api: modellist,
      columns,
      canResize: false,
      formConfig: {
        //labelWidth: 120,
        schemas: searchFormSchema,
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
          productCode: productVal.productCode,
        };
        return Object.assign(params, param);
      },
    },
    exportConfig: {
      name: '产品物模型',
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
        auth: 'manage:wms_iot_product_model:edit',
      },
      {
        label: '查看',
        onClick: handleDetail.bind(null, record),
        auth: 'manage:wms_iot_product_model:edit',
      },
      {
        label: '删除',
        color: 'error',
        popConfirm: {
          title: `请确认是否删除${record.modelName}`,
          confirm: handleDelete.bind(null, record),
          placement: 'topLeft',
        },
        auth: 'manage:wms_iot_product_model:delete',
      },
    ];
  }
  // 返回
  function handleBack() {
    router.replace({
      path: '/iot/manage/product/list',
    });
  }
</script>

<style lang="less" scoped>
  :deep(.ant-picker),
  :deep(.ant-input-number) {
    width: 100%;
  }
  .proModelBox {
    :deep(.ant-form) {
      padding: 10px 10px 20px;
    }
    .tit {
      padding: 10px 0;
    }
  }
</style>
