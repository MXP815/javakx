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
 * @Description: 包材管理表
 * @Author: jeecg-boot
 * @Date:   2026-10-30
 * @Version: V1.0
 */
@Data
@TableName("wms_packaging_material")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="包材管理表")
public class WmsPackagingMaterial implements Serializable {
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
	/**包材编号*/
	@Excel(name = "包材编号", width = 15)
    @Schema(description = "包材编号")
    private String materialCode;
	/**包材类型*/
	@Excel(name = "包材类型", width = 15)
    @Schema(description = "包材类型")
    private String materialType;
	/**包材名称*/
	@Excel(name = "包材名称", width = 15)
    @Schema(description = "包材名称")
    private String materialName;
	/**所属货主*/
	@Excel(name = "所属货主", width = 15, dictTable = "wms_cargo_owners", dicText = "owner_name", dicCode = "id")
	@Dict(dictTable = "wms_cargo_owners", dicText = "owner_name", dicCode = "id")
    @Schema(description = "所属货主")
    private String ownerId;
	/**长*/
	@Excel(name = "长", width = 15)
    @Schema(description = "长")
    private Double length;
	/**宽*/
	@Excel(name = "宽", width = 15)
    @Schema(description = "宽")
    private Double width;
	/**高*/
	@Excel(name = "高", width = 15)
    @Schema(description = "高")
    private Double height;
	/**体积*/
	@Excel(name = "体积", width = 15)
    @Schema(description = "体积")
    private Double volume;
	/**重量*/
	@Excel(name = "重量", width = 15)
    @Schema(description = "重量")
    private Double weight;
	/**状态*/
	@Excel(name = "状态", width = 15, dicCode = "dict_item_status")
	@Dict(dicCode = "dict_item_status")
    @Schema(description = "状态")
    private String status;
	/**租户ID*/
    @Schema(description = "租户ID")
    private Integer tenantId;
}
