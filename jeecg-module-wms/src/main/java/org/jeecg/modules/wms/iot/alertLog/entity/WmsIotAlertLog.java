package org.jeecg.modules.wms.iot.alertLog.entity;

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
 * @Description: 报警日志表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Data
@TableName("wms_iot_alert_log")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="报警日志表")
public class WmsIotAlertLog implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键")
    private String id;

    @Schema(description = "创建人")
    private String createBy;

    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建日期")
    private Date createTime;

    @Schema(description = "更新人")
    private String updateBy;

    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新日期")
    private Date updateTime;

    @Schema(description = "组织机构编码")
    private String sysOrgCode;

    @Schema(description = "报警规则ID")
    private String ruleId;

    @Excel(name = "报警规则名称", width = 15)
    @Schema(description = "报警规则名称")
    private String ruleName;

    @Schema(description = "报警规则")
    private String ruleInfo;

    @Excel(name = "报警级别", width = 15)
    @Schema(description = "报警级别")
    private String alertLevel;

    @Excel(name = "设备编码", width = 15)
    @Schema(description = "设备编码")
    private String deviceCode;

    @Schema(description = "设备名称")
    private String deviceName;

    @Excel(name = "报警数据", width = 15)
    @Schema(description = "异常数据")
    private Double alertData;

    @Excel(name = "处理状态", width = 15)
    @Schema(description = "处理进度")
    private String processStatus;

    @Schema(description = "处理时间")
    private String processTime;

    @Schema(description = "处理方案")
    private String processPlan;

    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Schema(description = "报警时间")
    private Date alertTime;

    @Schema(description = "通知信息")
    private String notifyInfo;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "产品名称")
    private String productName;

    @Excel(name = "仓库名称", width = 15)
    @Schema(description = "所属冷库")
    private String warehouseName;

    @Schema(description = "物模型编码")
    private String modelCode;

    @Excel(name = "产品编码", width = 15)
    @Schema(description = "产品编码")
    private String productCode;

    @Schema(description = "租户ID")
    private Integer tenantId;
}
