<template>
  <div class="fastBox">
    <Card title="快捷入口" v-bind="$attrs">
      <div class="fastNav">
        <div class="item" @click="handleProduct"
          ><GoldOutlined /><p><span class="num">01</span>创建产品</p></div
        >
        <div class="item" @click="handleProductMode"
          ><span class="next"><ArrowRightOutlined /></span><AppstoreAddOutlined /><p class="text"><span class="num">02</span>创建功能</p></div
        >
        <div class="item" @click="handleDevice"
          ><span class="next"><ArrowRightOutlined /></span><UngroupOutlined /><p class="text"><span class="num">03</span>创建设备</p></div
        >
        <div class="item" @click="handleAlert"
          ><ProjectOutlined /><p class="text"><span class="num">06</span>查看报警信息</p></div
        >
        <div class="item" @click="handleAlertRule"
          ><span class="next lastLi04"><ArrowLeftOutlined /></span><HourglassOutlined /><p class="text"
            ><span class="num">05</span>添加报警规则</p
          ></div
        >
        <div class="item" @click="handleMonitor"
          ><span class="next lastLi"><ArrowDownOutlined /></span><span class="next lastLi04"><ArrowLeftOutlined /></span><InstagramOutlined /><p
            class="text"
            ><span class="num">04</span>添加监控</p
          ></div
        >
      </div>
    </Card>
    <!-- 产品新增 -->
    <WmsIotProductModel @register="registerProModal" />
    <!-- 设备新增 -->
    <WmsIotDeviceModel @register="registerDeviceModal" />
    <!-- 功能新增 -->
    <WmsIotFuncModel @register="registerModal" />
    <!-- 监控新增 -->
    <WmsIotSupervisoryModal ref="registerSupervisoryModal" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Card } from 'ant-design-vue';
  import { router } from '/@/router';
  import { useModal } from '/@/components/Modal';
  import WmsIotProductModel from '/@/views/iot/product/components/WmsIotProductModal.vue';
  import WmsIotDeviceModel from '/@/views/iot/device/components/WmsIotDeviceModal.vue';
  import WmsIotSupervisoryModal from '/@/views/iot/supervisory/components/WmsIotMonitorConfigModal.vue';
  import WmsIotFuncModel from './components/WmsIotProductModelModal.vue';
  import {
    GoldOutlined,
    AppstoreAddOutlined,
    UngroupOutlined,
    ProjectOutlined,
    HourglassOutlined,
    InstagramOutlined,
    ArrowRightOutlined,
    ArrowDownOutlined,
    ArrowLeftOutlined,
  } from '@ant-design/icons-vue';

  //注册model
  const [registerModal, { openModal: openFunc }] = useModal();
  const [registerProModal, { openModal: openProduct }] = useModal();
  const [registerDeviceModal, { openModal: openDevice }] = useModal();
  // const [registerSupervisoryModal, { openModal: openSupervisory }] = useModal();
  const registerSupervisoryModal = ref();
  /**
   *  创建产品
   */
  function handleProduct() {
    openProduct(true, {
      isUpdate: false,
      showFooter: true,
    });
    // router.replace({
    //   path: '/iot/manage/product/list',
    //   query: {
    //     deviceId: record.id,
    //   },
    // });
  }
  /**
   *  创建功能
   */
  function handleProductMode() {
    openFunc(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   *  创建设备
   */
  function handleDevice() {
    openDevice(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   *  报警规则
   */
  function handleAlertRule() {
    router.replace({
      path: '/iot/rules/WmsIotAlertRuleAdd',
    });
  }
  // 历史报警
  function handleAlert() {
    router.replace({
      path: '/iot/logModel/WmsIotAlertLogList',
    });
  }
  // 数据监控
  function handleMonitor() {
    registerSupervisoryModal.value.disableSubmit = false;
    registerSupervisoryModal.value.add();
    // router.replace({
    //   path: '/supervisory/WmsIotMonitorConfigList',
    // });
  }
</script>
<style lang="less">
  .fastBox {
    .ant-card {
      .ant-card-body {
        padding: 30px 8px 18px;
      }
    }
  }
  .fastNav {
    display: flex;
    flex-wrap: wrap; /* 允许换行 */
    .item {
      .anticon {
        font-size: 30px;
        margin-bottom: 8px;
        font-weight: normal;
        color: #5470c6;
      }
      width: calc(33.33% - 20px);
      padding: 40px 0 0;

      margin-bottom: 40px;
      margin-right: 20px;
      text-align: center;
      position: relative;
      box-shadow: 10px 10px 5px -5px rgba(242, 242, 242, 0.7);
      // /* 右下角阴影 */ -2px -2px 0px 10px #ffffff inset,
      // /* 左上角内部填充以覆盖其他阴影 */ 10px -2px 0px 10px #ffffff inset,
      // /* 右上角内部填充 */ -2px 2px 0px 10px #ffffff inset; /* 左下角内部填充 */
      border-radius: 5px;
      &:hover {
        box-shadow: 10px 10px 12px -5px rgba(0, 0, 0, 0.2);
      }

      .next {
        position: absolute;
        top: 60px;
        left: -10px;
        .anticon {
          font-size: 20px;
        }
      }
      .lastLi {
        top: -25px;
        right: -20px;
      }
      .lastLi04 {
        top: 60px;
        left: -10px;
      }
      // &:nth-child(1) {
      //   .anticon {
      //     color: #1fdaca;
      //   }
      // }
      // &:nth-child(2) {
      //   .anticon {
      //     color: #bf0c2c;
      //   }
      // }
      // &:nth-child(3) {
      //   .anticon {
      //     color: #e18525;
      //   }
      // }
      // &:nth-child(4) {
      //   .anticon {
      //     color: #3fb27f;
      //   }
      // }
      // &:nth-child(5) {
      //   .anticon {
      //     color: #4daf1bc9;
      //   }
      // }
      // &:nth-child(6) {
      //   .anticon {
      //     color: #00d8ff;
      //   }
      // }
    }
    .text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .num {
      font-size: 20px;
      font-weight: 700;
      color: #0153d9;
    }
  }
</style>
