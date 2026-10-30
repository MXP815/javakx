<template>
  <Card title="报警排名" v-bind="$attrs" class="alertBox">
    <template #extra>
      <span>近7日数据</span>
    </template>
    <div class="alertList" v-if="alertRanks && alertRanks.length > 0 && alertRanks !== undefined">
      <div class="head"><span>排名</span><span>设备名称</span><span>报警次数</span><span>环比</span></div>
      <div class="item" v-for="(item, index) in alertRanks" :key="index">
        <span
          ><span class="numBg" :class="item.rankNo <= 3 ? 'top' : ''">{{ item.rankNo }}</span></span
        >
        <span>{{ item.deviceName }}</span>
        <span>{{ item.alertCount }}</span>
        <span :class="item.prevDiff < 0 ? 'colGreen' : 'colRed'"
          ><span class="icon"><ArrowUpOutlined v-if="item.prevDiff > 0" /><ArrowDownOutlined v-else /></span>{{ item.prevDiff }}</span
        >
      </div>
    </div>
    <div class="noData" v-else>暂无数据</div>
  </Card>
</template>
<script lang="ts" setup>
  import { Card } from 'ant-design-vue';
  import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';
  const props = defineProps({
    loading: Boolean,
    alertRanks: {
      type: Array as any,
    },
  });
</script>
<style lang="less">
  .alertList {
    .head {
      color: #999;
      border-bottom: 1px solid #eaeaea;
      height: 40px;
      line-height: 40px;
    }
    .head,
    .item {
      span {
        display: inline-block;
        &:nth-child(1) {
          width: 20%;
        }
        &:nth-child(2) {
          width: 39%;
        }
        &:nth-child(3) {
          width: 25%;
          text-align: center;
        }
        &:nth-child(4) {
          width: 16%;
        }
      }
    }
    .item {
      line-height: 40px;
      display: flex;
      align-items: center;
      padding: 14.8px 0;
      border-bottom: 1px solid #efefef;
      span {
        .numBg {
          width: 24px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          background: #bcc4d0;
          border-radius: 12px;
          color: #fff;
        }

        &.top {
          background: #0153d9;
        }
        &:nth-child(2) {
          overflow: hidden; /* 溢出隐藏 */
          white-space: nowrap; /* 禁止换行 */
          text-overflow: ellipsis; /* 显示省略号 */
        }
      }
      .icon {
        margin-right: 5px;
      }
    }
  }
  .alertBox {
    .ant-card-body {
      height: 440px !important;
    }
  }
</style>
