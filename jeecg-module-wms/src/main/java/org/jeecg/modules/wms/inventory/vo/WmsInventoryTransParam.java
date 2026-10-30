package org.jeecg.modules.wms.inventory.vo;

import lombok.Data;

import java.util.Date;

@Data
public class WmsInventoryTransParam {
    private static final long serialVersionUID = 1L;

    /** 产品id */
    private String productId;

    /** 执行数量 */
    private Integer execQuantity;

    /** 冷库id */
    private String warehouseId;

    /** 来源货位编码（上架/拣货时用） */
    private String sourceLocationCode;

    /** 目的货位编码 */
    private String targetLocationCode;

    /** 批次号 */
    private String batchNumber;

    /** 保鲜期 */
    private Date expiryDate;

    /** 备注 */
    private String remarks;

    /** 变更类型 */
    private String transactionType;

    /** 执行人 */
    private String operator;

    /** 执行时间 */
    private Date operationTime;

    /** 是否可售 1-可售 0-不可售 */
    private String isSellable;
}
