package org.jeecg.modules.wms.iot.model.entity;

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
 * @Description: 产品模型表（物模型）
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Data
@TableName("wms_iot_product_model")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="产品模型表")
public class WmsIotProductModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键")
    private String id;

    @Excel(name = "功能名称", width = 15)
    @Schema(description = "功能名称")
    private String modelName;

    @Excel(name = "功能编码", width = 15)
    @Schema(description = "功能编码")
    private String code;

    @Excel(name = "功能类型", width = 15)
    @Schema(description = "功能类型（field/service）")
    private String type;

    @Excel(name = "产品编码", width = 15)
    @Schema(description = "产品编码")
    private String productCode;

    @Schema(description = "指令")
    private String command;

    @Schema(description = "是否传参")
    private Integer needExtraArg;

    @Schema(description = "参数类型")
    private String argType;

    @Excel(name = "功能描述", width = 15)
    @Schema(description = "功能描述")
    private String modelDesc;

    @Schema(description = "创建人")
    private String createBy;

    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建时间")
    private Date createTime;

    @JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新时间")
    private Date updateTime;

    @Schema(description = "单位")
    private String unit;

    @Schema(description = "组织机构编码")
    private String sysOrgCode;

    @Schema(description = "租户ID")
    private Integer tenantId;
}
