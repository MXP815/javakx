<template>
  <div class="dishboardHead">
    <!-- <Card title=""> -->
    <div class="lg:flex">
      <div class="flex flex-1 md:mt-0 mt-4" v-if="counterInfo">
        <div class="flex flex-col md:w-1/4 justify-center text-center !mr-4 productNum">
          <span class="iconBg">
            <ProjectOutlined />
          </span>

          <span class="text-secondary">产品数量</span>
          <span class="text-2xl">{{ counterInfo.productCount }}<span>个</span></span>
        </div>

        <div class="flex flex-col md:w-1/4 justify-center text-center !mr-4 deviceNum">
          <span class="iconBg"><ShakeOutlined /></span>
          <span class="text-secondary">设备数量</span>
          <span class="text-2xl">{{ counterInfo.deviceCount }}<span>台</span></span>
        </div>
        <div class="flex flex-col md:w-1/4 justify-center text-center !mr-4 alertNum">
          <span class="iconBg"><ReconciliationOutlined /></span>
          <span class="text-secondary">当前报警设备</span>
          <span class="text-2xl">{{ counterInfo.alertDeviceCount }}<span>台</span></span>
        </div>
        <div class="flex flex-col md:w-1/4 justify-center text-center !mr-4 currentNum">
          <span class="iconBg"><ProfileOutlined /></span>
          <span class="text-secondary">当前报警信息</span>
          <span class="text-2xl">{{ counterInfo.currentAlertCount }}<span>条</span></span>
        </div>
        <div class="flex flex-col md:w-1/4 justify-center text-center daysNum">
          <span class="iconBg"><ExceptionOutlined /></span>
          <span class="text-secondary">近7日报警信息</span>
          <span class="text-2xl">{{ counterInfo.last7DaysAlertCount }}<span>条</span></span>
        </div>
      </div>
    </div>
    <!-- </Card> -->
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { ProjectOutlined, ShakeOutlined, ProfileOutlined, ReconciliationOutlined, ExceptionOutlined } from '@ant-design/icons-vue';
  import { Card } from 'ant-design-vue';
  defineProps({
    counterInfo: {
      type: Object,
      default: () => {},
    },
  });
</script>
