<template>
  <div style="width: 100%; text-align: right; margin-top: 0px">
    请选择仓库：
    <a-select v-model:value="warehousesSelected" placeholder="请选择仓库" @change="handleChange">
      <template #suffixIcon>
        <Icon icon="ant-design:gold-outline" />
      </template>
      <template v-for="warehouses in warehousesList" :key="warehouses.id">
        <a-select-option :value="warehouses.id">{{ warehouses.warehouseName }}</a-select-option>
      </template>
    </a-select>
  </div>

  <IndexBigscreen  ref="bigScreenRef"></IndexBigscreen>

</template>
<script lang="ts" setup>
import {ref, unref} from 'vue';
  import IndexDef from './homePage/IndexDef.vue';
  import IndexChart from './homePage/IndexChart.vue';
  import IndexBdc from './homePage/IndexBdc.vue';
  import IndexTask from './homePage/IndexTask.vue';
  import IndexBigscreen from './homePage/IndexBigscreen.vue';
  import {defHttp} from "@/utils/http/axios";
  import {useMessage} from "@/hooks/web/useMessage";
import {getDataByCode} from "@/components/Form/src/utils/areaDataUtil";
import { useUserStore } from '/@/store/modules/user';
const bigScreenRef = ref();
const userStore = useUserStore();

  const { createMessage } = useMessage();
  const warehousesSelected = ref();
  const warehousesList = ref([]);
   let warehouseId = userStore.getWarehouse;
   if(warehouseId){
     warehousesSelected.value = warehouseId;
   }
  //加载仓库
  loadWarehousesList();
  /**
   * 获取仓库信息
   */
  async function getWarehouses(params?){
    return defHttp.get({ url: '/warehouse/wmsWarehouses/list', params });
  }
  /**
   *加载仓库信息
   */
  async function loadWarehousesList() {
    const result = await getWarehouses();
    console.log('result', result)
    if (!result.records || result.records.length == 0) {
      createMessage.warn('请进入仓库管理菜单添加仓库')
      return;
    }
    warehousesList.value = result.records;
    if(!unref(warehousesSelected)){
      warehousesSelected.value = result.records[0].id;
    }
    handleChange();
  }
/**
 *  change事件
 */
function handleChange() {
  if(unref(warehousesSelected)){
    // alert(unref(warehousesSelected))
    userStore.setWarehouse(unref(warehousesSelected));
  }
}

  const indexStyle = ref(2);
</script>
