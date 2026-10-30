package org.jeecg.modules.wms.iot.workbench.vo;

import lombok.Data;
import org.jeecg.modules.wms.iot.alertLog.entity.WmsIotAlertLog;

import java.io.Serializable;
import java.util.List;

/**
 * @Description: IoT工作台数据VO
 * @Author: jeecg-boot
 * @Date: 2026-10-28
 * @Version: V1.0
 */
@Data
public class IotDashboardVO implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 统计卡片信息
     */
    private CounterInfo counterInfo;

    /**
     * 产品分布占比
     */
    private List<ProductRatio> productRatios;

    /**
     * 设备报警信息
     */
    private DeviceAlertInfo deviceAlertInfo;

    /**
     * 设备分布
     */
    private DeviceDistribution deviceDistribution;

    /**
     * 报警排名
     */
    private List<AlertRank> alertRanks;

    @Data
    public static class CounterInfo implements Serializable {
        /**
         * 产品数量
         */
        private Long productCount = 0L;
        /**
         * 设备数量
         */
        private Long deviceCount = 0L;
        /**
         * 当前报警设备数
         */
        private Long alertDeviceCount = 0L;
        /**
         * 当前报警信息数
         */
        private Long currentAlertCount = 0L;
        /**
         * 近7日报警信息数
         */
        private Long last7DaysAlertCount = 0L;
    }

    @Data
    public static class ProductRatio implements Serializable {
        /**
         * 产品名称
         */
        private String productName;
        /**
         * 占比（设备数量）
         */
        private Integer ratio = 0;
    }

    @Data
    public static class DeviceAlertInfo implements Serializable {
        /**
         * 紧急报警数
         */
        private Integer emerCount = 0;
        /**
         * 警告报警数
         */
        private Integer warnCount = 0;
        /**
         * 一般报警数
         */
        private Integer generalCount = 0;
        /**
         * 报警日志列表（供前端滚动展示）
         */
        private List<WmsIotAlertLog> alertLogs;
    }

    @Data
    public static class DeviceDistribution implements Serializable {
        /**
         * 产品数量
         */
        private Integer productCount = 0;
        /**
         * 设备数量
         */
        private Integer deviceCount = 0;
        /**
         * 报警信息数
         */
        private Integer alertCount = 0;
        /**
         * 产品下的设备列表
         */
        private List<ProductDevice> productDevicesList;
    }

    @Data
    public static class ProductDevice implements Serializable {
        /**
         * 产品名称
         */
        private String productName;
        /**
         * 设备列表
         */
        private List<DeviceInfo> devices;
    }

    @Data
    public static class DeviceInfo implements Serializable {
        /**
         * 设备名称
         */
        private String deviceName;
        /**
         * 设备状态名称
         */
        private String statusName;
        /**
         * 报警状态
         */
        private String alertStatus;
    }

    @Data
    public static class AlertRank implements Serializable {
        /**
         * 排名
         */
        private Integer rankNo;
        /**
         * 设备名称
         */
        private String deviceName;
        /**
         * 报警次数
         */
        private Integer alertCount = 0;
        /**
         * 环比变化
         */
        private Integer prevDiff = 0;
    }
}
