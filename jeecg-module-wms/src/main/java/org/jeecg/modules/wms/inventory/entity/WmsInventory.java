package org.jeecg.modules.wms.inventory.entity;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.math.BigDecimal;

import com.baomidou.mybatisplus.annotation.*;
import org.jeecg.common.constant.ProvinceCityArea;
import org.jeecg.common.util.SpringContextUtils;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.jeecg.common.aspect.annotation.Dict;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * @Description: 库存表
 * @Author: jeecg-boot
 * @Date:   2026-10-08
 * @Version: V1.0
 */
@Data
@TableName("wms_inventory")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="库存表")
public class WmsInventory implements Serializable {
    private static final long serialVersionUID = 1L;

	/**主键*/
	@TableId(type = IdType.ASSIGN_ID)
    @Schema(description = "主键")
    private java.lang.String id;
	/**创建人*/
    @Schema(description = "创建人")
    private java.lang.String createBy;
	/**创建日期*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "创建日期")
    private java.util.Date createTime;
	/**更新人*/
    @Schema(description = "更新人")
    private java.lang.String updateBy;
	/**更新日期*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "更新日期")
    private java.util.Date updateTime;
	/**所属部门*/
    @Schema(description = "所属部门")
    private java.lang.String sysOrgCode;
	/**产品id*/
	@Excel(name = "产品id", width = 15)
    @Schema(description = "产品id")
    private java.lang.String productId;
	/**货位编码*/
	@Excel(name = "货位编码", width = 15)
    @Schema(description = "货位编码")
    private java.lang.String locationCode;
	/**容器编码*/
	@Excel(name = "容器编码", width = 15)
    @Schema(description = "容器编码")
    private java.lang.String containerCode;
	/**在库数量*/
	@Excel(name = "在库数量", width = 15)
    @Schema(description = "在库数量")
    private java.lang.Integer stockQuantity;
	/**分配数量*/
	@Excel(name = "分配数量", width = 15)
    @Schema(description = "分配数量")
    private java.lang.Integer allocatedQuantity;
	/**可用数量*/
	@Excel(name = "可用数量", width = 15)
    @Schema(description = "可用数量")
    private java.lang.Integer availableQuantity;
	/**批号 */
	@Excel(name = "批号 ", width = 15)
    @Schema(description = "批号 ")
    private java.lang.String batchNumber;
	/**入库时间*/
	@Excel(name = "入库时间", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @Schema(description = "入库时间")
    private java.util.Date stockInTime;
	/**保鲜期到期日*/
	@Excel(name = "保鲜期到期日", width = 15, format = "yyyy-MM-dd")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @Schema(description = "保鲜期到期日")
    private java.util.Date expiryDate;
	/**供应商*/
	@Excel(name = "供应商", width = 15)
    @Schema(description = "供应商")
    private java.lang.String ownerId;
	/**是否可售*/
	@Excel(name = "是否可售", width = 15)
    @Schema(description = "是否可售")
    @Dict(dicCode = "yn")
    private java.lang.String isSellable;
	/**冷库id*/
	@Excel(name = "冷库id", width = 15)
    @Schema(description = "冷库id")
    private java.lang.String warehouseId;


    /** 供应商名称 */
    @Excel(name = "供应商名称", width = 15)
    @Schema(description = "供应商名称")
    @TableField(exist = false)
    private String ownerName;

    /** 供应商编码 */
    @Excel(name = "供应商编码", width = 15)
    @Schema(description = "供应商编码")
    @TableField(exist = false)
    private String ownerCode;

    /** 农产品名称 */
    @Excel(name = "农产品名称", width = 15)
    @Schema(description = "农产品名称")
    @TableField(exist = false)
    private String productName;

    /** 产品编码 */
    @Excel(name = "产品编码", width = 15)
    @Schema(description = "产品编码")
    @TableField(exist = false)
    private String productCode;

    /** 冷库名称 */
    @Excel(name = "冷库名称", width = 15)
    @Schema(description = "冷库名称")
    @TableField(exist = false)
    private String warehouseName;

    /** 冷库编码 */
    @Excel(name = "冷库编码", width = 15)
    @Schema(description = "冷库编码")
    @TableField(exist = false)
    private String warehouseCode;

    /** 温区类型 */
    @Excel(name = "温区类型", width = 15)
    @Schema(description = "温区类型")
    @TableField(exist = false)
    private String zoneType;
}
