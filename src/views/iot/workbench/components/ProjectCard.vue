<template>
  <Card title="报警分布">
    <div ref="chartRef" :style="{ width, height }" v-if="isShow"></div>
    <div class="noData" v-else>暂无数据</div>
  </Card>
</template>
<script lang="ts" setup>
  import { Ref, ref, watch, onMounted, nextTick } from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  // import { nextTick } from 'process';
  const props = defineProps({
    loading: Boolean,
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '330px',
    },
    deviceAlertInfo: {
      type: Array as any,
    },
    productRatios: {
      type: Array as any,
    },
  });
  let isShow = ref(true);
  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  // watch(
  //   () => props.deviceAlertInfo,
  //   () => {
  //     if (props.deviceAlertInfo && props.deviceAlertInfo.alertLogs && props.deviceAlertInfo.alertLogs.length > 0) {
  //       isShow.value = true;
  //       setOptions({
  //         legend: {
  //           top: 0,
  //           left: 'center', // 设置图例水平居中
  //           selectedMode: false,
  //         },
  //         tooltip: {
  //           trigger: 'item',
  //           formatter: function (params) {
  //             // 自定义提示框内容
  //             console.log(params.data);
  //             return `
  //                   ${params.data.name}：${params.data.value}条`;
  //           },
  //         },
  //         grid: {
  //           left: 0,
  //           right: 0,
  //           top: 1,
  //           bottom: 80,
  //         },
  //         series: [
  //           {
  //             name: '',
  //             type: 'pie',
  //             radius: '60%',
  //             center: ['50%', '55%'],
  //             color: ['#d8031c', '#0052d9', '#f59924'], // 仅对该系列生效
  //             data: [
  //               { value: 0, name: '紧急' },
  //               { value: 10, name: '一般' },
  //               { value: 5, name: '警告' },
  //             ],
  //             emphasis: {
  //               itemStyle: {
  //                 shadowBlur: 10,
  //                 shadowOffsetX: 0,
  //                 shadowColor: 'rgba(0, 0, 0, 0.5)',
  //               },
  //             },
  //           },
  //         ],
  //       });
  //     } else {
  //       isShow.value = false;
  //     }
  //   }
  //   // { immediate: true }
  // );
  // });
  let totalData = [];
  watch(
    () => props.deviceAlertInfo,
    () => {
      // There should not be negative values in rawData
      let obj = {};
      if (props.deviceAlertInfo !== undefined && props.deviceAlertInfo.alertLogs) {
        // console.log(props.deviceAlertInfo);
        if(props.deviceAlertInfo.emerCount != 0
          || props.deviceAlertInfo.generalCount != 0
          || props.deviceAlertInfo.warnCount != 0){
          isShow.value= true;
          totalData = [
            { value: props.deviceAlertInfo.emerCount, name: '紧急' },
            { value: props.deviceAlertInfo.generalCount, name: '一般' },
            { value: props.deviceAlertInfo.warnCount, name: '警告' },
          ];
          setOptions({
            legend: {
              top: 0,
              left: 'center', // 设置图例水平居中
              selectedMode: false,
            },
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                // 自定义提示框内容
                console.log(params.data);
                return `
                    ${params.data.name}：${params.data.value}条`;
              },
            },
            grid: {
              left: 0,
              right: 0,
              top: 1,
              bottom: 80,
            },
            series: [
              {
                name: '',
                type: 'pie',
                radius: '60%',
                center: ['50%', '55%'],
                color: ['#d8031c', '#0052d9', '#f59924'], // 仅对该系列生效
                data: totalData,
              },
            ],
          });
        }else{
          totalData = [];
          setOptions({
            title: {
              text: '暂无数据',
              x: 'center',
              y: 'center',
            },
          });
        }
        isShow.value = true;
      } else {
        totalData = [];
        setOptions({
          title: {
            text: '暂无数据',
            x: 'center',
            y: 'center',
          },
        });
      }
      console.log(isShow.value);

    },
    { immediate: true }
  );
</script>
