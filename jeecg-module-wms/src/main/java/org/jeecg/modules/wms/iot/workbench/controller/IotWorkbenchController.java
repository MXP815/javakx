package org.jeecg.modules.wms.iot.workbench.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.jeecg.modules.wms.iot.alertLog.entity.WmsIotAlertLog;
import org.jeecg.modules.wms.iot.alertLog.service.IWmsIotAlertLogService;
import org.jeecg.modules.wms.iot.device.entity.WmsIotDevice;
import org.jeecg.modules.wms.iot.device.service.IWmsIotDeviceService;
import org.jeecg.modules.wms.iot.product.entity.WmsIotProduct;
import org.jeecg.modules.wms.iot.product.service.IWmsIotProductService;
import org.jeecg.modules.wms.iot.workbench.vo.IotDashboardVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Tag(name = "IoT工作台")
@RestController
@RequestMapping("/iot/manage/workbench")
@Slf4j
public class IotWorkbenchController {

    @Autowired
    private IWmsIotProductService productService;
    @Autowired
    private IWmsIotDeviceService deviceService;
    @Autowired
    private IWmsIotAlertLogService alertLogService;

    @Operation(summary = "工作台数据")
    @GetMapping("/dashboard")
    public Result<IotDashboardVO> dashboard(String warehouseCodes) {
        IotDashboardVO vo = new IotDashboardVO();
        vo.setCounterInfo(buildCounterInfo());
        vo.setProductRatios(buildProductRatios());
        vo.setDeviceAlertInfo(buildDeviceAlertInfo());
        vo.setDeviceDistribution(buildDeviceDistribution());
        vo.setAlertRanks(buildAlertRanks());
        return Result.OK(vo);
    }

    private IotDashboardVO.CounterInfo buildCounterInfo() {
        IotDashboardVO.CounterInfo counter = new IotDashboardVO.CounterInfo();
        counter.setProductCount(productService.count());
        counter.setDeviceCount(deviceService.count());
        List<WmsIotAlertLog> alertLogs = alertLogService.list();
        counter.setCurrentAlertCount((long) alertLogs.size());
        long alertDeviceCount = alertLogs.stream()
                .map(WmsIotAlertLog::getDeviceCode)
                .filter(Objects::nonNull)
                .distinct()
                .count();
        counter.setAlertDeviceCount(alertDeviceCount);
        Date sevenDaysAgo = Date.from(LocalDateTime.now().minusDays(7)
                .atZone(ZoneId.systemDefault()).toInstant());
        long last7Days = alertLogs.stream()
                .filter(log -> log.getCreateTime() != null && log.getCreateTime().after(sevenDaysAgo))
                .count();
        counter.setLast7DaysAlertCount(last7Days);
        return counter;
    }

    private List<IotDashboardVO.ProductRatio> buildProductRatios() {
        List<IotDashboardVO.ProductRatio> ratios = new ArrayList<>();
        List<WmsIotProduct> products = productService.list();
        List<WmsIotDevice> devices = deviceService.list();
        Map<String, Long> countMap = devices.stream()
                .filter(d -> d.getProductCode() != null)
                .collect(Collectors.groupingBy(WmsIotDevice::getProductCode, Collectors.counting()));
        for (WmsIotProduct p : products) {
            IotDashboardVO.ProductRatio r = new IotDashboardVO.ProductRatio();
            r.setProductName(p.getProductName());
            r.setRatio(countMap.getOrDefault(p.getProductCode(), 0L).intValue());
            ratios.add(r);
        }
        return ratios;
    }

    private IotDashboardVO.DeviceAlertInfo buildDeviceAlertInfo() {
        IotDashboardVO.DeviceAlertInfo info = new IotDashboardVO.DeviceAlertInfo();
        List<WmsIotAlertLog> logs = alertLogService.list();
        int emer = 0, warn = 0, general = 0;
        for (WmsIotAlertLog log : logs) {
            String level = log.getAlertLevel();
            if (level == null) { general++; continue; }
            switch (level) {
                case "紧急": case "emer": case "EMERGENCY": emer++; break;
                case "警告": case "warn": case "WARNING": warn++; break;
                default: general++; break;
            }
        }
        info.setEmerCount(emer);
        info.setWarnCount(warn);
        info.setGeneralCount(general);
        // 前端 SaleRadar.vue 需要滚动展示报警日志列表
        info.setAlertLogs(logs);
        return info;
    }

    private IotDashboardVO.DeviceDistribution buildDeviceDistribution() {
        IotDashboardVO.DeviceDistribution dist = new IotDashboardVO.DeviceDistribution();
        List<WmsIotProduct> products = productService.list();
        List<WmsIotDevice> devices = deviceService.list();
        List<WmsIotAlertLog> alertLogs = alertLogService.list();
        dist.setProductCount(products.size());
        dist.setDeviceCount(devices.size());
        dist.setAlertCount(alertLogs.size());

        Set<String> alertDeviceSet = alertLogs.stream()
                .map(WmsIotAlertLog::getDeviceCode)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, List<WmsIotDevice>> devicesByProduct = devices.stream()
                .filter(d -> d.getProductCode() != null)
                .collect(Collectors.groupingBy(WmsIotDevice::getProductCode));

        List<IotDashboardVO.ProductDevice> list = new ArrayList<>();
        for (WmsIotProduct product : products) {
            IotDashboardVO.ProductDevice pd = new IotDashboardVO.ProductDevice();
            pd.setProductName(product.getProductName());
            List<WmsIotDevice> pds = devicesByProduct.getOrDefault(product.getProductCode(), Collections.emptyList());
            List<IotDashboardVO.DeviceInfo> diList = new ArrayList<>();
            for (WmsIotDevice dev : pds) {
                IotDashboardVO.DeviceInfo di = new IotDashboardVO.DeviceInfo();
                di.setDeviceName(dev.getDeviceName());
                di.setStatusName(getStatusName(dev.getDeviceStatus(), dev.getIsEnable()));
                di.setAlertStatus(alertDeviceSet.contains(dev.getDeviceCode()) ? "报警中" : "正常");
                diList.add(di);
            }
            pd.setDevices(diList);
            list.add(pd);
        }
        dist.setProductDevicesList(list);
        return dist;
    }

    private List<IotDashboardVO.AlertRank> buildAlertRanks() {
        List<IotDashboardVO.AlertRank> ranks = new ArrayList<>();
        List<WmsIotAlertLog> alertLogs = alertLogService.list();
        Date sevenDaysAgo = Date.from(LocalDateTime.now().minusDays(7)
                .atZone(ZoneId.systemDefault()).toInstant());
        Date fourteenDaysAgo = Date.from(LocalDateTime.now().minusDays(14)
                .atZone(ZoneId.systemDefault()).toInstant());

        Map<String, String> deviceNameMap = deviceService.list().stream()
                .filter(d -> d.getDeviceCode() != null)
                .collect(Collectors.toMap(WmsIotDevice::getDeviceCode, WmsIotDevice::getDeviceName, (a, b) -> a));

        Map<String, Long> last7Days = alertLogs.stream()
                .filter(log -> log.getCreateTime() != null && log.getCreateTime().after(sevenDaysAgo))
                .filter(log -> log.getDeviceCode() != null)
                .collect(Collectors.groupingBy(WmsIotAlertLog::getDeviceCode, Collectors.counting()));

        Map<String, Long> prev7Days = alertLogs.stream()
                .filter(log -> log.getCreateTime() != null
                        && log.getCreateTime().after(fourteenDaysAgo)
                        && log.getCreateTime().before(sevenDaysAgo))
                .filter(log -> log.getDeviceCode() != null)
                .collect(Collectors.groupingBy(WmsIotAlertLog::getDeviceCode, Collectors.counting()));

        List<Map.Entry<String, Long>> sorted = last7Days.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toList());

        int rank = 1;
        for (Map.Entry<String, Long> entry : sorted) {
            IotDashboardVO.AlertRank ar = new IotDashboardVO.AlertRank();
            ar.setRankNo(rank++);
            String deviceCode = entry.getKey();
            ar.setDeviceName(deviceNameMap.getOrDefault(deviceCode, deviceCode));
            ar.setAlertCount(entry.getValue().intValue());
            long prev = prev7Days.getOrDefault(entry.getKey(), 0L);
            ar.setPrevDiff((int)(entry.getValue() - prev));
            ranks.add(ar);
        }
        return ranks;
    }

    private String getStatusName(Integer deviceStatus, String isEnable) {
        if ("0".equals(isEnable)) return "禁用";
        if (deviceStatus == null) return "未激活";
        switch (deviceStatus) {
            case 1: return "在线";
            case 0: return "离线";
            default: return "未激活";
        }
    }
}
