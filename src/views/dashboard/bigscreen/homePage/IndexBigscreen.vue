<template>
  <div class="p-4">
    <div class="md:flex">
      <template v-for="(item, index) in growCardList" :key="item.title">
        <Card
          size="small"
          :loading="loading"
          :title="item.title"
          class="md:w-1/4 w-full !md:mt-0 !mt-4"
          :class="[index + 1 < 4 && '!md:mr-4']"
          :canExpan="false"
        >
          <template #extra>
            <Tag color="green">{{ item.action }}</Tag>
          </template>

          <div class="py-4 px-4 flex justify-between">
            <CountTo prefix="" :startVal="1" :endVal="item.value" class="text-2xl" />
            <Icon :icon="item.icon" :size="40" />
          </div>

          <div class="p-2 px-4 flex justify-between">
            <span>今日已处理</span>
            <CountTo prefix="" :startVal="1" :endVal="item.total" />
          </div>
        </Card>
      </template>

      <template v-for="(item, index) in growCardList2" :key="item.title">
        <Card
          size="small"
          :loading="loading"
          :title="item.title"
          class="md:w-1/4 w-full !md:mt-0 !mt-4"
          :class="[index + 1 < 4 && '!md:mr-4']"
          :canExpan="false"
        >
          <template #extra>
            <Tag color="green">{{ item.action }}</Tag>
          </template>

          <div class="py-4 px-4 flex justify-between">
            <CountTo prefix="" :startVal="1" :endVal="item.value" class="text-2xl" />
            <Icon :icon="item.icon" :size="40" />
          </div>

          <div class="p-2 px-4 flex justify-between">
            <span>今日已处理</span>
            <CountTo prefix="" :startVal="1" :endVal="item.total" />
          </div>
        </Card>
      </template>
    </div>


    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">

          <a-tab-pane loading="true" tab="入库趋势" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <Bar :chartData="inOrderBarData" :option="{ title: { text: '', textStyle: { fontWeight: 'lighter' } } }" height="40vh" :seriesColor="seriesColor"  />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <RankList title="货主出库排行榜" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="出库趋势" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <Bar :chartData="outOrderBarData" :option="{ title: { text: '', textStyle: { fontWeight: 'lighter' } } }" height="40vh" :seriesColor="seriesColor" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <RankList title="农产品销售排行榜" :list="rankList" />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>


    <a-row>
      <a-col :span="24">
        <a-card :loading="loading" :class="{ 'anty-list-cust': true }" :bordered="false">
          <a-tabs v-model:activeKey="indexBottomTab" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">

            <a-tab-pane tab="库存预警" key="1">
              <a-table
                :dataSource="dataSource"
                size="default"
                rowKey="productCode"
                :columns="table.columns"
                :pagination="ipagination"
                @change="tableChange"
              >

              </a-table>
            </a-tab-pane>

          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
import {ref, watch, computed, unref} from 'vue';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { CountTo } from '/@/components/CountTo/index';
  import { Icon } from '/@/components/Icon';
  import { Tag, Card } from 'ant-design-vue';

  import Bar from '/@/components/chart/Bar.vue';
  import RankList from '/@/components/chart/RankList.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { getTodoTasks, getInOrderTrend, getOutOrderTrend, getOwnerRank, getInventoryAlert } from '../bigscreen.api';



  const loading = ref(true);
  const { getThemeColor } = useRootSetting();
  interface GrowCardItem {
    icon: string;
    title: string;
    value?: number;
    total: number;
    color?: string;
    action?: string;
    footer?: string;
  }
const growCardList= ref( [
    {
      title: '待收货任务',
      icon: 'visit-count|svg',
      value: 0,
      total: 0,
      action: '当天',
    },
    {
      title: '待上架任务',
      icon: 'total-sales|svg',
      value: 0,
      total: 0,
      action: '当天',
    },
    {
      title: '待拣货任务',
      icon: 'download-count|svg',
      value: 0,
      total: 0,
      action: '当天',
    },
  ]);
const growCardList2= ref( [
    {
      title: '待打包数',
      icon: 'transaction|svg',
      value: 0,
      total: 0,
      action: '当天',
    },
  ]);


const table = {
  dataSource: [],
  columns: [
    {
      title: '商品编码',
      align: 'center',
      dataIndex: 'productCode',
    },
    {
      title: '农产品名称',
      align: 'center',
      dataIndex: 'productName',
    },
    {
      title: '预警类型',
      align: 'center',
      dataIndex: 'alertType',
    },
    {
      title: '所在仓库',
      align: 'center',
      dataIndex: 'warehouseName',
    },
    {
      title: '批次号',
      align: 'center',
      dataIndex: 'batchNumber',
    },
    {
      title: '可用库存',
      align: 'center',
      dataIndex: 'availableQuantity',
    },
  ],
  ipagination: {
    current: 1,
    pageSize: 5,
    pageSizeOptions: ['10', '20', '30'],
    showTotal: (total, range) => {
      return range[0] + '-' + range[1] + ' 共' + total + '条';
    },
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0,
  },
};

  defineProps({
    loading: {
      type: Boolean,
    },
  });
  const rankList = ref([
    {
      name: '寿光蔬菜专业合作社',
      total: 1234.56 ,
    },
    {
      name: '赣南脐橙产业发展公司',
      total: 1274.56 ,
    },
    {
      name: '云南高原果蔬合作社',
      total: 1234.56 ,
    },
    {
      name: '北京新发地农产品批发市场',
      total: 1274.56 ,
    },
    {
      name: '中原农产品冷链物流',
      total: 1234.56 ,
    }

  ]);

  const inOrderBarData = ref([
    {
      name: `1月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `3月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `4月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `5月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `6月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `7月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `8月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `9月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `10 月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `11月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `12月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },

  ]);
  const outOrderBarData = ref([
    {
      name: `1月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `3月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `4月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `5月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `6月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `7月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `8月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `9月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `10 月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `11月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },
    {
      name: `12月`,
      value: Math.floor(Math.random() * 1000) + 200,
    },

  ]);
  const seriesColor = computed(() => {
    return getThemeColor.value
  })


  setTimeout(() => {
    loading.value = false;
  }, 500);



const indexBottomTab = ref('1');
const indexRegisterType = ref('转移登记');
const dataSource = ref([]);
const ipagination = ref(table.ipagination);

function tableChange(pagination) {
  ipagination.value.current = pagination.current;
  ipagination.value.pageSize = pagination.pageSize;
  loadDataSource();
}


function loadDataSource() {
  dataSource.value = table.dataSource
}

const userStore = useUserStore();

/**
 * 加载大屏真实业务数据（按当前选中仓库过滤）
 */
async function loadAllData() {
  const params: Recordable = {};
  const warehouseId = userStore.getWarehouse;
  if (warehouseId) {
    params.warehouseId = warehouseId;
  }
  const [todo, inTrend, outTrend, rank, alerts] = await Promise.all([
    getTodoTasks(params),
    getInOrderTrend(params),
    getOutOrderTrend(params),
    getOwnerRank(params),
    getInventoryAlert(params),
  ]);
  if (todo?.taskCards?.length) {
    growCardList.value = todo.taskCards;
  }
  if (todo?.packCard) {
    growCardList2.value = [todo.packCard];
  }
  if (Array.isArray(inTrend) && inTrend.length) {
    inOrderBarData.value = inTrend;
  }
  if (Array.isArray(outTrend) && outTrend.length) {
    outOrderBarData.value = outTrend;
  }
  if (Array.isArray(rank) && rank.length) {
    rankList.value = rank;
  }
  if (Array.isArray(alerts)) {
    dataSource.value = alerts;
    ipagination.value.total = alerts.length;
  }
}

loadDataSource();
loadAllData();

watch(
  () => userStore.getWarehouse,
  () => loadAllData()
);

</script>

<style lang="less" scoped>
   .infoArea {
    display: flex;
    justify-content: space-between;
    padding: 0 10%;
    .head-info.center {
      padding: 0;
    }
    .head-info {
      min-width: 0;
    }
  }
  .circle-cust {
    position: relative;
    top: 28px;
    left: -100%;
  }

  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      font-size: 0.95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }

    p {
      line-height: 42px;
      margin: 0;

      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
  .ant-card {
    ::v-deep(.ant-card-head-title) {
      font-weight: normal;
    }
  }
</style>
