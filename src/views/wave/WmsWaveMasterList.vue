<template>
  <PageWrapper>
    <a-card :bordered="false">
      <!--创建波次、拣货中、待打包、打包中、待配送、已配送、已完成、已取消-->
      <a-tabs defaultActiveKey="0">
        <a-tab-pane tab="全部" key="0">
          <WmsWaveMasterAll></WmsWaveMasterAll>
        </a-tab-pane>
        <a-tab-pane tab="创建波次" key="1">
          <WmsWaveMasterCreate></WmsWaveMasterCreate>
        </a-tab-pane>
        <a-tab-pane tab="拣货中" key="2">
          <WmsWaveMasterPicking></WmsWaveMasterPicking>
        </a-tab-pane>
        <a-tab-pane tab="待打包" key="3">
          <WmsWaveMasterPicked></WmsWaveMasterPicked>
        </a-tab-pane>
        <a-tab-pane tab="待配送" key="5">
          <WmsWaveMasterPacked></WmsWaveMasterPacked>
        </a-tab-pane>
        <a-tab-pane tab="已配送" key="6">
          <WmsWaveMasterShipped></WmsWaveMasterShipped>
        </a-tab-pane>
        <a-tab-pane tab="已完成" key="7">
          <WmsWaveMasterCompleted></WmsWaveMasterCompleted>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </PageWrapper>
</template>

<script lang="ts" setup>
// noinspection ES6UnusedImports
import { PageWrapper } from '/@/components/Page';
import WmsWaveMasterAll from './WmsWaveMasterAll.vue';
import WmsWaveMasterCreate from './WmsWaveMasterCreate.vue';
import WmsWaveMasterPicking from './WmsWaveMasterPicking.vue';
import WmsWaveMasterPicked from './WmsWaveMasterPicked.vue';
import WmsWaveMasterPacked from './WmsWaveMasterPacked.vue';
import WmsWaveMasterShipped from './WmsWaveMasterShipped.vue';
import WmsWaveMasterCompleted from './WmsWaveMasterCompleted.vue';
</script>



