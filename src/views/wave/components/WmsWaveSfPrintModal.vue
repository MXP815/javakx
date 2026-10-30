<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="打印电子面单" :minHeight="200" :showCancelBtn="false" :showOkBtn="false" :height="88" :destroyOnClose="true">
    <!--下拉框 选择了打印机后设置打印机，不设置打印机则使用默认打印机-->
    <a-select v-model:value="selectedPrinter" style="width: 320px;">
      <a-select-option value="" >请选择打印机</a-select-option>
      <a-select-option v-for="p in pcData" :key="p.id" :value="p.id">{{p.pcName}}</a-select-option>
    </a-select>
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
const router = useRouter()
import inorderPanel from "/@/views/printTemplate/inorder-panel";
import {useMessage} from "@/hooks/web/useMessage";
interface DocumentItem {
  masterWaybillNo?: string;
  branchWaybillNo?: string;
  seq: number;
  sum: number;
  remark: string;
}
const printWaybillsParams = {token:"",documents: [] as DocumentItem[]}
//表单赋值
const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  // console.log('打印参数',data)
  //打开弹窗时再获取打印机列表
  CreatePrinterList();
  printWaybillsParams.token=data.token;
  //运单号数组
  let waybillNos = data.waybillNos;
  //将运单号数组构造成如下格式
  /**
   *  [{
   * 	"masterWaybillNo":"SF7444497619913",
   * 	"seq":"1",
   * 	"sum":"3",
   * 	"remark":"有需要可以传自己需要备注的简短内容，没有可以不传该字段"},
   *  {
   * 	"masterWaybillNo":"SF7444497619913",
   * 	"branchWaybillNo":"SF7444516115096",
   * 	"seq":"2",
   * 	"sum":"3",
   * 	"remark":"有需要可以传自己需要备注的简短内容，没有可以不传该字段"},
   *  {
   * 	"masterWaybillNo":"SF7444497619913",
   * 	"branchWaybillNo":"SF7444516115102",
   * 	"seq":"3",
   * 	"sum":"3",
   * 	"remark":"有需要可以传自己需要备注的简短内容，没有可以不传该字段"}
   */
  //遍历waybillNos数组
 let masterWaybillNo="";
  waybillNos.forEach((item, index) => {
    if(index==0){
      masterWaybillNo=item;
      printWaybillsParams.documents.push( {
        masterWaybillNo: item,
        seq: index + 1,
        sum: waybillNos.length,
        remark: ""
      })
    }else{
      printWaybillsParams.documents.push( {
        masterWaybillNo: masterWaybillNo,
        branchWaybillNo: item,
        seq: index + 1,
        sum: waybillNos.length,
        remark: ""
      })
    }
  })


  console.log('打印参数',printWaybillsParams.documents )

});
const { createMessage } = useMessage();
//打印机
const pcData = ref<Array<{ id: number; pcName: string }>>([]);
const selectedPrinter = ref<string>("")
const hasHref = ref(false)

//打开弹窗时才检测本地打印控件，避免打开页面就尝试连接C-Lodop服务
function CreatePrinterList(){
  let LODOP=getLodop();
  if(!LODOP){
    createMessage.warning('未检测到 C-Lodop 打印控件，请安装后重试');
    return;
  }
  var iPrinterCount=LODOP.GET_PRINTER_COUNT();
  var list:Array<{ id: number; pcName: string }>=[];
  for(var i=0;i<iPrinterCount;i++){
    list.push({"id":i,"pcName":LODOP.GET_PRINTER_NAME(i)});
  }
  pcData.value=list;
}

// 引入SDK后初始化实例，首次打印时才创建
const sdkCallback = result => {};
const sdkParams = {
  env: "sbox", // 生产：pro；沙箱：sbox。不传默认生产，转生产需要修改这里
  partnerID: "Y4F7BALR",
  callback: sdkCallback,
  notips: false
};
let printSdk: any = null;
async function ensurePrintSdk() {
  if (printSdk) return printSdk;
  if (!(window as any).SCPPrint) {
    await import('/@/assets/SCPPrint.js');
  }
  printSdk = new (window as any).SCPPrint(sdkParams);
  return printSdk;
}
function generateSerial() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${random}`.toUpperCase();
}
// 打印
async function print() {
  // console.log(printWaybillsParams.documents)
  if(selectedPrinter.value === "" || selectedPrinter.value === null || selectedPrinter.value === undefined){
    createMessage.warn('请选择打印机')
    return;
  }
  const sdk = await ensurePrintSdk();
  sdk.setPrinter(selectedPrinter.value);
  const data = {
    requestID: generateSerial(),
    accessToken: printWaybillsParams.token,
    templateCode: "fm_76130_standard_Y4F7BALR",
    templateVersion: "",
    documents: printWaybillsParams.documents,
    // documents: [
    //   {
    //     "masterWaybillNo" : "SF7444497761557",
    //     "remark" : "",
    //     "seq" : 1,
    //     "sum" : 2
    //   },
    //   {
    //     "branchWaybillNo" : "SF7444516279186",
    //     "remark" : "",
    //     "seq" : 2,
    //     "sum" : 2
    //   },
    //
    // ],
    extJson: {},
    customTemplateCode: ""
  };
  const callback = function(result) {
    console.log('打印结果', result);
    if (result && result.code !== 1) {
      createMessage.error(result.msg || '打印失败');
    } else {
      createMessage.success('打印任务已提交');
    }
  };

  const options = {
    lodopFn: "PRINT" // 默认打印，预览传PREVIEW
  };
  sdk.print(data, callback, options);
}

// 打印面单 printWaybills
function printWaybills2() {
  if(selectedPrinter.value==""){
    createMessage.warn('请选择打印机')
    return;
  }
  let LODOP = getLodop()//调用getLodop获取LODOP对象
  //打印任务名称
  LODOP.PRINT_INIT("测试PDF打印功能")
  // LODOP.SET_PRINTER_INDEX(0);
  LODOP.ADD_PRINT_PDF(0,0,"100%","100%",demoDownloadPDF("http://localhost:3100/pdf"));
  LODOP.SET_PRINT_PAGESIZE(3,0,0,"");//纸张设置为自定义模式
  LODOP.SET_PRINT_STYLEA(0,"PDFScalMode",1);//参数值含义：0-缩小大页面 、1-实际大小（选它）、2-适合纸张
  LODOP.PREVIEW();
}
function demoGetBASE64(dataArray) {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var strData = "";
  for (var i = 0, ii = dataArray.length; i < ii; i += 3) {
    if (isNaN(dataArray[i])) break;
    var b1 = dataArray[i] & 0xFF, b2 = dataArray[i + 1] & 0xFF, b3 = dataArray[i + 2] & 0xFF;
    var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
    var d3 = i + 1 < ii ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
    var d4 = i + 2 < ii ? (b3 & 0x3F) : 64;
    strData += digits.substring(d1, d1 + 1) + digits.substring(d2, d2 + 1) + digits.substring(d3, d3 + 1) + digits.substring(d4, d4 + 1);
  }
  console.log(strData);
  return strData;
}
function demoDownloadPDF(url){
  if (!(/^https?:/i.test(url))) return;
  if (window.XMLHttpRequest) var xhr = new XMLHttpRequest(); else var xhr = new ActiveXObject("MSXML2.XMLHTTP");
  xhr.open('GET',url,false); //同步方式
  if (xhr.overrideMimeType)
    try{
      xhr.responseType = 'arraybuffer';
      var arrybuffer=true;
    }catch(err){
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
    }
  xhr.send(null);
  var data = xhr.response || xhr.responseBody;
  if (typeof Uint8Array !== 'undefined') {
    if (arrybuffer) var dataArray = new Uint8Array(data); else {
      var dataArray = new Uint8Array(data.length);
      for (var i = 0; i < dataArray.length; i++) {dataArray[i] = data.charCodeAt(i);}
    }
  } else
    var dataArray = VBS_BinaryToArray(data).toArray(); //兼容IE低版本
  return demoGetBASE64(dataArray);
}
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
