export default {
  "panels": [
    {
      "index": 0,
      "name": 1,
      "paperType": "A4",
      "height": 297,
      "width": 210,
      "paperHeader": 0,
      "paperFooter": 841.8897637795277,
      "printElements": [
        {
          "options": {
            "left": 228,
            "top": 76.5,
            "height": 9.75,
            "width": 160.5,
            "title": "仓库管理系统入库单",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 15,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 486,
            "top": 81,
            "height": 64.5,
            "width": 64.5,
            "textType": "qrcode",
            "title": "url",
            "coordinateSync": false,
            "widthHeightSync": false,
            "hideTitle": true,
            "qrCodeLevel": 0,
            "field": "url",
            "testData": "www.baidu.com"
          },
          "printElementType": {
            "title": "qrcode",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 130.5,
            "top": 111,
            "height": 9.75,
            "width": 192,
            "title": "采购单号 ",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 12,
            "qrCodeLevel": 0,
            "field": "orderNumber"
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 331.5,
            "top": 111,
            "height": 9.75,
            "width": 141,
            "title": "仓库",
            "field": "warehouseName",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 12,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 133.5,
            "top": 145.5,
            "height": 9.75,
            "width": 181.5,
            "title": "货主 ",
            "field": "ownerName",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 12,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 334.5,
            "top": 147,
            "height": 9.75,
            "width": 142.5,
            "title": "来源单号: ",
            "field": "sourceNumber",
            "testData": "",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 12,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 79.5,
            "top": 175.5,
            "height": 36,
            "width": 478.5,
            "coordinateSync": false,
            "widthHeightSync": false,
            "field": "table",
            "maxRows": 10,
            "columns": [
              [
                {
                  "width": 45.02531277965875,
                  "title": "序号",
                  "titleSync": false,
                  "field": "orderIndex",
                  "checked": true,
                  "columnId": "orderIndex",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                  "tableQRCodeLevel": 0,
                  "tableSummaryTitle": true,
                  "tableSummary": ""
                },
                {
                  "width": 97.9415551685216,
                  "title": "商品编码",
                  "titleSync": false,
                  "field": "productCode",
                  "checked": true,
                  "columnId": "productCode",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                  "tableQRCodeLevel": 0,
                  "tableSummaryTitle": true,
                  "tableSummary": ""
                },
                {
                  "width": 172.04762548864565,
                  "title": "商品名称",
                  "titleSync": false,
                  "field": "productName",
                  "checked": true,
                  "columnId": "productName",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                  "tableQRCodeLevel": 0,
                  "tableSummaryTitle": true,
                  "tableSummary": ""
                },
                {
                  "width": 64.23634126498908,
                  "title": "数量",
                  "titleSync": false,
                  "field": "expectedQuantity",
                  "checked": true,
                  "columnId": "expectedQuantity",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                  "tableQRCodeLevel": 0,
                  "tableSummaryTitle": true,
                  "tableSummary": "sum",
                  "tableSummaryNumFormat": "0"
                },
                {
                  "width": 99.24916529818493,
                  "title": "备注",
                  "titleSync": false,
                  "field": "remarks",
                  "checked": true,
                  "columnId": "remarks",
                  "fixed": false,
                  "rowspan": 1,
                  "colspan": 1,
                  "tableQRCodeLevel": 0,
                  "tableSummaryTitle": true,
                  "tableSummary": ""
                }
              ]
            ]
          },
          "printElementType": {
            "title": "表格",
            "type": "table",
            "editable": true,
            "columnDisplayEditable": true,
            "columnDisplayIndexEditable": true,
            "columnTitleEditable": true,
            "columnResizable": true,
            "columnAlignEditable": true,
            "isEnableEditField": true,
            "isEnableContextMenu": true,
            "isEnableInsertRow": true,
            "isEnableDeleteRow": true,
            "isEnableInsertColumn": true,
            "isEnableDeleteColumn": true,
            "isEnableMergeCell": true
          }
        },
        {
          "options": {
            "left": 79.5,
            "top": 235.5,
            "height": 9.75,
            "width": 120,
            "title": "仓管",
            "field": "warehouseManager",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 12,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 243,
            "top": 240,
            "height": 9.75,
            "width": 120,
            "title": "制单",
            "field": "editor",
            "testData": "",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 12,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 427.5,
            "top": 240,
            "height": 9.75,
            "width": 120,
            "title": "叉车司机",
            "field": "driver",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 12,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        }
      ],
      "paperNumberContinue": true,
      "overPrintOptions": {},
      "watermarkOptions": {},
      "panelLayoutOptions": {}
    }
  ]
}
