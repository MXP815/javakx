<template>
  <PageWrapper>
    <div class="lg:flex">
      <div class="lg:w-7/10 w-full !mr-4 enter-y">
        <WorkbenchHeader :counterInfo="dashboardData.counterInfo" />
        <div class="md:flex enter-y mt-4 echartsHeight">
          <div class="md:w-1/2 w-full !mr-4"> <ProductCard :loading="loading" :productRatios="dashboardData.productRatios" class="enter-y" /></div>
          <div class="md:w-1/2 w-full"> <ProjectCard :loading="loading" :deviceAlertInfo="dashboardData.deviceAlertInfo" class="enter-y" /></div>
        </div>
      </div>
      <div class="lg:w-3/10 w-full enter-y">
        <User :loading="loading" class="enter-y" :deviceDistribution="dashboardData.deviceDistribution" @get-data="getData" />
        <QuickNav :loading="loading" class="enter-y mt-4" />
      </div>
    </div>
    <div class="lg:flex listData">
      <div class="lg:w-3/10 w-full !mr-4 enter-y">
        <DynamicInfo :loading="loading" class="!my-4 enter-y" :alertRanks="dashboardData.alertRanks" />
      </div>
      <div class="lg:w-4/10 w-full !mr-4 enter-y">
        <DeviceDistribution :loading="loading" class="!my-4 enter-y" :deviceDistribution="dashboardData.deviceDistribution" />
      </div>
      <div class="lg:w-3/10 w-full enter-y !my-4">
        <SaleRadar :loading="loading" class="enter-y" :deviceAlertInfo="dashboardData.deviceAlertInfo" />
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { Card } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import ProjectCard from './components/ProjectCard.vue';
  import ProductCard from './components/ProductCard.vue';
  import QuickNav from './components/QuickNav.vue';
  import User from './components/User.vue';
  import DynamicInfo from './components/DynamicInfo.vue';
  import DeviceDistribution from './components/DeviceDistribution.vue';
  import SaleRadar from './components/SaleRadar.vue';
  import { dashboard } from './api.ts';
  const dashboardData = ref({} as any);
  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 500);
  onMounted(() => {
    getData(null);
  });
  // 获取工作台数据
  const getData = async (val) => {
    console.log(val);
    const warehouseCodes = val ? { warehouseCodes: val } : undefined;
    const data = await dashboard(warehouseCodes);
    dashboardData.value = data;
    // console.log(dashboardData.value.productRatios);
  };
</script>
<style lang="less">
  .dishboardHead {
    .anticon {
      display: inline-block;
      font-size: 24px;
      font-weight: normal;
    }
    .justify-center {
      align-items: center;
    }
    .flex-col {
      border-radius: 10px;
      padding: 20px 0;
      color: #fff;
    }
    .iconBg {
      display: inline-block;
      background: rgba(#fff, 0.8);
      width: 56px;
      height: 56px;
      border-radius: 28px;
      color: #0153d9;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .text-secondary {
      color: #fff !important;
      padding: 8px 0;
    }
    .text-2xl {
      font-size: 32px;
      span {
        font-size: 14px;
        padding-left: 10px;
      }
    }
    .productNum {
      background: linear-gradient(#7fd1f9, #0153d9);
    }
    .deviceNum {
      background: linear-gradient(#bd83f7, #8705ff);
    }
    .alertNum {
      background: linear-gradient(#8cd487, #00a140);
    }
    .currentNum {
      background: linear-gradient(#e49d9a, #bf4242);
    }
    .daysNum {
      background: linear-gradient(#e6bc5c, #e38a22);
    }
  }
  .echartsHeight,
  .listData {
    .noData {
      min-height: 330px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .exportText {
    cursor: pointer;
    color: #0096c7;
  }
</style>
