package org.jeecg.modules.wms.iot.product.entity;

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
 * @Description: IoT产品表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Data
@TableName("wms_iot_product")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="IoT产品表")
public class WmsIotProduct implements Serializable {
    private static final long serialVersionUID = 1L;

	/**主键*/
	@TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键")
    private String id;

	/**产品名称*/
	@Excel(name = "产品名称", width = 15)
    @Schema(description = "产品名称")
    private String productName;

	/**产品编码*/
	@Excel(name = "产品编码", width = 15)
    @Schema(description = "产品编码")
    private String productCode;

	/**创建时间*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建时间")
    private Date createTime;

	/**创建人*/
    @Schema(description = "创建人")
    private String createBy;

	/**更新时间*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新时间")
    private Date updateTime;

	/**产品描述*/
	@Excel(name = "产品描述", width = 15)
    @Schema(description = "产品描述")
    private String productDesc;

	/**认证方式*/
	@Excel(name = "认证方式", width = 15)
    @Schema(description = "认证方式")
    private String authType;

	/**节点类型*/
	@Excel(name = "节点类型", width = 15)
    @Schema(description = "节点类型")
    private String nodeType;

	/**联网方式*/
	@Excel(name = "联网方式", width = 15)
    @Schema(description = "联网方式")
    private String networkMode;

	/**图片地址*/
	@Excel(name = "图片地址", width = 15)
    @Schema(description = "图片地址")
    private String imageUrl;

	/**组织机构编码*/
    @Schema(description = "组织机构编码")
    private String sysOrgCode;

	/**租户ID*/
    @Schema(description = "租户ID")
    private Integer tenantId;
}
