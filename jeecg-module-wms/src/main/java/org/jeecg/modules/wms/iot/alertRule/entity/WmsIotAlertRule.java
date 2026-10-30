package org.jeecg.modules.wms.iot.alertRule.entity;

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
 * @Description: 报警规则表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Data
@TableName("wms_iot_alert_rule")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="报警规则表")
public class WmsIotAlertRule implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键")
    private String id;

    @Schema(description = "创建人")
    private String createBy;

    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建时间")
    private Date createTime;

    @Schema(description = "更新人")
    private String updateBy;

    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新日期")
    private Date updateTime;

    @Schema(description = "组织机构编码")
    private String sysOrgCode;

    @Excel(name = "报警规则名称", width = 15)
    @Schema(description = "报警规则名称")
    private String alertName;

    @Excel(name = "产品编码", width = 15)
    @Schema(description = "产品编码")
    private String productCode;

    @Schema(description = "所属产品")
    private String productName;

    @Schema(description = "设备编码")
    private String deviceCode;

    @Schema(description = "关联设备")
    private String deviceName;

    @Schema(description = "指标编码")
    private String modelCode;

    @Schema(description = "监控指标")
    private String modelName;

    @Excel(name = "报警级别", width = 15)
    @Schema(description = "报警级别")
    private String alertLevel;

    @Schema(description = "运算符")
    private String operator;

    @Schema(description = "阈值")
    private Double threshold;

    @Schema(description = "连续周期")
    private String cycle;

    @Schema(description = "沉默周期")
    private String ignoreDuration;

    @Schema(description = "启用/禁用")
    private String isEnable;

    @Schema(description = "通知方式")
    private String notifyType;

    @Schema(description = "租户ID")
    private Integer tenantId;

    @Schema(description = "所属冷库")
    private String warehouseName;
}
