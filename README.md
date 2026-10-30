# 鲜农仓 · 农产品冷链仓储系统（前端）

面向农产品冷链仓储场景的一体化 WMS 管理系统前端，基于 JeecgBoot Vue3 脚手架二次开发，采用农业丰收主题视觉（稻田绿 + 麦田金 + 麦穗元素）。

## 功能模块

- 主档管理：仓库、库位、容器、商品、货主、供应商、承运商
- 入库管理：入库单、收货任务/记录、上架任务/记录（支持打印）
- 库存管理：库存查询、库存日志、盘点
- 出库管理：出库单、波次单、拣货任务/记录
- IoT 监控：设备管理、实时监控大屏（WebSocket）、报警规则/日志、IoT 工作台
- 大屏可视化：仓储运营数据大屏
- 系统管理：用户、角色、菜单、字典、消息、定时任务等

## 技术栈

- Vue 3 + Vite 5 + TypeScript
- Ant Design Vue 4 + VXE Table + UnoCSS
- Pinia、Vue Router、ECharts、hiprint（打印）

## 环境要求

- Node.js 20+
- pnpm 9+

## 快速启动

```bash
pnpm install
pnpm dev
```

开发服务地址：`http://localhost:3100`，接口默认代理到 `http://localhost:8089/jeecg-boot`（可在 `.env.development` 中修改）。

默认账号：`admin` / `123456`

## 构建部署

```bash
pnpm build
```

产物输出至 `dist/`，默认部署子路径 `/jeecgboot/`。

## 主题说明

- 全局主色：稻田绿 `#43A047`，点缀色：麦田金 `#d4a017`
- 全局麦田背景图 + 麦浪渐变表头 + 暖金卡片阴影 + 麦穗空数据插画
- 背景图等资源位于 `src/assets/images/`，走构建管线，自动适配子路径部署
