<template>
  <div class="dishboardUser">
    <Card title="" v-bind="$attrs">
      <Avatar :src="userinfo.avatar || headerImg" :size="72" class="!mx-auto !block" />
      <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
        <h1 class="md:text-lg text-md">{{ time }}, {{ userinfo.realname }}</h1>
        <div class="text-user" v-if="deviceDistribution"
          ><span>仓库：</span
          >
          <a-select v-model:value="warehousesSelected" placeholder="请选择仓库" @change="handleChange">
            <template #suffixIcon>
              <Icon icon="ant-design:gold-outline" />
            </template>
            <template v-for="warehouses in warehousesList" :key="warehouses.id">
              <a-select-option :value="warehouses.id">{{ warehouses.warehouseName }}</a-select-option>
            </template>
          </a-select>
        </div>
      </div>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref, onMounted, unref} from 'vue';
  import { Avatar, Card, message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { getUserDeparts } from '/@/views/system/depart/depart.api';
  import headerImg from '/@/assets/images/header.jpg';
  import { useTabs } from '/@/hooks/web/useTabs';
import {defHttp} from "@/utils/http/axios";
import {useMessage} from "@/hooks/web/useMessage";
const { createMessage } = useMessage();
  const userStore = useUserStore();
const warehousesSelected = ref();
const warehousesList = ref([]);

//加载仓库
loadWarehousesList();
  const userinfo = computed(() => userStore.getUserInfo);
  const { refreshPage } = useTabs();
  const emit = defineEmits(['getData']);
  let time = ref('');
  defineProps({
    loading: Boolean,
    deviceDistribution: {
      type: Array as any,
    },
  });
  const userValue = ref([]);
  const departList = ref([]);
  onMounted(() => {
    getTime();
    let warehouseId = userStore.getWarehouse;
    if(warehouseId){
      warehousesSelected.value = warehouseId;
    }
    loadWarehousesList();
  });
  // 禁止用户取消选择必选项
  // function handleDeselect(value) {
  //   const remaining = userValue.value.filter((v) => v !== value);
  //   if (remaining.length === 0) {
  //     // 请至少选择一个仓库
  //     message.warning('请至少选择一个仓库');
  //     userValue.value.push(value);
  //     return false; // 禁止删除最后一个
  //   }
  // }
  // const handleChange = (value: string[]) => {
  //   if (value.length >= 1) {
  //     emit('getData', value.join(','));
  //   }
  // };
  /**
   *加载部门信息
   */
  // async function loadDepartList() {
  //   const result = await getUserDeparts();
  //   if (!result.list || result.list.length == 0) {
  //     return;
  //   }
  //   departList.value = result.list;
  //   departList.value.forEach((ele) => {
  //     userValue.value.push(ele.orgCode);
  //   });
  // }
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
    // 调用父组件方法
    emit('getData', warehousesSelected.value);
  }
  //调用子组件方法
  // bigScreenRef.value.todoTaskList();
}
/**
 * 获取仓库信息
 */
async function getWarehouses(params?){
  return defHttp.get({ url: '/warehouse/wmsWarehouses/list', params });
}
  // 获取早中晚
  const getTime = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 6 && hour < 9) {
      time.value = '早上好';
    } else if (hour >= 9 && hour < 12) {
      time.value = '上午好';
    } else if (hour >= 12 && hour < 14) {
      time.value = '中午好';
    } else if (hour >= 14 && hour < 18) {
      time.value = '下午好';
    } else if (hour >= 18 && hour < 24) {
      time.value = '晚上好';
    }
  };
</script>
<style lang="less" scoped>
  .dishboardUser {
    text-align: center;
    :deep(.ant-card) {
      .ant-card-body {
        padding: 11px 0;
        .text-md {
          margin-top: 10px;
          font-weight: 700;
        }
      }
    }
  }
  .text-user {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
