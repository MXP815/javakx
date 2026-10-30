<template>
  <Card title="设备报警" :loading="loading" class="deviceAlertInfo" v-if="deviceAlertInfo">
    <!-- <div class="head">
      <div class="item">
        <p>
          <a-progress type="circle" :percent="deviceAlertInfo.emerRatio" trailColor="#f5bec5" strokeColor="#d8031c" :size="80">
            <template #format="percent">
              <p>紧急</p>
              <span>{{ deviceAlertInfo.emerCount }}</span>
            </template>
          </a-progress>
        </p>
        <p class="info"
          ><span class="tag tagRmer"></span>紧急<span>{{ deviceAlertInfo.emerRatio.toFixed(2) }}%</span></p
        >
      </div>
      <div class="item">
        <p>
          <a-progress type="circle" :percent="deviceAlertInfo.generalRatio" trailColor="#fce6c8" strokeColor="#f59924" :size="80">
            <template #format="percent">
              <p>一般</p>
              <span>{{ deviceAlertInfo.generalCount }}</span>
            </template>
          </a-progress>
        </p>
        <p class="info"
          ><span class="tag tagGeneral"></span>一般<span>{{ deviceAlertInfo.generalRatio.toFixed(2) }}%</span></p
        >
      </div>
      <div class="item">
        <p>
          <a-progress type="circle" :percent="deviceAlertInfo.warnRatio" trailColor="#c0c0ff" strokeColor="#0052d9" :size="80">
            <template #format="percent">
              <p>警告</p>
              <span>{{ deviceAlertInfo.warnCount.toFixed(2) }}</span>
            </template>
          </a-progress>
        </p>
        <p class="info"
          ><span class="tag tagWarn"></span>警告<span>{{ deviceAlertInfo.warnRatio.toFixed(2) }}%</span></p
        >
      </div>
    </div> -->
    <div class="alertInfoList">
      <div class="head"><span>报警规则名称</span><span>关联设备</span><span>报警时间</span></div>
      <div class="scroll-container" v-if="duplicatedList.length > 0">
        <div class="scroll-content">
          <div class="item" v-for="(item, index) in duplicatedList" :key="index" @click="handleRow(item)">
            <span class="icon">
              <span class="emer" v-if="item.alertLevel === 'CRIT'"></span>
              <span class="general" v-else-if="item.alertLevel === 'GENERAL'"></span>
              <span class="warn" v-else></span>
            </span>
            <span>{{ item.ruleName }}</span>
            <span>{{ item.deviceName }}</span>
            <span>{{ dateTime(item.alertTime) }}</span>
          </div>
        </div>
      </div>
      <div class="noData" v-else>暂无数据</div>
    </div>
  </Card>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
  import { Card } from 'ant-design-vue';
  import { dateTime } from '/@/utils/validate';
  import { router } from '/@/router';
  const props = defineProps({
    loading: Boolean,
    deviceAlertInfo: {
      type: Object as any,
    },
  });
  const scrollContainer = ref(null as any);
  const scrollInterval = ref(null as any);
  const originalHeight = ref(0);
  // 复制一份列表数据以实现无缝滚动
  const duplicatedList = computed(() => {
    const logs = props.deviceAlertInfo?.alertLogs ?? [];
    return [...logs, ...logs];
  });

  const startScroll = () => {
    scrollInterval.value = setInterval(() => {
      if (!scrollContainer.value) return;

      const container = scrollContainer.value;
      container.scrollTop += 1;

      // 滚动到原始内容末尾时重置到顶部
      if (container.scrollTop >= originalHeight.value) {
        container.scrollTop = 0;
      }
    }, 30);
  };

  const pauseScroll = () => {
    if (scrollInterval.value) {
      clearInterval(scrollInterval.value);
      scrollInterval.value = null;
    }
  };

  const resumeScroll = () => {
    if (!scrollInterval.value) {
      startScroll();
    }
  };

  const handleRow = (record) => {
    console.log(record);
    router.replace({
      path: '/iot/logModel/WmsIotAlertLogList',
      query: {
        id: record.id,
      },
    });
  };
  onMounted(async () => {
    // await nextTick(); // 等待DOM更新
    setTimeout(() => {
      console.log(scrollContainer.value);
      if (scrollContainer.value) {
        // 计算原始内容高度（总高度的一半）
        originalHeight.value = scrollContainer.value.scrollHeight / 2;
        startScroll();
      }
    }, 1000);
  });

  onUnmounted(() => {
    pauseScroll();
  });
</script>
<style lang="less">
  .deviceAlertInfo {
    .head {
      display: flex;
      margin-bottom: 20px;
      .item {
        width: 33.33%;
        text-align: center;
        p {
          margin: 0;
          .text {
            font-size: 32px;
          }
          &.info {
            display: flex;
            align-items: center;
            padding-top: 10px;
            justify-content: center;
          }
        }
        .tag {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          margin-right: 5px;
        }
        .tagRmer {
          background: #d8031c;
        }
        .tagGeneral {
          background: #f59924;
        }
        .tagWarn {
          background: #0052d9;
        }
      }
    }
    .ant-progress-text {
      font-size: 16px;
      p {
        padding-bottom: 5px;
        &:first-child {
          font-size: 12px;
          font-weight: 700;
        }
      }
    }
    .ant-card-body {
      max-height: 440px !important;
    }
  }
  .alertInfoList {
    // height: 260px;
    // overflow-y: scroll;
    .head {
      color: #999;
      border-bottom: 1px solid #eaeaea;
      height: 40px;
      line-height: 40px;
      margin-bottom: 0;
      padding-left: 8px;
    }
    .head {
      & > span {
        display: inline-block;
        &:nth-child(1) {
          width: 40%;
        }
        &:nth-child(2) {
          width: 30%;
        }
        &:nth-child(3) {
          width: 30%;
          // text-align: center;
        }
      }
    }
    .item {
      line-height: 30px;
      display: flex;
      align-items: center;
      padding: 8px 0 8px 15px;
      border-bottom: 1px solid #efefef;
      cursor: pointer;
      position: relative;
      span {
        display: inline-block;
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
          width: 40%;
        }
        &:nth-child(3) {
          width: 30%;
        }
        &:nth-child(4) {
          width: 30%;
          // text-align: center;
        }
        &:nth-child(2),
        &:nth-child(3) {
          overflow: hidden; /* 溢出隐藏 */
          white-space: nowrap; /* 禁止换行 */
          text-overflow: ellipsis; /* 显示省略号 */
        }
        &.icon {
          position: absolute;
          left: 0;
          top: 5px;
          span {
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
          }
        }
        .emer {
          background: #d8031c;
        }
        .general {
          background: #0052d9;
        }
        .warn {
          background: #f59924;
        }
      }
    }
  }
  .scroll-container {
    height: 360px; /* 容器固定高度 */
    overflow: hidden; /* 隐藏溢出内容 */
    position: relative;
  }
  .scroll-content {
    /* 内容自动高度 */
    position: absolute;
    width: 100%;
  }
</style>
