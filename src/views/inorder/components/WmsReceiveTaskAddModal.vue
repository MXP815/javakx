<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
      <BasicForm @register="registerForm" name="WmsReceiveTaskForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
    import {ref, computed, unref} from 'vue';
    import {BasicModal, useModalInner} from '/@/components/Modal';
    import {BasicForm, useForm} from '/@/components/Form/index';
    import {receiveTaskAdd} from '../WmsStockInOrders.data';
    import {createReceiveTask, saveOrUpdate} from '../WmsStockInOrders.api';
    // Emits声明
    const emit = defineEmits(['register','success']);
    const orderIds = ref('');
    //表单配置
    const [registerForm, { setProps,resetFields, setFieldsValue, validate, scrollToField }] = useForm({
        labelWidth: 150,
        schemas: receiveTaskAdd,
        showActionButtonGroup: false,
        baseColProps: {span: 24}
    });
    //表单赋值
    const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
        //重置表单
        await resetFields();
        setModalProps({confirmLoading: false,showCancelBtn:true,showOkBtn:true});
        orderIds.value = data.orderIds;
    });
    //设置标题
    const title = '创建收货任务';
    //表单提交事件
    async function handleSubmit(v) {
        try {
            let values = await validate();
            setModalProps({confirmLoading: true});
            //提交表单
            await createReceiveTask({orderIds:orderIds.value,...values});
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
