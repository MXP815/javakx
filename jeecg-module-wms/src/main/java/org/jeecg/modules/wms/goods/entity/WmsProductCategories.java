package org.jeecg.modules.wms.goods.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * @Description: 农产品类别表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Data
@TableName("wms_product_categories")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="农产品类别表")
public class WmsProductCategories implements Serializable {
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
	/**类别名称*/
	@Excel(name = "类别名称", width = 15)
    @Schema(description = "类别名称")
    private String categoryName;
	/**父级节点*/
	@Excel(name = "父级节点", width = 15)
    @Schema(description = "父级节点")
    private String parentId;
	/**状态(1启用 0停用)*/
	@Excel(name = "状态", width = 15)
    @Schema(description = "状态(1启用 0停用)")
    private String status;
	/**是否有子节点*/
    @Schema(description = "是否有子节点")
    private String hasChild;
	/**类别编码*/
	@Excel(name = "类别编码", width = 15)
    @Schema(description = "类别编码")
    private String categoryCode;
	/**子节点（不映射数据库）*/
	@TableField(exist = false)
	@Schema(description = "子节点")
    private List<WmsProductCategories> children;
}
