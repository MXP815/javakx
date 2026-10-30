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
 * @Description: 物流商表
 * @Author: jeecg-boot
 * @Date:   2026-10-30
 * @Version: V1.0
 */
@Data
@TableName("wms_carrier")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@Schema(description="物流商表")
public class WmsCarrier implements Serializable {
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
	/**承运商编码*/
	@Excel(name = "承运商编码", width = 15)
    @Schema(description = "承运商编码")
    private String carrierCode;
	/**承运商名称*/
	@Excel(name = "承运商名称", width = 15)
    @Schema(description = "承运商名称")
    private String carrierName;
	/**类型*/
	@Excel(name = "类型", width = 15)
    @Schema(description = "类型")
    private String carrierType;
	/**联系人*/
	@Excel(name = "联系人", width = 15)
    @Schema(description = "联系人")
    private String contactPerson;
	/**联系电话*/
	@Excel(name = "联系电话", width = 15)
    @Schema(description = "联系电话")
    private String contactPhone;
	/**联系邮箱*/
	@Excel(name = "联系邮箱", width = 15)
    @Schema(description = "联系邮箱")
    private String contactEmail;
	/**地址*/
	@Excel(name = "地址", width = 15)
    @Schema(description = "地址")
    private String address;
	/**国家*/
	@Excel(name = "国家", width = 15)
    @Schema(description = "国家")
    private String country;
	/**省份*/
	@Excel(name = "省份", width = 15)
    @Schema(description = "省份")
    private String province;
	/**城市*/
	@Excel(name = "城市", width = 15)
    @Schema(description = "城市")
    private String city;
	/**邮编*/
	@Excel(name = "邮编", width = 15)
    @Schema(description = "邮编")
    private String postalCode;
	/**税号*/
	@Excel(name = "税号", width = 15)
    @Schema(description = "税号")
    private String taxId;
	/**银行账户*/
	@Excel(name = "银行账户", width = 15)
    @Schema(description = "银行账户")
    private String bankAccount;
	/**开户银行*/
	@Excel(name = "开户银行", width = 15)
    @Schema(description = "开户银行")
    private String bankName;
	/**账户持有人*/
	@Excel(name = "账户持有人", width = 15)
    @Schema(description = "账户持有人")
    private String accountHolder;
	/**状态*/
	@Excel(name = "状态", width = 15, dicCode = "dict_item_status")
	@Dict(dicCode = "dict_item_status")
    @Schema(description = "状态")
    private String status;
	/**租户ID*/
    @Schema(description = "租户ID")
    private Integer tenantId;
}
