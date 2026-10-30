export default {
  "panels": [
    {
      "index": 0,
      "name": 1,
      "paperType": "自定义",
      "height": 40,
      "width": 70,
      "paperHeader": 0,
      "paperFooter": 170.07874015748033,
      "printElements": [
        {
          "options": {
            "left": 42,
            "top": 22.5,
            "height": 9.75,
            "width": 120,
            "title": "货主",
            "field": "ownerName",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 7.5,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 42,
            "top": 39,
            "height": 9.75,
            "width": 120,
            "title": "商品名称",
            "field": "productName",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 7.5,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 42,
            "top": 55.5,
            "height": 9.75,
            "width": 120,
            "title": "规格",
            "field": "productSpec",
            "coordinateSync": false,
            "widthHeightSync": false,
            "fontSize": 7.5,
            "qrCodeLevel": 0
          },
          "printElementType": {
            "title": "文本",
            "type": "text"
          }
        },
        {
          "options": {
            "left": 42,
            "top": 72,
            "height": 36,
            "width": 121.5,
            "textType": "barcode",
            "title": "barcode",
            "field": "productBarcode",
            "testData": "1122233Ab-A",
            "coordinateSync": false,
            "widthHeightSync": false,
            "barcodeMode": "CODE128B",
            "qrCodeLevel": 0,
            "fontSize": 7.5
          },
          "printElementType": {
            "title": "barcode",
            "type": "text"
          }
        }
      ],
      "paperNumberLeft": 253,
      "paperNumberTop": 148,
      "paperNumberContinue": true,
      "overPrintOptions": {
        "content": "",
        "opacity": 0.7,
        "type": 1
      },
      "watermarkOptions": {
        "content": "",
        "fillStyle": "rgba(184, 184, 184, 0.3)",
        "fontSize": "14px",
        "rotate": 25,
        "width": 200,
        "height": 200,
        "timestamp": false,
        "format": "YYYY-MM-DD HH:mm"
      },
      "panelLayoutOptions": {
        "layoutType": "column",
        "layoutRowGap": 0,
        "layoutColumnGap": 0
      }
    }
  ]
}
