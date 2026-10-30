<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800" @ok="handleSubmit">
    <BasicForm @register="registerForm" ref="formRef" name="WmsShipmentForm"/>
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated @change="handleChangeTabs">
      <a-tab-pane tab="包裹明细表" key="wmsShipmentDetail" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="wmsShipmentDetail"
          :loading="wmsShipmentDetailTable.loading"
          :columns="wmsShipmentDetailTable.columns"
          :dataSource="wmsShipmentDetailTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
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
import {formSchema,wmsShipmentDetailColumns,wmsWaveListColumns} from '../WmsShipment.data';
import {columns, searchFormSchema, superQuerySchema} from '../../wave/WmsWaveMaster.data';
import {saveOrUpdate,wmsShipmentDetailList} from '../WmsShipment.api';
import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils'
// Emits声明
const emit = defineEmits(['register','success']);
const isUpdate = ref(true);
const formDisabled = ref(false);
const refKeys = ref(['wmsShipmentDetail', ]);
const activeKey = ref('wmsShipmentDetail');
const wmsShipmentDetail = ref();
const tableRefs = {wmsShipmentDetail, };
const wmsShipmentDetailTable = reactive({
  loading: false,
  dataSource: [],
  columns:wmsWaveListColumns
})
//表单配置
const [registerForm, {setProps,resetFields, setFieldsValue, validate}] = useForm({
  labelWidth: 150,
  schemas: [],
  showActionButtonGroup: false,
  baseColProps: {span: 8}
});

//表单赋值
const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {

});
//方法配置
const [handleChangeTabs,handleSubmit,requestSubTableData,formRef] = useJvxeMethod(requestAddOrEdit,classifyIntoFormData,tableRefs,activeKey,refKeys);
//查询列表
requestSubTableData('/wave/wmsWaveMaster/list?column=createTime&order=desc&pageNo=1&pageSize=5', null, wmsShipmentDetailTable)
//设置标题
const title = computed(() => (!unref(isUpdate) ? '新增' : !unref(formDisabled) ? '编辑' : '详情'));

async function reset(){
  await resetFields();
  activeKey.value = 'wmsShipmentDetail';
  wmsShipmentDetailTable.dataSource = [];
}
function classifyIntoFormData(allValues) {
  let main = Object.assign({}, allValues.formValue)
  return {
    ...main, // 展开
    wmsShipmentDetailList: allValues.tablesValue[0].tableData,
  }
}
//表单提交事件
async function requestAddOrEdit(values) {
  alert(0)
  console.log(values)
  try {
    setModalProps({confirmLoading: true});
    //提交表单
    // await saveOrUpdate(values, isUpdate.value);
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
