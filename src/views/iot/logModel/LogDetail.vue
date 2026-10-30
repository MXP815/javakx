<template>
  <div class="deviceDetailBox" v-if="detailData.id !== ''">
    <a-card title="报警信息">
      <div class="info-item">
        <h1>报警规则名称：</h1>
        <span>{{ detailData.ruleName }}</span>
      </div>
      <div class="info-item">
        <h1>报警级别：</h1>
        <span v-if="detailData.alertLevel === 'CRIT'" class="colRed">紧急</span>
        <span v-if="detailData.alertLevel === 'WARN'" class="colWran">警告</span>
        <span v-if="detailData.alertLevel === 'GENERAL'" class="colBlur">一般</span>
      </div>
      <div class="info-item">
        <h1>报警规则：</h1>
        <span>{{ detailData.deviceName }}</span>
      </div>
      <div class="info-item">
        <h1>报警时间：</h1>
        <span>{{ detailData.alertTime }}</span>
      </div>
      <div class="info-item">
        <h1>所属产品：</h1>
        <span>{{ detailData.productName }}</span>
      </div>
      <div class="info-item">
        <h1>关联设备：</h1>
        <span>{{ detailData.deviceName }}</span>
      </div>
      <div class="info-item">
        <h1>异常数据：</h1>
        <span>{{ detailData.alertData }}</span>
      </div>
      <div class="info-item">
        <h1>所属仓库：</h1>
        <span>{{ detailData.warehouseName }}</span>
      </div>
      <div class="info-item">
        <h1>通知方式：</h1>
        <div class="text">
          <div v-if="notifyTags.length > 0"
            ><label>短信：</label><span v-for="(item, index) in notifyTags" :key="index">{{ item }}、</span></div
          >
          <div v-if="emailTags.length > 0"
            ><label>邮箱：</label><span v-for="(item, index) in emailTags" :key="index">{{ item }}、</span></div
          >
          <span v-if="notifyTags.length === 0 && emailTags.length === 0">--</span>
        </div>
      </div>
    </a-card>
    <a-card title="处理结果">
      <div class="info-item">
        <h1>处理进度：</h1>
        <span v-if="detailData.processStatus === '0'" class="colWran">待处理</span>
        <span v-if="detailData.processStatus === '1'" class="colGreen">已解决</span>
        <span v-if="detailData.processStatus === '2'" class="colGray">不予解决</span>
      </div>
      <div class="info-item">
        <h1>处理时间：</h1>
        <span>{{ detailData.processTime ? detailData.processTime : '--' }}</span>
      </div>
      <div class="info-item" v-if="detailData.processStatus !== '2'">
        <h1>处理方案：</h1>
        <span>{{ detailData.processPlan ? detailData.processPlan : '--' }}</span>
      </div>
      <div class="info-item">
        <h1>备注：</h1>
        <span>{{ detailData.remark ? detailData.remark : '--' }}</span>
      </div>
    </a-card>
    <div class="footBox">
      <a-button style="margin-left: 10px" @click="handleBack">返回</a-button>
    </div>
  </div>
</template>
<script lang="ts" name="manage-wmsIotDeviceDetail" setup>
  import { ref, onMounted } from 'vue';
  import { getDetails } from './WmsIotAlertLog.api';
  import { router } from '/@/router';
  let detailData = ref({} as any);
  const notifyTags = ref([]);
  const emailTags = ref([]);
  const params = new URLSearchParams(window.location.search);

  let deviceId = params.get('id');
  onMounted(() => {
    getDetail();
  });

  // 获取详情
  async function getDetail() {
    detailData.value = await getDetails({ id: deviceId });
    console.log(detailData.value);
    const objs = JSON.parse(detailData.value.notifyInfo);
    if (objs.noti) {
      notifyTags.value = objs.noti;
    }
    if (objs.email) {
      emailTags.value = objs.email;
    }
  }
  // 返回
  function handleBack() {
    router.replace({
      path: '/iot/logModel/WmsIotAlertLogList',
    });
  }
</script>
<style lang="less" scoped>
  .deviceDetailBox {
    padding: 10px;
    :deep(.ant-card) {
      margin-bottom: 10px;
      &:last-child {
        margin: 0;
      }
    }
    :deep(.ant-card-body) {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .info-item {
        display: flex;
        width: 50%;
        &:last-child {
          width: 100%;
        }
        h1 {
          width: 100px;
        }

        & > span,
        .text {
          width: 80%;
        }
      }
    }
  }
</style>
