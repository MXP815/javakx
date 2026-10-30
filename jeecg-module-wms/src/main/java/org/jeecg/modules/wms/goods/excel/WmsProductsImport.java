package org.jeecg.modules.wms.goods.excel;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

@Data
public class WmsProductsImport {
    private static final long serialVersionUID = 1L;
    /**农产品名称*/
    @ExcelProperty("农产品名称")
    private String productName;
    /**产品编码*/
    @ExcelProperty("sku编码")
    private String productCode;
    /**产品条码*/
    @ExcelProperty("产品条码")
    private String productBarcode;
    @ExcelProperty("产品规格")
    private String productSpec;
    @ExcelProperty("产品批次")
    private String productBatch;
    @ExcelProperty("农户条码")
    private String supplierBarcode;
    /**宽*/
    @ExcelProperty("宽")
    private Double width;
    /**长*/
    @ExcelProperty("长")
    private Double length;
    /**高*/
    @ExcelProperty("高")
    private Double height;
    /**体积*/
    @ExcelProperty("体积")
    private Double volume;
    /**毛重*/
    @ExcelProperty("毛重")
    private Double grossWeight;
    /**净重*/
    @ExcelProperty("净重")
    private Double netWeight;

    /**包装规格*/
    @ExcelProperty("包装规格")
    private String packagingSpec;
    /**质检周期(天)*/
    @ExcelProperty("质检周期(天)")
    private Integer maintenanceCycle;
    /**保鲜期(天)*/
    @ExcelProperty("保鲜期(天)")
    private Integer shelfLife;
    /**计量单位*/
    @ExcelProperty("计量单位")
    private String unit;
    /**是否保鲜期管控*/
    @ExcelProperty("是否保鲜期管控")
    private Integer isExpiryControlled;
    /**状态*/
    @ExcelProperty("状态")
    private String status;
    //供应商名称
    @ExcelProperty("供应商名称")
    private String ownerName;

    //品类名称
    @ExcelProperty("农产品品类")
    private String categoryName;

    @ExcelProperty("产地品牌")
    private String productBrandName;
}
