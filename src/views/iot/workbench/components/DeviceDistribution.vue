<template>
  <Card title="设备分布" v-bind="$attrs" v-if="deviceDistribution" class="deviceDistribution">
    <div class="head">
      <div class="item">
        <p
          ><span class="text">{{ deviceDistribution.productCount ? deviceDistribution.productCount : 0 }}</span
          >个</p
        >
        <p>产品数量</p>
      </div>
      <div class="item">
        <p
          ><span class="text">{{ deviceDistribution.deviceCount ? deviceDistribution.deviceCount : 0 }}</span
          >台</p
        >
        <p>设备数量</p>
      </div>
      <div class="item">
        <p
          ><span class="text">{{ deviceDistribution.alertCount ? deviceDistribution.alertCount : 0 }}</span
          >条</p
        >
        <p>报警信息</p>
      </div>
    </div>
    <div class="deviceList" v-if="deviceDistribution.productDevicesList.length > 0">
      <a-collapse v-model:activeKey="activeKey" :bordered="false">
        <a-collapse-panel :key="index" v-for="(item, index) in deviceDistribution.productDevicesList" :header="item.productName">
          <a-table :dataSource="item.devices" :columns="columns" :pagination="false" v-if="item.devices.length > 0">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'statusName'">
                <span class="colWran" v-if="record.statusName === '未激活'">未激活</span>
                <span class="colGray" v-if="record.statusName === '离线'">离线</span>
                <span class="colGreen" v-if="record.statusName === '在线'">在线</span>
                <span class="colRed" v-if="record.statusName === '禁用'">禁用</span>
              </template>
              <template v-if="column.key === 'alertStatus'">
                <span class="colRed" v-if="record.alertStatus === '报警中'">报警中</span>
                <span class="colGreen" v-if="record.alertStatus === '正常'">正常</span>
              </template>
            </template>
          </a-table>
          <div class="noData" v-else>暂无数据</div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="noData" v-else>暂无数据</div>
  </Card>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Card } from 'ant-design-vue';
  defineProps({
    loading: Boolean,
    deviceDistribution: {
      type: Array as any,
    },
  });
  const activeKey = ref(['0']);
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备状态',
      dataIndex: 'statusName',
      key: 'statusName',
    },
    {
      title: '报警状态',
      dataIndex: 'alertStatus',
      key: 'alertStatus',
    },
  ];
</script>
<style lang="less">
  .deviceDistribution {
    .head {
      display: flex;
      margin-bottom: 30px;
      .item {
        width: 33.33%;
        text-align: center;
        p {
          margin: 0;
          .text {
            font-size: 32px;
          }
        }
      }
    }
    .ant-collapse-borderless {
      background: none !important;
      .ant-collapse-header {
        background: rgba(51, 51, 51, 0.02) !important;
      }
    }
    .ant-collapse-borderless > .ant-collapse-item > .ant-collapse-content {
      background-color: #fff;
    }
    .ant-collapse-borderless > .ant-collapse-item {
      border-bottom: 0 none;
      margin-bottom: 10px;
    }
    .deviceList {
      height: 290px;
      overflow-y: scroll;
    }
    .ant-card-body {
      max-height: 440px !important;
    }
  }
</style>
