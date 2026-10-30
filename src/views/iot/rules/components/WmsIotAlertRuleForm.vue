<template>
  <a-spin :spinning="confirmLoading">
    <JFormContainer :disabled="disabled">
      <template #detail>
        <a-form ref="formRef" class="antd-modal-form" :labelCol="labelCol" :wrapperCol="wrapperCol" name="WmsIotAlertRuleForm">
          <a-row>
            <a-col :span="24">
              <a-form-item label="报警规则名称" v-bind="validateInfos.alertName" id="WmsIotAlertRuleForm-alertName" name="alertName">
                <a-input v-model:value="formData.alertName" :showCount="true" :maxlength="30" placeholder="请输入" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="所属产品" v-bind="validateInfos.productName" id="WmsIotAlertRuleForm-productName" name="productName">
                <a-select v-model:value="formData.productName" placeholder="请选择" :options="recordsData" allowClear @change="handleAsyncChange" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="关联设备" v-bind="validateInfos.deviceName" id="WmsIotAlertRuleForm-deviceName" name="deviceName">
                <a-select v-model:value="formData.deviceName" placeholder="请选择" :options="deviceData" allowClear @change="handleDeviceChange" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="监控指标" v-bind="validateInfos.modelName" id="WmsIotAlertRuleForm-modelName" name="modelName">
                <a-select v-model:value="formData.modelName" placeholder="请选择" :options="objectModelData" @change="handleModelChange" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="报警级别" v-bind="validateInfos.alertLevel" id="WmsIotAlertRuleForm-alertLevel" name="alertLevel">
                <j-dict-select-tag v-model:value="formData.alertLevel" dictCode="alert_level_dict" placeholder="请选择" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="连续周期" v-bind="validateInfos.cycle" id="WmsIotAlertRuleForm-cycle" name="cycle">
                <j-dict-select-tag :stringToNumber="true" v-model:value="formData.cycle" dictCode="period_dict" placeholder="请选择" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="运算符" v-bind="validateInfos.operator" id="WmsIotAlertRuleForm-operator" name="operator">
                <j-dict-select-tag v-model:value="formData.operator" dictCode="operator_dict" placeholder="请选择" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="阈值" v-bind="validateInfos.threshold" id="WmsIotAlertRuleForm-threshold" name="threshold">
                <a-input-number :precision="0" v-model:value="formData.threshold" :controls="false" placeholder="请输入" style="width: 100%" />
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item label="沉默周期" v-bind="validateInfos.ignoreDuration" id="WmsIotAlertRuleForm-ignoreDuration" name="ignoreDuration">
                <j-dict-select-tag
                  :stringToNumber="true"
                  v-model:value="formData.ignoreDuration"
                  dictCode="ignore_duration_dict"
                  placeholder="请选择"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="通知方式">
                <div class="notifyBox">
                  <a-checkbox v-model:checked="notifyCheck" @change="handleNotiType">短信</a-checkbox>
                  <div class="tags" v-if="notifyCheck">
                    <template v-for="(tag, index) in state.notifyTags" :key="tag">
                      <a-tooltip v-if="tag.length > 20" :title="tag">
                        <a-tag :closable="true" @close="handleClose(tag)">
                          {{ `${tag.slice(0, 20)}...` }}
                        </a-tag>
                      </a-tooltip>
                      <a-tag v-else :closable="true" @close="handleClose(tag)">
                        {{ tag }}
                      </a-tag>
                    </template>
                    <a-input
                      v-if="state.inputVisible"
                      ref="inputRef"
                      v-model:value="state.inputValue"
                      type="text"
                      size="small"
                      :maxLength="11"
                      :style="{ width: '120px' }"
                      @blur="handleInputConfirm"
                      @keyup.enter="handleInputConfirm"
                    />
                    <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
                      <plus-outlined />
                      联系方式
                    </a-tag>
                  </div>
                </div>
                <div class="notifyBox">
                  <a-checkbox v-model:checked="mailTypeCheck" @change="handleMailType">邮箱</a-checkbox>
                  <div class="tags" v-if="mailTypeCheck">
                    <template v-for="(tag, index) in state.emailTags" :key="tag">
                      <a-tooltip v-if="tag.length > 20" :title="tag">
                        <a-tag :closable="true" @close="handleEmailClose(tag)">
                          {{ `${tag.slice(0, 20)}...` }}
                        </a-tag>
                      </a-tooltip>
                      <a-tag v-else :closable="true" @close="handleEmailClose(tag)">
                        {{ tag }}
                      </a-tag>
                    </template>
                    <a-input
                      v-if="state.inputEmailVisible"
                      ref="inputEmailRef"
                      v-model:value="state.inputEmailValue"
                      type="text"
                      size="small"
                      :style="{ width: '120px' }"
                      @blur="handleEmailConfirm"
                      @keyup.enter="handleEmailConfirm"
                    />
                    <a-tag v-else style="background: #fff; border-style: dashed" @click="showEmailInput">
                      <plus-outlined />
                      联系方式
                    </a-tag>
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <div class="footBox">
            <a-button type="primary" @click="submitForm">提交</a-button>
            <a-button style="margin-left: 10px" @click="handleBack">返回</a-button>
          </div>
        </a-form>
      </template>
    </JFormContainer>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive, defineExpose, nextTick, defineProps, computed, onMounted } from 'vue';
  import { defHttp } from '/@/utils/http/axios';
  import { useMessage } from '/@/hooks/web/useMessage';
  import JDictSelectTag from '/@/components/Form/src/jeecg/components/JDictSelectTag.vue';
  import JCheckbox from '/@/components/Form/src/jeecg/components/JCheckbox.vue';
  import { getValueType } from '/@/utils';
  import { saveOrUpdate, getDetails } from '../WmsIotAlertRule.api';
  import { list } from '../../product/WmsIotProduct.api';
  import { devicelist } from '../../device/WmsIotDevice.api';
  import { modellist } from '../../objectModel/WmsIotProductModel.api';
  import { Form } from 'ant-design-vue';
  import JFormContainer from '/@/components/Form/src/container/JFormContainer.vue';
  import { validateSpaceStr, validatePhone, validateEmail } from '/@/utils/validate';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { router } from '/@/router';
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
  const inputRef = ref();
  const inputEmailRef = ref();
  const state = reactive({
    notifyTags: [],
    emailTags: [],
    inputVisible: false,
    inputEmailVisible: false,
    inputValue: '',
    inputEmailValue: '',
  });
  const useForm = Form.useForm;
  const emit = defineEmits(['register', 'ok']);
  const formData = reactive<Record<string, any>>({
    id: '',
    alertName: '',
    productCode: undefined,
    productName: undefined,
    deviceName: undefined,
    deviceCode: undefined,
    modelName: undefined,
    modelCode: undefined,
    alertLevel: '',
    operator: '',
    threshold: undefined,
    cycle: undefined,
    ignoreDuration: undefined,
    notifyType: '',
    mailType: '',
  });
  let notifyCheck = ref(null);
  let mailTypeCheck = ref(null);
  const { createMessage } = useMessage();
  const labelCol = ref<any>({ xs: { span: 24 }, sm: { span: 5 } });
  const wrapperCol = ref<any>({ xs: { span: 24 }, sm: { span: 16 } });
  const confirmLoading = ref<boolean>(false);
  //表单验证
  const validatorRules = reactive({
    alertName: [
      { required: true, message: '报警规则名称不能为空' },
      {
        validator: (rule, val, callback) => {
          console.log(rule, val, callback);
          //需要return 一个Promise对象
          return new Promise((resolve, reject) => {
            validateSpaceStr(val, resolve, reject);
          });
        },
      },
    ],
    productName: [{ required: true, message: '所属产品不能为空', trigger: 'change' }],
    deviceName: [{ required: true, message: '关联设备不能为空' }],
    modelName: [{ required: true, message: '监控指标不能为空' }],
    alertLevel: [{ required: true, message: '报警级别不能为空' }],
    operator: [{ required: true, message: '运算符不能为空' }],
    threshold: [{ required: true, message: '阈值不能为空' }],
    cycle: [{ required: true, message: '连续周期名称不能为空' }],
    ignoreDuration: [{ required: true, message: '沉默周期不能为空' }],
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

    getModelData(option);
  }
  // 获取设备，功能数据
  const getModelData = async (option) => {
    const params = {
      pageSize: 10000,
      productCode: option.productCode,
    };
    const deviceParams = {
      ...params,
      isEnable: '1',
    };
    const data = await devicelist(deviceParams);
    const renamedUsers = data.records.map((val) => ({
      ...val,
      label: val.deviceName,
      value: val.deviceCode,
    }));

    deviceData.value = renamedUsers;
    const modelParams = {
      ...params,
      type: 'field',
    };
    const dataModel = await modellist(modelParams);
    const renamedModel = dataModel.records.map((val) => ({
      ...val,
      label: val.modelName,
      value: val.id,
    }));
    objectModelData.value = renamedModel;
  };
  // 触发设备
  function handleDeviceChange(value, option) {
    formData.deviceCode = option.deviceCode;
    formData.deviceName = option.deviceName;
  }
  // 触发功能
  function handleModelChange(value, option) {
    formData.modelCode = option.code;
    formData.modelName = option.modelName;
  }
  // 通知方式
  function handleNotiType(value) {
    notifyCheck.value = value.target.checked;
    if (!notifyCheck.value) {
      state.notifyTags = [];
    }
  }
  function handleMailType(value) {
    mailTypeCheck.value = value.target.checked;
    if (!mailTypeCheck.value) {
      state.emailTags = [];
    }
  }
  const handleClose = (removedTag: string) => {
    const notifyTags = state.notifyTags.filter((tag) => tag !== removedTag);
    state.notifyTags = notifyTags;
    console.log(state.notifyTags);
  };

  const handleEmailClose = (removedTag: string) => {
    const emailTags = state.emailTags.filter((tag) => tag !== removedTag);
    state.emailTags = emailTags;
  };

  const showInput = () => {
    state.inputVisible = true;
    nextTick(() => {
      inputRef.value.focus();
    });
  };
  const showEmailInput = () => {
    state.inputEmailVisible = true;
    nextTick(() => {
      inputEmailRef.value.focus();
    });
  };
  const isPhoneError = ref(false);
  const handleInputConfirm = () => {
    if (state.inputValue === '') {
      isPhoneError.value = false;
      return false;
    }

    const validate = validatePhone(state.inputValue);
    if (!validate) {
      createMessage.error('手机格式不正确');
      isPhoneError.value = true;
      return false;
    } else {
      setNotity();
      isPhoneError.value = false;
    }
  };
  const isEmailError = ref(false);
  const handleEmailConfirm = () => {
    if (state.inputEmailValue === '') {
      isEmailError.value = false;
      return false;
    }
    const validate = validateEmail(state.inputEmailValue);
    if (!validate) {
      createMessage.error('邮箱格式不正确');
      isEmailError.value = true;
      return false;
    } else {
      setNotity();
      isEmailError.value = false;
    }
  };
  const setNotity = () => {
    const inputValue = state.inputValue;
    const inputEmailValue = state.inputEmailValue;
    let notifyTags = state.notifyTags;
    let emailTags = state.emailTags;
    console.log(state.inputVisible);
    if (inputValue && notifyTags.indexOf(inputValue) === -1) {
      notifyTags = [...notifyTags, inputValue];
      console.log(notifyTags);
    }
    if (inputEmailValue && emailTags.indexOf(inputEmailValue) === -1 && state.inputEmailValue) {
      emailTags = [...emailTags, inputEmailValue];
    }
    if (!notifyCheck.value) {
      notifyTags = [];
    }
    if (!mailTypeCheck.value) {
      emailTags = [];
    }
    const phoneTags = {
      noti: notifyTags.length > 0 ? notifyTags : undefined,
      email: emailTags.length > 0 ? emailTags : undefined,
    };
    formData.notifyType = JSON.stringify(phoneTags);
    Object.assign(state, {
      notifyTags,
      emailTags,
      inputVisible: false,
      inputEmailVisible: false,
      inputValue: '',
      inputEmailValue: '',
    });
  };
  /**
   * 新增
   */
  function add() {
    edit({});
  }

  /**
   * 编辑
   */
  function edit(id) {
    nextTick(async () => {
      resetFields();
      const params = {
        id: id,
      };
      const data = await getDetails(params);

      if (data.notifyType !== '') {
        const objs = JSON.parse(data.notifyType);
        if (objs.noti) {
          notifyCheck.value = true;
          state.notifyTags = objs.noti;
        }
        if (objs.email) {
          mailTypeCheck.value = true;
          state.emailTags = objs.email;
        }
      }
      getModelData(data);
      //赋值
      Object.assign(formData, data);
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

    if (notifyCheck.value && !isPhoneError.value && state.notifyTags.length === 0) {
      createMessage.error('联系方式不能为空');
      confirmLoading.value = false;
      return false;
    } else if (mailTypeCheck.value && !isEmailError.value && state.emailTags.length === 0) {
      createMessage.error('邮箱不能为空');
      confirmLoading.value = false;
      return false;
    } else {
      if (isPhoneError.value) {
        createMessage.error('手机格式不正确');

        confirmLoading.value = false;
        return false;
      } else if (isEmailError.value) {
        createMessage.error('邮箱格式不正确');
        confirmLoading.value = false;
        return false;
      } else {
        console.log(isPhoneError.value);
        //时间格式化
        setNotity();
        let model = formData;

        if (!notifyCheck.value) {
          state.notifyTags = [];
        }
        if (!mailTypeCheck.value) {
          state.emailTags = [];
        }
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
              handleBack();
              emit('ok');
            } else {
              createMessage.warning(res.message);
            }
          })
          .finally(() => {
            confirmLoading.value = false;
          });
      }
    }
  }
  function handleBack() {
    router.replace({
      path: '/iot/rules/WmsIotAlertRuleList',
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
