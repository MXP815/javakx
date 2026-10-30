<template>
  <div ref="chartDom" :style="{ width: width, height: height }"></div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import * as echarts from 'echarts';

  const props = defineProps({
    // 图表配置
    option: {
      type: Object,
      required: true,
    },
    // 容器宽度
    width: {
      type: String,
      default: '100%',
    },
    // 容器高度
    height: {
      type: String,
      default: '400px',
    },
  });

  const chartDom = ref(null);
  let chartInstance = null;

  // 初始化图表
  const initChart = () => {
    if (chartDom.value) {
      chartInstance = echarts.init(chartDom.value);
      chartInstance.setOption(props.option);
    }
  };

  // 响应窗口变化自动调整
  const resizeChart = () => {
    chartInstance?.resize();
  };

  // 监听配置变化
watch(
  () => props.option,
  (newVal) => {
    // 只更新数据部分，保持其他配置和状态
    if (newVal.series) {
      chartInstance?.setOption({
        series: newVal.series
      }, {
        notMerge: false
      });
    }
  },
  { deep: true }
);

  onMounted(() => {
    initChart();
    window.addEventListener('resize', resizeChart);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart);
    chartInstance?.dispose();
  });
</script>
