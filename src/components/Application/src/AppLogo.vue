<!--
 * @Author: Jeecg
 * @Description: logo component
-->
<template>
  <div class="anticon" :class="getAppLogoClass" @click="goHome">
    <div class="logo-container">
      <!-- 玉米图标 - 占3/4 -->
      <div class="logo-icon">
        <img src="../../../assets/images/xiannongcang-logo.svg" alt="鲜农仓" />
      </div>
      <!-- 鲜农仓文字 - 占1/4 -->
      <div class="logo-text" :class="getTitleClass" v-show="showTitle">
        鲜农仓
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useUserStore } from '/@/store/modules/user';

  const props = defineProps({
    /**
     * The theme of the current parent component
     */
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    /**
     * Whether to show title
     */
    showTitle: { type: Boolean, default: true },
    /**
     * The title is also displayed when the menu is collapsed
     */
    alwaysShowTitle: { type: Boolean },
  });

  const { prefixCls } = useDesign('app-logo');
  const { getCollapsedShowTitle } = useMenuSetting();
  const userStore = useUserStore();
  const { title, shortTitle } = useGlobSetting();
  
  const go = useGo();

  const getAppLogoClass = computed(() => [prefixCls, props.theme, { 'collapsed-show-title': unref(getCollapsedShowTitle) }]);

  const getTitleClass = computed(() => [
    `${prefixCls}__title`,
    {
      'xs:opacity-0': !props.alwaysShowTitle,
    },
  ]);

  function goHome() {
    go(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 7px;
    cursor: pointer;
    transition: all 0.2s ease;
    //左侧菜单模式和左侧菜单混合模式加渐变背景色
    &.jeecg-layout-mix-sider-logo,&.jeecg-layout-menu-logo{
      background:@sider-logo-bg-color;
    }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    // logo容器 - 垂直布局
    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      gap: 4px;
    }

    // 玉米图标 - 占3/4
    .logo-icon {
      flex: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;

      img {
        height: 100%;
        max-height: 80px;
        width: auto;
        object-fit: contain;
      }
    }

    // 鲜农仓文字 - 占1/4
    .logo-text {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 2px;
      transition: all 0.5s;
      background: linear-gradient(135deg, #FF8F00 0%, #F57C00 50%, #E65100 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    &.light .logo-text {
      background: linear-gradient(135deg, #FF8F00 0%, #F57C00 50%, #E65100 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    &.dark .logo-text {
      background: linear-gradient(135deg, #FFD54F 0%, #FFC107 50%, #FFB300 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
</style>
