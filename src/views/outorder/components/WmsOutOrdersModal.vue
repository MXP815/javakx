<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="896" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" name="WmsOutOrdersForm"/>
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated @change="handleChangeTabs">
      <a-tab-pane tab="出库单明细" key="wmsOutOrdersItems" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="wmsOutOrdersItems"
          :loading="wmsOutOrdersItemsTable.loading"
          :columns="wmsOutOrdersItemsTable.columns"
          :dataSource="wmsOutOrdersItemsTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
          :toolbar="true"
          />
      </a-tab-pane>
      <a-tab-pane tab="出库单分配明细" key="wmsOutOrdersAllocation" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="wmsOutOrdersAllocation"
          :loading="wmsOutOrdersAllocationTable.loading"
          :columns="wmsOutOrdersAllocationTable.columns"
          :dataSource="wmsOutOrdersAllocationTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="true"
          :toolbar="true"
          />
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref,reactive} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import { JVxeTable } from '/@/components/jeecg/JVxeTable'
    import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods.ts'
    import {
      formSchema,
      wmsOutOrdersAllocationColumns,
      createWmsOutOrderItemsJVxeColumns
    } from '../WmsOutOrders.data';
    import {saveOrUpdate,wmsOutOrdersItemsList,wmsOutOrdersAllocationList} from '../WmsOutOrders.api';
    import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils'
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    const formDisabled = ref(false);
    const refKeys = ref(['wmsOutOrdersItems', 'wmsOutOrdersAllocation', ]);
    const activeKey = ref('wmsOutOrdersItems');
    const wmsOutOrdersItems = ref();
    const wmsOutOrdersAllocation = ref();
    const tableRefs = {wmsOutOrdersItems, wmsOutOrdersAllocation, };

    const wmsOutOrdersAllocationTable = reactive({
          loading: false,
          dataSource: [],
          columns:wmsOutOrdersAllocationColumns
    })
    //表单配置
    const [registerForm, {setProps,resetFields, setFieldsValue,getFieldsValue, validate}] = useForm({
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: {span: 12}
    });
    const wmsOutOrdersItemsTable = reactive({
      loading: false,
      dataSource: [],
      columns:createWmsOutOrderItemsJVxeColumns(getFieldsValue)
    })
     //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await reset();
        setModalProps({confirmLoading: false,showCancelBtn:data?.showFooter,showOkBtn:data?.showFooter});
        isUpdate.value = !!data?.isUpdate;
        formDisabled.value = !data?.showFooter;
        if (unref(isUpdate)) {
            //表单赋值
            await setFieldsValue({
                ...data.record,
            });

             requestSubTableData(wmsOutOrdersItemsList, {id:data?.record?.id}, wmsOutOrdersItemsTable)
             requestSubTableData(wmsOutOrdersAllocationList, {id:data?.record?.id}, wmsOutOrdersAllocationTable)
        }
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });
    //方法配置
    const [handleChangeTabs,handleSubmit,requestSubTableData,formRef] = useJvxeMethod(requestAddOrEdit,classifyIntoFormData,tableRefs,activeKey,refKeys);
    //设置标题
    const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(formDisabled) ? '编辑' : '详情'));

    async function reset(){
      await resetFields();
      activeKey.value = 'wmsOutOrdersItems';
      wmsOutOrdersItemsTable.dataSource = [];
      wmsOutOrdersAllocationTable.dataSource = [];
    }
    function classifyIntoFormData(allValues) {
         let main = Object.assign({}, allValues.formValue)
         return {
           ...main, // 展开
           wmsOutOrdersItemsList: allValues.tablesValue[0].tableData,
           wmsOutOrdersAllocationList: allValues.tablesValue[1].tableData,
         }
       }
    //表单提交事件
    async function requestAddOrEdit(values) {
        try {
            setModalProps({confirmLoading: true});
            //提交表单
            await saveOrUpdate(values, isUpdate.value);
            //关闭弹窗
            closeModal();
            //刷新列表
            emit('success');
        } finally {
            setModalProps({confirmLoading: false});
        }
    }
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
