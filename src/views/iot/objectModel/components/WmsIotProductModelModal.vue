<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" name="WmsIotProductModelForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from '../WmsIotProductModel.data';
  import { saveOrUpdate } from '../WmsIotProductModel.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const isDetail = ref(false);
  const isDashboard = ref(false);
  //表单配置
  const [registerForm, { setProps, resetFields, setFieldsValue, validate, scrollToField }] = useForm({
    labelWidth: 150,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  //表单赋值
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    //重置表单
    await resetFields();
    setModalProps({ confirmLoading: false, showCancelBtn: !!data?.showFooter, showOkBtn: !!data?.showFooter });
    isUpdate.value = !!data?.isUpdate;
    isDetail.value = !!data?.showFooter;
    isDashboard.value = data?.data;
    if (unref(isUpdate)) {
      console.log(data.record);
      //表单赋值
      const datas = {
        ...data.record,
        needExtraArg: data.record.needExtraArg ? data.record.needExtraArg.toString() : undefined,
      };
      await setFieldsValue({
        ...datas,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '创建功能' : !unref(isDetail) ? '查看功能' : '编辑功能'));
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      const params = new URLSearchParams(window.location.search);
      let pCodeObj = params.get('product');
      let productVal = JSON.parse(decodeURIComponent(pCodeObj));
      const valObj = {
        ...values,
        productCode: productVal.productCode,
      };
      setModalProps({ confirmLoading: true });
      //提交表单
      await saveOrUpdate(valObj, isUpdate.value);
      //关闭弹窗
      closeModal();
      //刷新列表
      emit('success');
    } catch ({ errorFields }) {
      if (errorFields) {
        const firstField = errorFields[0];
        if (firstField) {
          scrollToField(firstField.name, { behavior: 'smooth', block: 'center' });
        }
      }
      return Promise.reject(errorFields);
    } finally {
      setModalProps({ confirmLoading: false });
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
