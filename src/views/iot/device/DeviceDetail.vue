<template>
  <div class="deviceDetailBox" v-if="detailData.id !== ''">
    <a-card title="设备信息">
      <div class="info-item">
        <h1>所属产品：</h1>
        <span>{{ detailData.productName }}</span>
      </div>
      <div class="info-item">
        <h1>设备状态：</h1>
        <span class="colWran" v-if="detailData.deviceStatus === -1">未激活</span>
        <span class="colGray" v-if="detailData.deviceStatus === 0">离线</span>
        <span class="colGreen" v-if="detailData.deviceStatus === 1">在线</span>
        <span class="colRed" v-if="detailData.deviceStatus === 2">禁用</span>
      </div>
      <div class="info-item">
        <h1>设备名称：</h1>
        <span>{{ detailData.deviceName }}</span>
      </div>
      <div class="info-item">
        <h1>设备编码：</h1>
        <span>{{ detailData.deviceCode }}</span>
      </div>
      <div class="info-item">
        <h1>所属仓库：</h1>
        <span>{{ detailData.warehouseName }}</span>
      </div>
      <div class="info-item">
        <h1>节点类型：</h1>
        <span>{{ detailData.nodeType === 'direct' ? '直连设备' : '网关设备' }}</span>
      </div>
      <div class="info-item">
        <h1>连网方式：</h1>
        <span v-if="detailData.networkMode === 'wifi'">WiFi</span>
        <span v-if="detailData.networkMode === '2'">蜂窝（2G、3G、4G、5G)</span>
        <span v-if="detailData.networkMode === 'ethernet'">以太网</span>
        <span v-if="detailData.networkMode === 'other'">其他</span>
      </div>
      <div class="info-item">
        <h1>认证方式：</h1>
        <span>设备密钥</span>
      </div>
      <div class="info-item">
        <h1>IP地址：</h1>
        <span>{{ detailData.ipAddr ? detailData.ipAddr : '--' }}</span>
      </div>
      <div class="info-item">
        <h1>创建时间：</h1>
        <span>{{ detailData.createTime }}</span>
      </div>
      <div class="info-item">
        <h1>备注信息：</h1>
        <span>{{ detailData.remark ? detailData.remark : '--' }}</span>
      </div>
      <div class="deviceImg">
        <!-- <img :src="detailData.imageUrl" /> -->
        <!-- <img src="render.renderImage(detailData.imageUrl)" /> -->
        <component :is="renderedImage" />
      </div>
    </a-card>
    <div class="deviceData">
      <a-card title="属性数据">
        <div class="search"
          ><a-input v-model:value="searchForm.name" placeholder="请输入属性功能名称" />
          <a-button type="primary" block @click="handleFieldSearch">查询</a-button>
          <a-button block @click="handleReset('field')">重置</a-button></div
        >
        <div class="dataBox" v-if="fieldModels.records && fieldModels.records.length > 0">
          <div v-for="(item, index) in fieldModels.records" :key="index" class="item">
            <div class="temperature">
              <div>
                <p>{{ item.modelName }}</p>
                <p>{{ item.value ? item.value + item.unit : '--' }}</p>
              </div>
              <div class="dataText" @click="showHistoryModal(index, item)">历史数据</div>
              <div v-if="fielActive === index && open">
                <a-modal v-model:open="open" width="800px" title="历史数据" :footer="null" class="historyModel">
                  <!--定义表格-->
                  <BasicTable @register="registerTable" :toolBarRender="false" />
                </a-modal>
              </div>
            </div>
            <div class="time">更新时间：{{ item.updateTime ? item.updateTime : '--' }}</div>
          </div>
        </div>
        <div v-else class="noData">暂无数据</div>
        <div class="pageBox">
          <Pagination
            size="small"
            v-if="fieldModels.total > 10"
            :total="fieldModels.total"
            v-model:current="searchForm.pageNo"
            :pageSize="searchForm.pageSize"
            @change="handlePage('field', $event)"
            show-size-changer
            show-quick-jumper
          />
        </div>
      </a-card>
      <a-card>
        <template #title>
          <div class="controlTie"><span>设备控制</span><span class="dataText" @click="handleContro">历史数据</span></div>
        </template>
        <a-modal v-model:open="setopen" width="800px" title="历史数据" :footer="null">
          <!--定义表格-->
          <BasicTable :columns="setcolumns" :toolBarRender="false" />
        </a-modal>
        <div class="search"
          ><a-input v-model:value="searchServiceForm.name" placeholder="请输入服务功能名称" />
          <a-button type="primary" block @click="handleServiceSearch">查询</a-button>
          <a-button block @click="handleReset">重置</a-button></div
        >
        <div class="dataBox" v-if="serviceModels.records && serviceModels.records.length > 0">
          <div v-for="(item, index) in serviceModels.records" :key="index" class="item">
            <div class="temperature">
              <div v-if="item.needExtraArg === 1">
                <p
                  ><a-tooltip placement="topLeft">
                    <template #title>
                      <span v-if="item.argType === 'int'">请输入整数</span>
                      <span v-else-if="item.argType === 'double'">请输入数字</span>
                      <span v-else>支持中英文、数字、短划线、下划线、@、英文句号、英文冒号</span>
                    </template>
                    {{ item.modelName }}<ExclamationCircleOutlined /> </a-tooltip
                ></p>
                <p class="controlInput">
                  <a-input v-if="item.argType === 'text'" :maxlength="200" v-model:value="item.controlValue" placeholder="请输入参数" />
                  <a-input-number
                    v-else
                    :precision="undefined"
                    v-model:value="item.controlValue"
                    :controls="false"
                    placeholder="请输入参数"
                    @blur="handleFocus($event, item)"
                  />
                  <span class="text" @click="handleSend(item)">发送</span></p
                >
              </div>
              <div v-else class="tit">
                <p
                  ><span @click="handleSend(item)">{{ item.modelName }}</span></p
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else class="noData">暂无数据</div>
        <div class="pageBox">
          <Pagination
            size="small"
            v-if="serviceModels.total > 10"
            :total="serviceModels.total"
            v-model:current="searchServiceForm.pageNo"
            :pageSize="searchServiceForm.pageSize"
            @change="handlePage"
            show-size-changer
            show-quick-jumper
          />
        </div>
      </a-card>
    </div>
    <div class="footBox">
      <a-button style="margin-left: 10px" @click="handleBack">返回</a-button>
    </div>
  </div>
</template>
<script lang="ts" name="manage-wmsIotDeviceDetail" setup>
  import { onMounted, ref, computed } from 'vue';
  import { detail } from './WmsIotDevice.api';
  import { BasicColumn, BasicTable } from '@/components/Table';
  import { useListPage } from '@/hooks/system/useListPage';
  import { getHistorylist, setCtrl, getFieldlist, getServicelist } from './WmsIotDevice.api';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Pagination } from 'ant-design-vue';
  import { router } from '@/router';
  import { render } from '@/utils/common/renderUtils';
  import { validateSpaceStr } from '@/utils/validate';
  import { useMessage } from '@/hooks/web/useMessage';
  let detailData = ref({} as any);
  const { createMessage } = useMessage();
  const open = ref<boolean>(false);
  const setopen = ref<boolean>(false);
  const params = new URLSearchParams(window.location.search);
  let deviceId = params.get('deviceId');
  const queryParam = ref({});
  const controlValue = ref(null);
  const precisionVal = ref(0);
  const fieldModels = ref({} as any);
  const serviceModels = ref({} as any);
  const fielActive = ref(-1);
  const searchForm = ref({
    pageNo: 1,
    pageSize: 10,
  } as any);
  const searchServiceForm = ref({
    pageNo: 1,
    pageSize: 10,
  } as any);
  //定义表格列
  const columns: BasicColumn[] = [
    {
      title: '序号',
      width: 50,
      align: 'center',
      customRender: ({ index }) => index + 1, // 从1开始
    },
    {
      title: '功能名称',
      dataIndex: 'modelName',
      width: 130,
    },
    {
      title: '数据值',
      dataIndex: 'value',
      width: 130,
      slots: { customRender: 'value' },
    },
    {
      title: '更新时间',
      dataIndex: 'time',
      width: 140,
    },
  ];
  //定义表格列
  const setcolumns: BasicColumn[] = [
    // {
    //   title: '序号',
    //   width: 50,
    //   align: 'center',
    //   customRender: ({ index }) => index + 1, // 从1开始
    // },
    {
      title: '功能名称',
      dataIndex: 'modelName',
      width: 130,
    },
    {
      title: '指令',
      dataIndex: 'value',
      width: 130,
    },
    {
      title: '输入参数',
      dataIndex: 'value',
      width: 130,
    },
    {
      title: '输出参数',
      dataIndex: 'value',
      width: 130,
    },
    {
      title: '更新时间',
      dataIndex: 'time',
      width: 140,
    },
  ];
  // 列表页面公共参数、方法
  const { tableContext } = useListPage({
    designScope: 'basic-table-demo-ajax',
    tableProps: {
      title: '',
      api: getHistorylist,
      columns: columns,
      showActionColumn: false, //隐藏操作列
      scroll: { y: 260 },
      actionColumn: {
        width: 120,
      },
      beforeFetch: (params) => {
        return Object.assign(params, queryParam.value);
      },
    },
  });
  //BasicTable绑定注册
  const [registerTable] = tableContext;
  // 使用 useListPage 获取订单列表
  const renderedImage = computed(() => {
    if (detailData.value.imageUrl) {
      return render.renderImage({ text: detailData.value.imageUrl });
    }
    return null;
  });
  // console.log(orderList);
  onMounted(() => {
    getDetail();
    fieldList();
    serviceList();
  });
  const fieldList = async () => {
    const parent = {
      ...searchForm.value,
      id: deviceId,
    };
    const data = await getFieldlist(parent);
    fieldModels.value = data;
  };
  const serviceList = async () => {
    const parent = {
      ...searchServiceForm.value,
      id: deviceId,
    };
    const data = await getServicelist(parent);
    serviceModels.value = data;
  };
  // 下一页
  const handlePage = (type, val) => {
    if (type === 'field') {
      searchForm.value.pageNo = val;
      fieldList();
    } else {
      searchServiceForm.value.pageNo = val;
      serviceList();
    }
  };
  // 获取详情
  async function getDetail() {
    detailData.value = await detail({ id: deviceId });
  }
  // 搜索
  // 打开历史弹层
  const showHistoryModal = (index, val) => {
    console.log(index, val);
    fielActive.value = index;
    queryParam.value = {
      ...queryParam.value,
      id: detailData.value.id,
      modelCode: val.modelCode,
    };
    open.value = true;
  };
  const handleContro = () => {
    setopen.value = true;
    console.log(setopen.value);
  };
  // 搜索
  const handleFieldSearch = () => {
    searchForm.value = {
      ...searchForm.value,
    };
    fieldList();
  };
  // 设备控制搜索
  const handleServiceSearch = () => {
    searchForm.value = {
      ...searchForm.value,
    };
    serviceList();
  };
  // 重置
  const handleReset = (type) => {
    console.log(type);
    if (type === 'field') {
      searchForm.value.name = '';
      searchForm.value.pageNo = 1;
      fieldList();
    } else {
      searchServiceForm.value.name = '';
      searchServiceForm.value.pageNo = 1;
      serviceList();
    }
  };
  const handleFocus = (val, item) => {
    if (item.argType === 'int') {
      item.controlValue = Number(val.target.value) | 0;
    } else if (item.argType === 'double') {
      item.controlValue = Number(val.target.value).toFixed(2);
    }
  };
  let ctrlParams = ref({});
  const handleSend = async (val) => {
    console.log(val.controlValue);
    if (val.controlValue === undefined && val.needExtraArg === 1) {
      createMessage.error('参数不能为空');
      return false;
    } else {
      ctrlParams.value = {
        deviceId: detailData.value.id,
        modelCode: val.modelCode,
        args: val.controlValue,
      };
      if (val.argType === 'int') {
        precisionVal.value = 0;
      } else if (val.argType === 'double') {
        precisionVal.value = 2;
      } else {
        const reg = /^\S*$/;
        if (!reg.test(controlValue.value)) {
          createMessage.error('支持中英文、数字、短划线、下划线、@、英文句号、英文冒号');
          return false;
        }
      }
      const data = await setCtrl(ctrlParams.value);
      getDetail();
      val.controlValue = null;
    }
  };
  // 返回
  function handleBack() {
    router.replace({
      path: '/iot/device/WmsIotDeviceList',
    });
  }
</script>
<style lang="less" scoped>
  .deviceDetailBox {
    padding: 10px;
    :deep(.ant-card-body) {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      position: relative;
      // padding-right: 110px;
      .info-item {
        display: flex;
        width: 50%;
        h1 {
          width: 84px;
        }

        & > span {
          width: 80%;
        }
      }
    }
  }
  .deviceData {
    display: flex;
    margin-top: 10px;
    .dataBox {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .item {
        width: calc(50%);
        padding: 10px 10px 20px;
        margin-bottom: 20px;
        box-shadow: 1px 1px 5px 1px #f1f1f1;
        position: relative;
        &:nth-child(odd) {
          margin-right: 20px;

          width: calc(50% - 20px);
        }
        .time {
          position: absolute;
          left: 10px;
          bottom: 10px;
        }
      }
    }
    .ant-card {
      flex: 1;
      &:first-child {
        margin-right: 10px;
      }
    }
    .temperature {
      display: flex;
      width: 100%;
      .anticon {
        margin-left: 5px;
      }
      div {
        &:first-child {
          flex: 1;
        }
      }
      .tit {
        text-align: center;
        font-weight: 700;
        padding-top: 30px;
        cursor: pointer;
      }
    }
  }
  .dataText {
    color: #2740ff;
    cursor: pointer;
  }
  .controlInput {
    position: relative;
    .ant-input {
      padding-right: 60px;
    }
    .text {
      position: absolute;
      right: 10px;
      top: 5px;
      cursor: pointer;
      color: #2740ff;
    }
    :deep(.ant-input-number) {
      width: 100%;
    }
  }
  .controlTie {
    display: flex;
    span {
      &:last-child {
        flex: 1;
        text-align: right;
        font-weight: normal;
      }
    }
  }
  .search {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
    .ant-input {
      min-width: 100px;
      max-width: 300px;
    }
    .ant-btn {
      width: 100px;
      margin-left: 10px;
    }
  }
  .deviceImg {
    :deep(.ant-image) {
      width: 100px !important;
      height: 100px !important;
      border-radius: 10px;
      position: absolute;
      right: 50px;
      top: 40px;
      .ant-image-img {
        width: 100px !important;
        height: 100px !important;
        border-radius: 10px;
      }
    }
  }
  .historyModel {
    :deep(.jeecg-modal-content) {
      > .scroll-container {
        // height: auto;
        // min-height: 240px;
        // max-height: 550px;
      }
    }
  }
</style>
