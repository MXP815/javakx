package org.jeecg.modules.wms.ai.chat.vo;

import lombok.Data;
import org.springframework.ai.tool.annotation.ToolParam;

/**
 * @description 库存查询条件
 */
@Data
public class WmsInventoryQuery {

    //农产品名称
    @ToolParam(required = true, description = "农产品名称(必填)")
    private String productName;

    //产品编码
    @ToolParam(required = false, description = "产品编码")
    private String productCode;

    //供应商名称
    @ToolParam(required = true, description = "供应商名称(必填)")
    private String ownerName;

    //供应商编码
    @ToolParam(required = false, description = "供应商编码")
    private String ownerCode;

    //冷库名称
    @ToolParam(required = true, description = "冷库名称(必填)")
    private String warehouseName;

    //冷库编码
    @ToolParam(required = false, description = "冷库编码")
    private String warehouseCode;

    //货位编码
    @ToolParam(required = false, description = "货位编码")
    private String locationCode;
}