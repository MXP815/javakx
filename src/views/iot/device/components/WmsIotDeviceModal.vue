<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" name="WmsIotDeviceForm">
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from '../WmsIotDevice.data';
  import { saveOrUpdate } from '../WmsIotDevice.api';
  import { router } from '@/router';
  import { getUserDeparts } from '@/views/system/depart/depart.api';
  // Emits声明
  const emit = defineEmits(['register', 'success']);
  const isUpdate = ref(true);
  const isDetail = ref(false);
  let departList = ref([]);
  const filteredOptions = ref('');
  const phoneError = ref('');
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
    if (unref(isUpdate)) {
      //表单赋值
      await setFieldsValue({
        ...data.record,
      });
    }
    // 隐藏底部时禁用整个表单
    setProps({ disabled: !data?.showFooter });
  });
  //设置标题
  const title = computed(() => (!unref(isUpdate) ? '创建设备' : !unref(isDetail) ? '详情' : '编辑设备'));
  //表单提交事件
  async function handleSubmit(v) {
    try {
      let values = await validate();
      setModalProps({ confirmLoading: true });
      //提交表单
      const data = await saveOrUpdate(values, isUpdate.value);
      if (data) {
        router.replace({
          path: '/iot/device/WmsIotDeviceList',
        });
        //关闭弹窗
        closeModal();
        //刷新列表
        emit('success');
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
  // async function loadDepartList() {
  //   const result = await getUserDeparts();
  //   if (!result.list || result.list.length == 0) {
  //     return;
  //   }
  //   departList.value = result.list;
  //   console.log(departList.value);
  // }
  // 手动校验手机号格式
  function validatePhoneNumber(value) {
    if (!value) {
      phoneError.value = '所属仓库不能为空';
      return false;
    }
    phoneError.value = '';
    return true;
  }
  // 失焦时触发验证
  function handlePhoneBlur() {
    validatePhoneNumber(filteredOptions.value);
  }
  onMounted(() => {
    console.log('组件已挂载');
    // loadDepartList();
    // 可以在这里执行一些初始化操作
  });
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
