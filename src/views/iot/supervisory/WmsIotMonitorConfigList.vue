<template>
  <div class="p-2 supevisoryBox">
    <!--查询区域-->
    <div class="jeecg-basic-table-form-container">
      <a-form ref="formRef" @keyup.enter.native="searchQuery" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="24">
          <a-col :lg="8">
            <a-form-item name="deviceCode">
              <template #label><span title="设备名称">设备名称</span></template>
              <a-select v-model:value="queryParam.deviceName" placeholder="请选择" :options="deviceData" allowClear @change="handleDeviceChange" />
            </a-form-item>
          </a-col>
          <a-col :lg="8">
            <a-form-item name="modelCode">
              <template #label><span title="功能名称">功能名称</span></template>
              <a-select v-model:value="queryParam.modelName" placeholder="请选择" :options="objectModelData" @change="handleModelChange" allowClear />
            </a-form-item>
          </a-col>
          <a-col :lg="6">
            <a-form-item name="alertLevel">
              <template #label><span title="所属仓库">所属仓库</span></template>
              <a-select
                mode="single"
                style="width: 180px"
                placeholder="请选择所属仓库"
                :field-names="{ label: 'warehouseName', value: 'id' }"
                :options="warehouseList"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-col :lg="6">
                <a-button type="primary" preIcon="ant-design:search-outlined" @click="searchQuery">查询</a-button>
                <a-button preIcon="ant-design:reload-outlined" @click="searchReset" style="margin-left: 8px">重置</a-button>
              </a-col>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--引用表格-->
    <a-card class="cardH">
      <a-button type="primary" v-auth="'manage:wms_iot_monitor_config:add'" @click="handleAdd" preIcon="ant-design:plus-outlined"> 添加监控</a-button>
      <div class="monitorBox" v-if="monitorData.records && monitorData.records.length > 0">
        <div class="item" v-for="(item, index) in monitorData.records" :key="index">
          <div class="tit"
            ><div class="text">{{ item.deviceName }}-{{ item.modelName }}</div
            ><div class="textR"
              ><a-popconfirm :title="`请确认是否删除${item.modelName}，该操作无法撤销`" @confirm="handleDelete(item, !item.modelName)">
                <span>删除 </span></a-popconfirm
              ><span @click="handleEdit(item)">编辑</span></div
            ></div
          >
          <div class="echartBox">
            <!-- 循环生成多个图表 -->
            <div v-if="item.points.length > 0">
              <EchartsLine :option="generateOption(item)" width="100%" height="300px" />
            </div>
            <div v-else class="noEchartData">暂无数据</div>
          </div>
        </div>
      </div>
      <div v-else class="noEchartData">暂无数据</div>
      <div class="pageBox">
        <Pagination
          size="small"
          v-if="monitorData.total > 10"
          :total="monitorData.total"
          v-model:current="queryParam.pageNo"
          :pageSize="queryParam.pageSize"
          @change="handlePage"
          show-size-changer
          show-quick-jumper
        />
      </div>
    </a-card>

    <!-- 表单区域 -->
    <WmsIotMonitorConfigModal ref="registerModal" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="manage-wmsIotMonitorConfig" setup>
  import { ref, reactive, onMounted, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { columns, superQuerySchema } from './WmsIotMonitorConfig.data';
  import { list, deleteOne, batchDelete, getImportUrl, getExportUrl } from './WmsIotMonitorConfig.api';
  import { downloadFile } from '/@/utils/common/renderUtils';
  import { devicelist } from '../device/WmsIotDevice.api';
  import { modellist } from '../objectModel/WmsIotProductModel.api';
  import WmsIotMonitorConfigModal from './components/WmsIotMonitorConfigModal.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useGlobSetting } from '/@/hooks/setting';
  import { Pagination } from 'ant-design-vue';
  import { connectWebSocket, onWebSocket } from '/@/hooks/web/useWebSocket';
  import { getToken } from '/@/utils/auth';
  import md5 from 'crypto-js/md5';
  import { getUserDeparts } from '/@/views/system/depart/depart.api';
  import EchartsLine from './components/EchartsLine.vue';
  import {list as getWarehouseList} from "@/views/warehouse/WmsWarehouses.api";
  const formRef = ref();
  // const glob = useGlobSetting();
  const queryParam = reactive<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const registerModal = ref();
  const userStore = useUserStore();
  const deviceData = ref([]);
  const objectModelData = ref([]);
  const monitorData = ref({} as any);
  const filteredOptions = ref([]);
  const departList = ref([]);
  const warehouseList = ref([]);
  const labelCol = reactive({
    xs: 24,
    sm: 4,
    xl: 6,
    xxl: 4,
  });
  const wrapperCol = reactive({
    xs: 24,
    sm: 20,
  });
  onMounted(() => {
    getList();
    getMonitorList();
    loadWarehouseList();
     initWebSocket();
  });
  // const formData = ref({} as any);
  // 触发设备
  function handleDeviceChange(value, option) {
    queryParam.deviceCode = option.deviceCode;
    queryParam.deviceName = option.deviceName;
  }
  // 触发功能
  function handleModelChange(value, option) {
    queryParam.modelCode = option.code;
    queryParam.modelName = option.modelName;
  }
  // 获取监控列表
  const getMonitorList = async () => {
    const param = {
      ...queryParam,
      warehouseCodes: filteredOptions.value ? filteredOptions.value.join(',') : undefined,
    };
    const data = await list(param);
    console.log('data', data);
    // 初始化每个监控点的 points 数组（WebSocket 推送前是空的）
    if (data.records) {
      data.records.forEach((item) => {
        if (!item.points) {
          item.points = [];
        }
      });
    }
    monitorData.value = data;
  };
  //获取设备和功能列表
  const getList = async () => {
    const params = {
      pageSize: 10000,
    };

    const data = await devicelist(params);
    const renamedUsers = data.records.map((val) => ({
      ...val,
      label: val.deviceName,
      value: val.deviceCode,
    }));

    deviceData.value = renamedUsers;
    const dataModel = await modellist(params);
    const renamedModel = dataModel.records.map((val) => ({
      ...val,
      label: val.modelName,
      value: val.id,
    }));
    objectModelData.value = renamedModel;
  };

  /**
   * 新增事件
   */
  function handleAdd() {
    registerModal.value.disableSubmit = false;
    registerModal.value.add();
  }

  /**
   * 编辑事件
   */
  function handleEdit(record: Recordable) {
    registerModal.value.disableSubmit = false;
    registerModal.value.edit(record);
  }

  /**
   * 删除事件
   */
  async function handleDelete(record) {
    await deleteOne({ id: record.id }, handleSuccess);
  }

  /**
   * 成功回调
   */
  function handleSuccess() {
    getMonitorList();
  }

  /**
   * 查询
   */
  function searchQuery() {
    getMonitorList();
  }

  /**
   * 重置
   */
  function searchReset() {
    formRef.value.resetFields();
    queryParam.modelName = null;
    queryParam.modelCode = null;
    queryParam.deviceName = null;
    queryParam.deviceCode = null;
    filteredOptions.value = [];
    //刷新数据
    getMonitorList();
  }
  // 下一页
  const handlePage = (val) => {
    queryParam.pageNo = val;
    getMonitorList();
  };
  /**
   *加载仓库信息
   */
  async function loadWarehouseList() {

    const result = await getWarehouseList({});
    // console.log(result)
    if (!result.records || result.records.length == 0) {
      return;
    }
    const records = result.records.map((val) => ({
      ...val,
      label: val.warehouseName,
      value: val.id,
    }));
    warehouseList.value = records;

  }
  // let objData = ref({} as any);
  // 统一的时间格式化：兼容毫秒时间戳（WebSocket推的）和日期字符串
  function formatTime(t) {
    if (typeof t === 'number') {
      const d = new Date(t);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    } else if (typeof t === 'string') {
      return t.split(' ')[1] || t;
    }
    return '';
  }
  const generateOption = (data) => {
    const xAxisData = data.points.map((p) => ({ ...p, time: formatTime(p.time) }));
    console.log(xAxisData);
    return {
      backgroundColor: 'transparent',
      title: {
        text: '单位' + data.unit,
        left: 'left',
        textStyle: { color: '#333', fontSize: '14px', fontWeight: '300' },
      },
      grid: {
        left: '7%', // 缩小左侧空白区域
        right: '12%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        // data: times,
        connectNulls: false, // 关键配置：遇到 null 值断开连接
        axisLine: {
          spanGaps: false, // 默认为 false，保持断开
          lineStyle: { color: '#666' },
        },
        axisLabel: {
          formatter: function (value) {
            // 假设输入的值是一个标准的时间字符串
            const date = new Date(value);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
          },
        },
        // 可选：控制显示精度到秒
        minInterval: 1000, // 最小间隔为1秒
        scale: true,
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: { color: '#666' },
        },
      },
      dataZoom: [
        {
          // show: true,
          // realtime: true,
          type: 'inside',
          start: 80,  // 显示最新的20%数据
          end: 100,
          xAxisIndex: [0, 1],
          labelFormatter: function (value, index) {
            return formatTime(data.points[value].time);
          },
        },
        {
          type: 'slider',
          realtime: true,
          start: 80,// 显示最新的20%数据
          end: 100,
          xAxisIndex: 0,
          filterMode: 'weakFilter',
          labelFormatter: function (value, index) {
            return formatTime(data.points[value].time);
          },
        },
      ],
      series: [
        {
          name: '数据值：',
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {},
          // data: data.points,
          data: data.points.map((item) => [item.time, item.value]), // 转换为 [时间, 值] 格式
          lineStyle: {
            color: '#2196F3', // 折线颜色
          },
          itemStyle: {
            color: '#fff', // 数据点颜色
          },
        },
      ],
      tooltip: { trigger: 'axis' },
    };
  };
  // 初始化 WebSocket
  function initWebSocket() {
    // let token = getToken();
    // //将登录token生成一个短的标识
    // let wsClientId = md5(token);
    let userId = unref(userStore.getUserInfo).id;
    // // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
    // let url = glob.domainUrl?.replace('https://', 'wss://').replace('http://', 'ws://') + '/wms/iot/' + userId;
    // connectWebSocket(url);
    // onWebSocket(onWebSocketMessage);
    var url = window._CONFIG['domianURL'].replace('https://', 'ws://').replace('http://', 'ws://') + '/iotwebsocket/' + userId;
    const websock = new WebSocket(url);
    websock.onopen = () => {
      console.log('WebSocket连接成功');
    };
    websock.onerror = (e) => {
      console.log('WebSocket连接发生错误');
    };
    websock.onmessage = (e) => {
      var data = eval('(' + e.data + ')');
      console.log(data);
      const valArr = Object.values(data.reportDataMap);
      monitorData.value.records.forEach((ele) => {
        valArr.forEach((val) => {
          if (ele.modelCode === val.field) {
            val.modelCode = val.field;
            ele.points.push(val);
            console.log("ele.points.push")
            console.log(val)
          }
        });
      });
    };
    websock.onclose = (e) => {
      console.log('connection closed (' + e.code + ')');
    };
  }
</script>

<style lang="less" scoped>
  .jeecg-basic-table-form-container {
    padding: 0;
    .table-page-search-submitButtons {
      display: block;
      margin-bottom: 24px;
      white-space: nowrap;
    }
    .query-group-cust {
      min-width: 100px !important;
    }
    .query-group-split-cust {
      width: 30px;
      display: inline-block;
      text-align: center;
    }
    .ant-form-item:not(.ant-form-item-with-help) {
      margin-bottom: 16px;
      height: 32px;
    }
    :deep(.ant-picker),
    :deep(.ant-input-number) {
      width: 100%;
    }
  }
  .monitorBox {
    display: flex;
    padding-top: 20px;
    flex-wrap: wrap;
    margin-left: -20px;
    .item {
      width: calc(50% - 20px);
      padding: 0 0px 20px;
      box-shadow: 5px 5px 5px -3px rgba(242, 242, 242, 0.6);
      border-radius: 5px;
      margin-bottom: 20px;
      margin-left: 20px;
      .tit {
        display: flex;
        padding-bottom: 15px;
        .text {
          font-size: 16px;
          font-weight: 700;
        }
        .textR {
          flex: 1;
          text-align: right;
          span {
            margin: 0 10px;
            color: #1890ff;
            cursor: pointer;
          }
        }
      }
    }
  }
  .noEchartData {
    text-align: center;
    color: #999;
    padding: 50px 0;
    // position: absolute;
    // top: 30%;
    // left: 50%;
  }
  .supevisoryBox {
    .cardH {
      min-height: 70vh;
    }
  }
  .echartBox {
    position: relative;
  }
</style>
