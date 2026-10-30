package org.jeecg.modules.wms.iot.device.entity;

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
 * @Description: IoT设备表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Data
@TableName("wms_iot_device")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="IoT设备表")
public class WmsIotDevice implements Serializable {
    private static final long serialVersionUID = 1L;

	/**主键*/
	@TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键")
    private String id;

	/**设备名称*/
	@Excel(name = "设备名称", width = 15)
    @Schema(description = "设备名称")
    private String deviceName;

	/**设备编码*/
	@Excel(name = "设备编码", width = 15)
    @Schema(description = "设备编码")
    private String deviceCode;

	/**产品编码*/
	@Excel(name = "产品编码", width = 15)
    @Schema(description = "产品编码")
    private String productCode;

	/**是否启用*/
	@Excel(name = "是否启用", width = 15)
    @Schema(description = "是否启用")
    private String isEnable;

	/**备注*/
	@Excel(name = "备注", width = 15)
    @Schema(description = "备注")
    private String remark;

	/**创建人*/
    @Schema(description = "创建人")
    private String createBy;

	/**创建时间*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建时间")
    private Date createTime;

	/**更新人*/
    @Schema(description = "更新人")
    private String updateBy;

	/**更新时间*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新时间")
    private Date updateTime;

	/**产品名称*/
	@Excel(name = "产品名称", width = 15)
    @Schema(description = "产品名称")
    private String productName;

	/**设备状态*/
	@Excel(name = "设备状态", width = 15)
    @Schema(description = "设备状态")
    private Integer deviceStatus;

	/**仓库编码*/
	@Excel(name = "仓库编码", width = 15)
    @Schema(description = "仓库编码")
    private String warehouseCode;

	/**仓库名称*/
	@Excel(name = "仓库名称", width = 15)
    @Schema(description = "仓库名称")
    private String warehouseName;

	/**IP地址*/
	@Excel(name = "IP地址", width = 15)
    @Schema(description = "IP地址")
    private String ipAddr;

	/**组织机构编码*/
    @Schema(description = "组织机构编码")
    private String sysOrgCode;

	/**租户ID*/
    @Schema(description = "租户ID")
    private Integer tenantId;
}
