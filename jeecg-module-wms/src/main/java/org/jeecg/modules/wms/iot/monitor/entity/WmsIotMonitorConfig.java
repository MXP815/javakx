package org.jeecg.modules.wms.iot.monitor.entity;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * @Description: 监控配置表（监控点）
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Data
@TableName("wms_iot_monitor_config")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="监控配置表")
public class WmsIotMonitorConfig implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键")
    private String id;

    @Schema(description = "创建人")
    private String createBy;

    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建时间")
    private Date createTime;

    @Schema(description = "更新人")
    private String updateBy;

    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新时间")
    private Date updateTime;

    @Schema(description = "组织机构编码")
    private String sysOrgCode;

    @Excel(name = "产品编码", width = 15)
    @Schema(description = "产品编码")
    private String productCode;

    @Excel(name = "产品名称", width = 15)
    @Schema(description = "产品名称")
    private String productName;

    @Excel(name = "设备编码", width = 15)
    @Schema(description = "设备编码")
    private String deviceCode;

    @Excel(name = "设备名称", width = 15)
    @Schema(description = "设备名称")
    private String deviceName;

    @Excel(name = "物模型编码", width = 15)
    @Schema(description = "物模型编码")
    private String modelCode;

    @Excel(name = "物模型名称", width = 15)
    @Schema(description = "物模型名称")
    private String modelName;

    @Excel(name = "单位", width = 15)
    @Schema(description = "单位")
    private String unit;

    @Schema(description = "租户ID")
    private Integer tenantId;

    @Schema(description = "设备及冷库名（冗余展示）")
    private String deviceWithWarehouseName;
}
