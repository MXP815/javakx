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
 * @Description: 产品图片表
 * @Author: jeecg-boot
 * @Date:   2026-10-30
 * @Version: V1.0
 */
@Data
@TableName("wms_product_images")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="产品图片表")
public class WmsProductImages implements Serializable {
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
	/**所属农产品*/
	@Excel(name = "所属农产品", width = 15, dictTable = "wms_products", dicText = "product_name", dicCode = "id")
	@Dict(dictTable = "wms_products", dicText = "product_name", dicCode = "id")
    @Schema(description = "所属农产品")
    private String productId;
	/**原始图片*/
	@Excel(name = "原始图片", width = 15)
    @Schema(description = "原始图片")
    private String original;
	/**是否默认*/
	@Excel(name = "是否默认", width = 15)
    @Schema(description = "是否默认")
    private String isDefault;
	/**小图*/
	@Excel(name = "小图", width = 15)
    @Schema(description = "小图")
    private String small;
	/**缩略图*/
	@Excel(name = "缩略图", width = 15)
    @Schema(description = "缩略图")
    private String thumbnail;
	/**租户ID*/
    @Schema(description = "租户ID")
    private Integer tenantId;
}
