<template>
  <BasicModal v-bind="$attrs" @register="registerAuditModal" destroyOnClose :title="title" :width="896" @ok="requestAudit">
      <BasicForm @register="registerAuditForm" ref="formRef" name="WmsStockInOrdersAuditForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref,reactive} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {auditFormSchema} from '../WmsOutOrders.data';
    import {
      submitAuditForm
    } from '../WmsOutOrders.api';
    import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils'
    // Emits声明
    const emit = defineEmits(['register','success']);
    const isUpdate = ref(true);
    const formDisabled = ref(false);
    //表单配置
    const [registerAuditForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
        schemas: auditFormSchema,
        showActionButtonGroup: false,
        baseColProps: {span: 12}
    });
     //表单赋值
    const [registerAuditModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
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
        }
        // 隐藏底部时禁用整个表单
       setProps({ disabled: !data?.showFooter })
    });

    //方法配置
    // const [handleChangeTabs,handleSubmit,requestSubTableData,formRef] = useJvxeMethod(requestAudit,classifyIntoFormData,tableRefs,activeKey,refKeys);

    //设置标题
    // const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(formDisabled) ? '编辑' : '详情'));
    const title = computed(() => '审核');

    async function reset(){
      await resetFields();
    }
    function classifyIntoFormData(allValues) {
         let main = Object.assign({}, allValues.formValue)
         return {
           ...main, // 展开
         }
       }
    //表单提交事件
    async function requestAudit(v) {
      console.log(v)
        try {
            let values = await validate();
          console.log("values==",values)
            setModalProps({confirmLoading: true});
            //提交表单
            await submitAuditForm(values);
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
