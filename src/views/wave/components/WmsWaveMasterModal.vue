<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
      <BasicForm @register="registerForm" name="WmsWaveMasterForm" />
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated @change="handleChangeTabs">
      <a-tab-pane tab="出库单" key="wmsOutOrders" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="wmsOutOrders"
          :loading="wmsOutOrdersTable.loading"
          :columns="wmsOutOrdersTable.columns"
          :dataSource="wmsOutOrdersTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
          :toolbar="false"
        />
      </a-tab-pane>
      <a-tab-pane tab="波次拣货明细" key="wmsPickTasks" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="wmsPickTasks"
          :loading="wmsPickTasksTable.loading"
          :columns="wmsPickTasksTable.columns"
          :dataSource="wmsPickTasksTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
          :toolbar="false"
        />
      </a-tab-pane>
      <a-tab-pane tab="包裹明细" key="wmsShipments" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="wmsShipments"
          :loading="wmsShipmentsTable.loading"
          :columns="wmsShipmentsTable.columns"
          :dataSource="wmsShipmentsTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
          :toolbar="false"
        />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
import {ref, computed, unref, reactive} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
import {formSchema, wmsOutOrdersColumns, wmsPickTasksColumns,wmsShipmentsColumns} from '../WmsWaveMaster.data';
    import {createWave, saveOrUpdate} from '../WmsWaveMaster.api';
    import {columns} from "@/views/outorder/WmsOutOrders.data";
    import {wmsOutOrdersList,wmsPickTasksList,wmsShipmentsList} from "@/views/wave/WmsWaveMaster.api";
    import {useJvxeMethod} from "@/hooks/system/useJvxeMethods";
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    const isDetail = ref(false);
    const formDisabled = ref(false);
    const refKeys = ref(['wmsOutOrders', ]);
    const activeKey = ref('wmsOutOrders');
    const wmsOutOrders = ref();
    const wmsPickTasks = ref();
    const wmsShipments = ref();
    const tableRefs = {wmsOutOrders,wmsPickTasks,wmsShipments};
    const wmsOutOrdersTable = reactive({
      loading: false,
      dataSource: [],
      columns:  wmsOutOrdersColumns,
    })
    const wmsPickTasksTable = reactive({
      loading: false,
      dataSource: [],
      columns:  wmsPickTasksColumns,
    })
    const wmsShipmentsTable = reactive({
      loading: false,
      dataSource: [],
      columns:  wmsShipmentsColumns,
    })
    //表单配置
    const [registerForm, { setProps,resetFields, setFieldsValue, validate, scrollToField }] = useForm({
        labelWidth: 150,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: {span: 12}
    });
    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await resetFields();
        setModalProps({confirmLoading: false,showCancelBtn:!!data?.showFooter,showOkBtn:!!data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        isDetail.value = !!data?.showFooter;
        if (unref(isUpdate)) {
            //表单赋值
            await setFieldsValue({
                ...data.record,
            });

        }
       requestSubTableData(wmsOutOrdersList, {waveId:data?.record?.id}, wmsOutOrdersTable)
       requestSubTableData(wmsPickTasksList, {waveOrderId:data?.record?.id}, wmsPickTasksTable)
       requestSubTableData(wmsShipmentsList, {waveId:data?.record?.id}, wmsShipmentsTable)
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });
  //方法配置
    const [handleChangeTabs,handleSubmit,requestSubTableData,formRef] = useJvxeMethod(requestAddOrEdit,classifyIntoFormData,tableRefs,activeKey,refKeys);
    function classifyIntoFormData(allValues) {
      let main = Object.assign({}, allValues.formValue)
      return {
        ...main, // 展开
        wmsOutOrdersList: allValues.tablesValue[0].tableData,
        wmsPickTasksList: allValues.tablesValue[0].tableData,
        wmsShipmentsList: allValues.tablesValue[0].tableData,
      }
    }
    async function requestAddOrEdit(values) {

    }
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(isDetail) ? '详情' : '编辑'));
    //表单提交事件
    // async function handleSubmit(v) {
    //     try {
    //         let values = await validate();
    //         setModalProps({confirmLoading: true});
    //         //提交表单
    //         await createWave(values);
    //         // await saveOrUpdate(values, isUpdate.value);
    //         //关闭弹窗
    //         closeModal();
    //         //刷新列表
    //         emit('success');
    //     } catch ({ errorFields }) {
    //       if (errorFields) {
    //         const firstField = errorFields[0];
    //         if (firstField) {
    //           scrollToField(firstField.name, { behavior: 'smooth', block: 'center' });
    //         }
    //       }
    //       return Promise.reject(errorFields);
    //     } finally {
    //         setModalProps({confirmLoading: false});
    //     }
    // }
</script>

<style lang="less" scoped>
	/** 时间和数字输入框样式 */
  :deep(.ant-input-number) {
    width: 100%;
  }

  :deep(.ant-calendar-picker) {
    width: 100%;
  }
</style>
