<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="打印" :minHeight="200" :showCancelBtn="false" :showOkBtn="false" :height="88" :destroyOnClose="true">
   <!--单选，web打印，Lodop打印-->
    <a-radio-group  v-model:value="printType">
      <a-radio value="web">web打印</a-radio>
      <a-radio value="lodop">lodop打印</a-radio>
    </a-radio-group>
    <!--打印按钮-->
    <a-button type="primary" @click="print">打印</a-button>
  </BasicModal>
</template>
<script lang="ts" setup>
import {getCurrentInstance, reactive,  toRefs,ref} from "vue";
import { BasicModal, useModalInner } from '/@/components/Modal';
import { propTypes } from '/@/utils/propTypes';
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import xss from 'xss'
// import { options } from './XssWhiteList'
import { getLodop } from '/@/assets/LodopFuncs' //导入模块
import {
  wmsStockInOrderItemsList,
} from '../WmsStockInOrders.api';
const router = useRouter()
// const { proxy } = getCurrentInstance();
import inorderPanel from "/@/views/printTemplate/inorder-panel2";
// import print_lock from '../../../assets/print-lock.css'

const printType = ref("web");
const isUpdate = ref(true);
const printData = ref({});
//表单赋值
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  //请求入库单明细列表
  const values = await wmsStockInOrderItemsList( {id: data.record.id})
  console.log('入库单明细列表',values)
  setPrintData( {...data.record, table: values.result})

});

const hasHref = ref(false)
//查看消息详情可以跳转
// function showHrefButton(){
//   if(content.value.busId){
//     hasHref.value = true;
//   }
// }

// const printData = {
//   "orderNumber": "ASN202505140002",
//   "warehouseName": "中原01号保鲜库",
//   "ownerName": "山东寿光蔬菜专业合作社",
//   "sourceNumber": "S00293932",
//   "warehouseManager": "小王",
//   "editor": "小李",
//   "url": "http://www.itcast.cn",
//   "table": [
//     {
//       "orderIndex": "1",
//       "productCode": "1010201",
//       "productName": "红富士苹果",
//       "expectedQuantity": "101",
//       "remarks": ""
//     }
//     ,
//     {
//       "orderIndex": "2",
//       "productCode": "1010202",
//       "productName": "有机水果黄瓜",
//       "expectedQuantity": "33",
//       "remarks": ""
//     }
//
//   ]
// }
//向打印数据赋值方法
function setPrintData(record){
  console.log('打印数据',record)
  printData.value = record;
  printData.value.url="http://www.baidu.com"
  //给printData.value.table的orderIndex序号赋值.
  if(printData.value.table){
    printData.value.table.forEach((item, index) => {
      item.orderIndex = index + 1;
    });
  }
}
//web打印
async function printWeb() {
  // 按需加载打印插件，避免打开页面就尝试连接本地打印服务
  const { hiprint } = await import('sv-print');
  // 加载模板对象
  const hiprintTemplate = new hiprint.PrintTemplate({
    template: inorderPanel, // 模板json对象
  });
  const jqueryObj = hiprintTemplate.getHtml(printData.value);
  const html = jqueryObj.html();
  console.log(html)
  // const template = hiprintTemplate.getJson();
  hiprintTemplate.print(printData.value, {}, {
    styleHandler: () => {
      return '<link href="https://jzo2o-oss.oss-cn-hangzhou.aliyuncs.com/upload/test/print-lock_1754485170237.css" media="print" rel="stylesheet">'
    }
  })
}
//Lodop打印
async function printLodop() {
  // 按需加载打印插件，避免打开页面就尝试连接本地打印服务
  const { hiprint } = await import('sv-print');
  // 创建模板对象
  const hiprintTemplate = new hiprint.PrintTemplate({
    template: inorderPanel, // 模板json对象
  });
  const template = hiprintTemplate.getJson();
  const jqueryObj = hiprintTemplate.getHtml(printData.value);
  const html = jqueryObj.html();
  // console.log(html)
  //样式

  const style = "<style > table, th, td { border: 1px solid black;  }  .hiprint-printPaper { position: relative; padding: 0 0 0 0; page-break-after: always; overflow-x: hidden;overflow: hidden; }</style>";
  // const style = '<link href="http://localhost:63642/print-lock.css" media="print" rel="stylesheet">';
  var strFormHtml = style + "<body>"+ html +"</body>";
  let LODOP = getLodop()//调用getLodop获取LODOP对象
  //打印任务名称
  LODOP.PRINT_INIT("")
  //100%用于分页
  LODOP.ADD_PRINT_HTM(1,1,350,"100%",strFormHtml);
  LODOP.PREVIEW();
}
async function print() {
  //如果选择web则调用web打印方法，否则 调用 lodop打印方法
  if (printType.value === 'web') {
    printWeb();
  }else{
    printLodop();
  }
}


/**
 * 打印
 */
function print2() {
  let LODOP = getLodop()//调用getLodop获取LODOP对象
  //打印任务名称
  LODOP.PRINT_INIT("")
  LODOP.SET_PRINT_STYLE("FontSize",18);
  LODOP.SET_PRINT_STYLE("Bold",1);
  LODOP.ADD_PRINT_TEXT(50,231,260,39,"打印页面部分内容");
  LODOP.ADD_PRINT_HTM(88,200,350,600,document.getElementById("abcd").innerHTML);
  LODOP.PREVIEW();
}
//跳转至办理页面
/*function jumpToHandlePage(){*/
/*  let temp:any = content.value*/
/*  if(temp.busId){*/
/*    //这个busId是 任务ID*/
/*    let jsonStr = temp.msgAbstract;*/
/*    let query = {};*/
/*    try {*/
/*      if(jsonStr){*/
/*        let temp = JSON.parse(jsonStr)*/
/*        if(temp){*/
/*          Object.keys(temp).map(k=>{*/
/*            query[k] = temp[k]*/
/*          });*/
/*        }*/
/*      }*/
/*    }catch(e){*/
/*      console.log('参数解析异常', e)*/
/*    }*/

/*    console.log('query', query, jsonStr)*/
//     console.log('busId', temp.busId)
//
//     if(Object.keys(query).length>0){
//       // taskId taskDefKey procInsId
//       router.push({ path: '/task/handle/' + temp.busId, query: query })
//     }else{
//       router.push({ path: '/task/handle/' + temp.busId })
//     }
//   }
//   closeModal();
// }

</script>
<style id="style1">
@media print {
  table {
    border-collapse: collapse;
  }
  table, th, td {
    border: 1px solid black;
  }
}
</style>
<!--<style scoped lang="less">-->
<!--.detail-iframe {-->
<!--  border: 0;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--  min-height: 600px;-->
<!--}-->
<!--.hiprint-printElement-tableTarget-border-all{-->
<!--  border: 1px solid rgb(0, 0, 0);-->
<!--}-->
<!--</style>-->
