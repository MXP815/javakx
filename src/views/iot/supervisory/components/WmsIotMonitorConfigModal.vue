<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="取消"
    class="supervisoryModel"
  >
    <WmsIotMonitorConfigForm ref="registerForm" @ok="submitCallback" :formDisabled="disableSubmit" :formBpm="false" />
  </j-modal>
</template>

<script lang="ts" setup>
  import { ref, nextTick, defineExpose } from 'vue';
  import WmsIotMonitorConfigForm from './WmsIotMonitorConfigForm.vue';
  import JModal from '/@/components/Modal/src/JModal/JModal.vue';
  const title = ref<string>('');
  const width = ref<number>(600);
  const visible = ref<boolean>(false);
  const disableSubmit = ref<boolean>(false);
  const registerForm = ref();
  const emit = defineEmits(['register', 'success']);

  /**
   * 新增
   */
  function add() {
    title.value = '添加监控';
    visible.value = true;
    nextTick(() => {
      registerForm.value.add();
    });
  }

  /**
   * 编辑
   * @param record
   */
  function edit(record) {
    title.value = disableSubmit.value ? '监控详情' : '编辑监控';
    visible.value = true;
    nextTick(() => {
      registerForm.value.edit(record);
    });
  }

  /**
   * 确定按钮点击事件
   */
  function handleOk() {
    registerForm.value.submitForm();
  }

  /**
   * form保存回调事件
   */
  function submitCallback() {
    handleCancel();
    emit('success');
  }

  /**
   * 取消按钮回调事件
   */
  function handleCancel() {
    visible.value = false;
  }

  defineExpose({
    add,
    edit,
    disableSubmit,
  });
</script>

<style lang="less">
  /**隐藏样式-modal确定按钮 */
  .jee-hidden {
    display: none !important;
  }
  .supervisoryModel {
    .ant-modal-body {
      height: auto !important;
    }
  }
</style>
<style lang="less" scoped></style>
