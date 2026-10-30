<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="WmsIotAlertRuleForm">
          <a-row>
            <a-col :span="24">
              <a-form-item label="所属产品" v-bind="validateInfos.productName" id="WmsIotAlertRuleForm-productName" name="productName">
                <a-select v-model:value="formData.productName" placeholder="请选择" :options="recordsData" allowClear @change="handleAsyncChange" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="关联设备" v-bind="validateInfos.deviceWithWarehouseName" id="WmsIotAlertRuleForm-deviceName" name="deviceName">
                <a-select
                  v-model:value="formData.deviceWithWarehouseName"
                  placeholder="请选择"
                  :options="deviceData"
                  allowClear
                  @change="handleDeviceChange"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="功能名称" v-bind="validateInfos.modelName" id="WmsIotAlertRuleForm-modelName" name="modelName">
                <a-select v-model:value="formData.modelName" placeholder="请选择" :options="objectModelData" @change="handleModelChange" allowClear />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineExpose, nextTick, defineProps, computed, onMounted } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getValueType } from '/@/utils';
  import { saveOrUpdate } from '../WmsIotMonitorConfig.api';
  import { list } from '../../product/WmsIotProduct.api';
  import { devicelist } from '../../device/WmsIotDevice.api';
  import { modellist } from '../../objectModel/WmsIotProductModel.api';
  import { Form } from 'ant-design-vue';
  import { router } from '/@/router';
  import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
  const params = new URLSearchParams(window.location.search);
  let rulesId = params.get('id');
  const props = defineProps({
    formDisabled: { type: Boolean, default: false },
    formData: { type: Object, default: () => ({}) },
    formBpm: { type: Boolean, default: true },
  });
  const formRef = ref();
  const recordsData = ref([]);
  const deviceData = ref([]);
  const objectModelData = ref([]);
  const useForm = Form.useForm;
  const emit = defineEmits(['register', 'ok']);
  const formData = reactive<Record<string, any>>({
    id: '',
    productCode: null,
    productName: null,
    deviceCode: null,
    deviceName: null,
    deviceWithWarehouseName: null,
    modelCode: null,
    modelName: null,
  });
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = reactive({
    productName: [{ required: true, message: '所属产品不能为空', trigger: 'change' }],
    deviceWithWarehouseName: [{ required: true, message: '关联设备不能为空' }],
    modelName: [{ required: true, message: '监控指标不能为空' }],
  });
  const { resetFields, validate, validateInfos } = useForm(formData, validatorRules, { immediate: false });

  // 表单禁用
  const disabled = computed(() => {
    if (props.formBpm === true) {
      if (props.formData.disabled === false) {
        return false;
      } else {
        return true;
      }
    }
    return props.formDisabled;
  });
  onMounted(() => {
    getProList();
    if (rulesId) {
      edit(rulesId);
    }
  });
  // 获取产品列表
  async function getProList() {
    const params = {
      pageSize: 10000,
    };
    const data = await list(params);
    const renamedUsers = data.records.map((val) => ({
      ...val,
      label: val.productName,
      value: val.productCode,
    }));
    recordsData.value = renamedUsers;
    console.log(recordsData.value);
  }
  // 触发产品
  async function handleAsyncChange(value, option) {
    formData.productCode = option.productCode;
    formData.productName = option.productName;
    if (formData.deviceCode) {
      formData.deviceCode = null;
    }
    if (formData.deviceName) {
      formData.deviceName = null;
    }
    if (formData.modelCode) {
      formData.modelCode = null;
    }
    if (formData.modelName) {
      formData.modelName = null;
    }
    let params = {
      pageSize: 10000,
      productCode: option.productCode,
    };

    const data = await devicelist(params);
    const renamedUsers = data.records.map((val) => ({
      ...val,
      label: val.deviceWithWarehouseName,
      value: val.deviceCode,
    }));

    deviceData.value = renamedUsers;
    const paramsModel = {
      ...params,
      type: 'field',
    };
    const dataModel = await modellist(paramsModel);
    const renamedModel = dataModel.records.map((val) => ({
      ...val,
      label: val.modelName,
      value: val.id,
    }));
    objectModelData.value = renamedModel;
  }
  // 触发设备
  function handleDeviceChange(value, option) {
    formData.deviceCode = option.deviceCode;
    formData.deviceName = option.deviceName;
    formData.deviceWithWarehouseName = option.deviceWithWarehouseName;
  }
  // 触发功能
  function handleModelChange(value, option) {
    formData.modelCode = option.code;
    formData.modelName = option.modelName;
  }
  /**
   * 新增
   */
  function add() {
    edit({});
  }

  /**
   * 编辑
   */
  function edit(record) {
    nextTick(() => {
      resetFields();
      const tmpData = {};
      Object.keys(formData).forEach((key) => {
        if (record.hasOwnProperty(key)) {
          tmpData[key] = record[key];
        }
      });
      handleAsyncChange(tmpData, tmpData);
      //赋值
      Object.assign(formData, tmpData);
    });
  }

  /**
   * 提交数据
   */
  async function submitForm() {
    try {
      // 触发表单验证
      await validate();
    } catch ({ errorFields }) {
      if (errorFields) {
        const firstField = errorFields[0];
        if (firstField) {
          formRef.value.scrollToField(firstField.name, { behavior: 'smooth', block: 'center' });
        }
      }
      return Promise.reject(errorFields);
    }
    confirmLoading.value = true;
    const isUpdate = ref<boolean>(false);
    //时间格式化
    let model = formData;
    if (model.id) {
      isUpdate.value = true;
    }
    //循环数据
    for (let data in model) {
      //如果该数据是数组并且是字符串类型
      if (model[data] instanceof Array) {
        let valueType = getValueType(formRef.value.getProps, data);
        //如果是字符串类型的需要变成以逗号分割的字符串
        if (valueType === 'string') {
          model[data] = model[data].join(',');
        }
      }
    }
    await saveOrUpdate(model, isUpdate.value)
      .then((res) => {
        if (res.success) {
          createMessage.success(res.message);
          router.replace({
            path: '/iot/supervisory/WmsIotMonitorConfigList',
          });
          emit('ok');
        } else {
          createMessage.warning(res.message);
        }
      })
      .finally(() => {
        confirmLoading.value = false;
      });
  }
  defineExpose({
    add,
    edit,
    submitForm,
  });
</script>

<style lang="less" scoped>
  .antd-modal-form {
    padding: 14px;
  }
  .notifyBox {
    display: flex;
    margin-top: 6px;

    .tags {
      display: inline-block;
      width: calc(100% - 60px);
      span {
        margin-bottom: 5px;
      }
    }
    :deep(.ant-checkbox-wrapper) {
      width: 60px;
      display: flex;
      align-items: self-start;
      padding-left: 15px;
      position: relative;
      .ant-checkbox {
        position: absolute;
        left: 0;
        top: 4px;
      }
    }
  }
  .footBox {
    text-align: center;
  }
</style>
