<template>
  <div class="navContainer">
    <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
      <BasicForm @register="registerForm" name="WmsIotProductModelForm" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from '../WmsIotProductModel.data';
  import { saveOrUpdate } from '../WmsIotProductModel.api';
  import { router } from '/@/router';
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
      console.log(values);
      const valObj = {
        ...values,
      };
      setModalProps({ confirmLoading: true });
      //提交表单
      const data = await saveOrUpdate(valObj, isUpdate.value);
      console.log(data);
      if (data) {
        //关闭弹窗
        closeModal();
        //进入功能列表
        router.replace({
          path: '/iot/manage/product/list',
        });
      }
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
