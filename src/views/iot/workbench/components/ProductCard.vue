<template>
  <Card title="产品分布">
    <template #extra><span @click="onExportXls" class="exportText" v-if="!isShow">导出</span></template>
    <div ref="chartRef" :style="{ width, height }" v-if="isShow"></div>
    <div class="noData" v-else>暂无数据</div>
  </Card>
</template>
<script lang="ts" setup>
  import { isShallow, Ref, ref, watch } from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { getExportUrl } from './WmsIotProductModel.api';
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
    productRatios: {
      type: Array as any,
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  //注册table数据
  const { onExportXls } = useListPage({
    tableProps: {
      // title: '设备表',
      // api: devicelist,
      // columns,
      // canResize: false,
      // formConfig: {
      //   //labelWidth: 120,
      //   schemas: searchFormSchema,
      //   autoSubmitOnEnter: true,
      //   showAdvancedButton: true,
      //   fieldMapToNumber: [],
      //   fieldMapToTime: [],
      // },
      // actionColumn: {
      //   width: 180,
      //   fixed: 'right',
      // },
      // beforeFetch: (params) => {
      //   return Object.assign(params, queryParam);
      // },
    },
    exportConfig: {
      name: '产品分布表',
      url: getExportUrl,
    },
  });
  let totalData = [];
  let isShow = ref(true);
  watch(
    () => props.productRatios,
    () => {
      // There should not be negative values in rawData
      let obj = {};
      // alert(props.productRatios)
      if (props.productRatios !== undefined && props.productRatios.length > 0) {
        totalData = [];
        props.productRatios.forEach((ele) => {
          obj = {
            name: ele.productName,
            value: ele.ratio,
          };
          totalData.push(obj);
        });
        isShow.value = true;
        setOptions({
          legend: {
            top: 0,
            left: 'center', // 设置图例水平居中
            selectedMode: false,
          },
          toolbox: {
            show: false,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 100,
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}：{d}%',
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '60%',
              center: ['50%', '55%'],
              // color: ['#d8031c', '#0052d9', '#f59924'], // 仅对该系列生效
              data: totalData,
            },
          ],
        });
      } else {
        totalData = [];
        // isShow.value = false;
        setOptions({
          title: {
            text: '暂无数据',
            x: 'center',
            y: 'center',
          },
        });
      }

    },
    { immediate: true }
  );
</script>
