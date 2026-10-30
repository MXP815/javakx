<template>
  <BasicModal v-bind="$attrs" @register="registerModal" destroyOnClose :title="title" :width="800">
    <div v-if="loading" class="loading">加载中...</div>
    <div ref="svgContainer" class="svg-container"  v-show="!loading"></div>
  </BasicModal>

</template>

<script lang="ts" setup>
import {ref, computed, unref, reactive,nextTick} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {viewPickPath} from "@/views/wave/WmsTasks.api";
const loading = ref(true);
const svgContainer = ref<HTMLElement | null>(null);
// 定义加载SVG的函数
const loadSvgData = (id: string) => {
  loading.value = true;
  viewPickPath( {waveId: id},(res) => {
    // console.log("res",res);
    if ( svgContainer.value&& res.svg) {
      svgContainer.value.innerHTML = res.svg;
      loading.value = false;
    }
  });

};


// Emits声明
const emit = defineEmits(['register','success']);
const isUpdate = ref(true);
const isDetail = ref(false);
const formDisabled = ref(false);
const refKeys = ref(['wmsOutOrders', ]);
const activeKey = ref('wmsOutOrders');
const wmsOutOrders = ref();
const wmsPickTasks = ref();
const wmsShipments = ref();
const tableRefs = {wmsOutOrders,wmsPickTasks,wmsShipments};
//表单赋值
const [registerModal, {setModalProps, closeModal}] = useModalInner(async (data) => {
  setModalProps({title: '查看拣货路径',height: 800,width: 1024})
  // 使用nextTick确保DOM已经更新
  setTimeout(() => {
    loadSvgData(data.record.id);
  }, 2);
});
</script>

<style lang="less" scoped>
.svg-container {
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  overflow: auto;
}

.svg-container svg {
  max-width: 100%;
  height: auto;
}
</style>
