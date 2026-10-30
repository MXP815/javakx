package org.jeecg.modules.wms.goods.entity;

import java.io.Serializable;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.jeecg.common.aspect.annotation.Dict;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * @Description: 产地品牌表
 * @Author: jeecg-boot
 * @Date:   2026-10-30
 * @Version: V1.0
 */
@Data
@TableName("wms_product_brand")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="产地品牌表")
public class WmsProductBrand implements Serializable {
    private static final long serialVersionUID = 1L;

	/**主键*/
	@TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键")
    private String id;
	/**创建人*/
    @Schema(description = "创建人")
    private String createBy;
	/**创建日期*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建日期")
    private Date createTime;
	/**更新人*/
    @Schema(description = "更新人")
    private String updateBy;
	/**更新日期*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新日期")
    private Date updateTime;
	/**所属部门*/
    @Schema(description = "所属部门")
    private String sysOrgCode;
	/**品牌名称*/
	@Excel(name = "品牌名称", width = 15)
    @Schema(description = "品牌名称")
    private String name;
	/**品牌logo*/
	@Excel(name = "品牌logo", width = 15)
    @Schema(description = "品牌logo")
    private String logo;
	/**状态*/
	@Excel(name = "状态", width = 15, dicCode = "wms_status")
	@Dict(dicCode = "wms_status")
    @Schema(description = "状态")
    private String status;
	/**租户ID*/
    @Schema(description = "租户ID")
    private Integer tenantId;
}
