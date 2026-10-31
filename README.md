# 鲜农仓 · 农产品冷链仓储系统（后端）

面向农产品冷链仓储场景的一体化 WMS 管理系统后端，基于 JeecgBoot 3.8.1（Spring Boot 3.x）二次开发。

## 功能模块

| 模块 | 说明 |
|---|---|
| 主档管理 | 仓库、库区/库位、容器、商品、货主、供应商、承运商 |
| 入库管理 | 入库单、收货任务、收货记录、上架任务、上架记录 |
| 库存管理 | 库存查询、库存明细、库存日志、盘点 |
| 出库管理 | 出库单、波次单、拣货任务、拣货记录 |
| IoT 监控 | 温湿度设备接入、WebSocket 实时监控、报警规则、报警日志、监控配置、IoT 工作台 |
| 大屏可视化 | 仓储运营数据大屏 |
| 系统管理 | 用户、角色、菜单权限、字典、消息、定时任务等 |

## 技术栈

- Spring Boot 3.4.5 + Shiro + JWT
- MyBatis-Plus + MySQL 8.0 + Redis 7
- Undertow、WebSocket、Spring Actuator + Micrometer
- Maven 多模块（`jeecg-boot-base-core` / `jeecg-module-system` / `jeecg-module-wms` / `jeecg-boot-module-airag`）

## 环境要求

- JDK 17+（推荐 21）
- Maven 3.6+
- MySQL 8.0+
- Redis 5.0+

## 快速启动

1. 初始化数据库：创建库 `fengguwms`（utf8mb4），导入 `db/` 目录下的 SQL 脚本
2. 复制配置模板并填写本机连接信息：把 `jeecg-module-system/jeecg-system-start/src/main/resources/application-dev.example.yml` 复制为同目录下的 `application-dev.yml`，填入 MySQL / Redis 密码（该文件已被 `.gitignore` 忽略，不会提交）
3. 构建并启动：

```bash
mvn clean install -DskipTests
mvn spring-boot:run -pl jeecg-module-system/jeecg-system-start -Dspring-boot.run.profiles=dev
```

4. 后端服务地址：`http://localhost:8089/jeecg-boot`

默认账号：`admin` / `123456`

## Docker 部署

```bash
mvn clean install -DskipTests
docker-compose up -d
```

一键启动 MySQL、Redis、后端服务三个容器。

## 前端仓库

前端为独立仓库（Vue3 + Vite + TypeScript + Ant Design Vue 4），默认开发端口 3100，接口代理至本服务。
