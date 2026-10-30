<template>
  <div class="p-2 cgformErpList">
    <div class="content">
      <!--引用表格-->
      <BasicTable @register="registerTable" :rowSelection="rowSelection">
        <!--插槽:table标题-->
        <template #tableTitle>

          <a-button type="primary"   @click="printWaybills" preIcon="ant-design:plus-outlined"> 打印电子面单</a-button>
          <!--下拉框 选择了打印机后设置打印机，不设置打印机则使用默认打印机-->
          <a-select v-model:value="selectedPrinter" style="width: 320px;">
            <a-select-option value="" >请选择打印机</a-select-option>
            <a-select-option v-for="p in pcData" :key="p.id" :value="p.id">{{p.pcName}}</a-select-option>
          </a-select>
          <a-button type="primary"   @click="" preIcon="ant-design:plus-outlined"> 配送</a-button>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <template #overlay>
<!--              <a-menu>-->
<!--                <a-menu-item key="1" @click="batchHandleDelete">-->
<!--                  <Icon icon="ant-design:delete-outlined"></Icon>-->
<!--                  删除-->
<!--                </a-menu-item>-->
<!--              </a-menu>-->
            </template>
<!--            <a-button  v-auth="'wave:wms_wave_master:deleteBatch'">批量操作-->
<!--              <Icon icon="mdi:chevron-down"></Icon>-->
<!--            </a-button>-->
          </a-dropdown>
          <!-- 高级查询 -->
<!--          <super-query :config="superQueryConfig" @search="handleSuperQuery" />-->
        </template>
        <!--操作栏-->
        <template #action="{ record }">
          <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
        </template>
        <!--字段回显插槽-->
        <template v-slot:bodyCell="{ column, record, index, text }">
        </template>
      </BasicTable>
      <!--子表表格tab-->
<!--      <a-tabs defaultActiveKey="1" style="margin: 10px">-->
<!--        <a-tab-pane tab="出库单" key="1" >-->
<!--          <WmsOutOrdersList />-->
<!--        </a-tab-pane>-->
<!--      </a-tabs>-->
    </div>
    <!-- 表单区域 -->
    <WmsWaveMasterModal @register="registerModal" @success="handleSuccess"></WmsWaveMasterModal>
    <!--创建波次选择波次策略表单-->
    <WmsWaveMasterAddModal @register="registerAddModal" @success="handleSuccess"></WmsWaveMasterAddModal>
  </div>
</template>

<script lang="ts" name="wave-wmsWaveMaster" setup>

  import {ref, reactive, computed, unref,provide} from 'vue';
  import {BasicTable, useTable, TableAction} from '/@/components/Table';
  import { useListPage } from '/@/hooks/system/useListPage'
  import {useModal} from '/@/components/Modal';
  import WmsWaveMasterModal from './components/WmsWaveMasterModal.vue'
  import WmsWaveMasterAddModal from './components/WmsWaveMasterAddModal.vue'
  import { useUserStore } from '/@/store/modules/user';
  import WmsOutOrdersList from './WmsOutOrdersList.vue'
  import {columns, searchFormSchema, superQuerySchema} from './WmsWaveMaster.data';
  import { getLodop } from '/@/assets/LodopFuncs' //导入模块
  import {
    list,
    deleteOne,
    batchDelete,
    getImportUrl,
    getExportUrl,
    createPickTask, createShipment, listByCreate, listByPicking,  listByPacked
  } from './WmsWaveMaster.api';
  import {downloadFile} from '/@/utils/common/renderUtils';
  import {useMessage} from "@/hooks/web/useMessage";
  import '/@/assets/SCPPrint.js'
  const queryParam = reactive<any>({});
  //注册model
  const [registerModal, {openModal}] = useModal();
  const [registerAddModal, {openModal:  openAddModal}] = useModal();
  const { createMessage } = useMessage();
   //注册table数据
  const { prefixCls,tableContext,onExportXls,onImportXls } = useListPage({
      tableProps:{
           title: '波次主表',
           api: listByPacked,
           columns,
           canResize: false,
           clickToRowSelect: true,
           rowSelection: {type: 'checkbox'},
           formConfig: {
                schemas: [],
                fieldMapToNumber: [
                ],
                fieldMapToTime: [
                ],
            },
           actionColumn: {
               width: 120,
               fixed:'right'
           },
           beforeFetch: (params) => {
             return Object.assign(params, queryParam);
           },
           pagination:{
               current: 1,
               pageSize: 5,
               pageSizeOptions: ['5', '10', '20'],
           }
        },
        exportConfig: {
            name:"波次主表",
            url: getExportUrl,
            params: queryParam,
        },
        importConfig: {
            url: getImportUrl,
            success: handleSuccess
        },
    })
  const userStore = useUserStore();
  const [registerTable, {reload},{ rowSelection, selectedRowKeys }] = tableContext

  const mainId = computed(() => (unref(selectedRowKeys).length > 0 ? unref(selectedRowKeys)[0] : ''));
  //下发 mainId,子组件接收
  provide('mainId', mainId);

    // 高级查询配置
    const superQueryConfig = reactive(superQuerySchema);
   //打印机
  const pcData = [];
  const selectedPrinter = ref<string>("")
  /**
   * 高级查询事件
   */
  function handleSuperQuery(params) {
    Object.keys(params).map((k) => {
      queryParam[k] = params[k];
    });
    reload();
  }

   /**
    * 新增事件
    */
  function handleAdd() {
     openAddModal(true, {
       isUpdate: false,
       showFooter: true,
     });
  }

  /**
   * 创建拣货任务
   */
  async function handleCreatePickTask() {
    //如果没有选择数据则提示
    if (selectedRowKeys.value.length === 0) {
      createMessage.warn('请选择波次')
       return;
    }
    await createPickTask({ids: selectedRowKeys.value}, handleSuccess)
  }
  /**
   * 创建包裹
   */
  async function handleCreateShipment() {
    //如果没有选择数据则提示
    if (selectedRowKeys.value.length === 0) {
      createMessage.warn('请选择波次')
       return;
    }
    await createShipment({ids: selectedRowKeys.value}, handleSuccess)
  }
   /**
    * 编辑事件
    */
  function handleEdit(record: Recordable) {
     openModal(true, {
       record,
       isUpdate: true,
       showFooter: true,
     });
   }
   /**
    * 详情
   */
  function handleDetail(record: Recordable) {
     openModal(true, {
       record,
       isUpdate: true,
       showFooter: false,
     });
   }
   /**
    * 删除事件
    */
  async function handleDelete(record) {
     await deleteOne({id: record.id}, handleSuccess);
   }
   /**
    * 批量删除事件
    */
  async function batchHandleDelete() {
     await batchDelete({ids: selectedRowKeys.value},handleSuccess);
   }
   /**
    * 成功回调
    */
  function handleSuccess() {
      (selectedRowKeys.value = []) && reload();
   }
   /**
      * 操作栏
      */
  function getTableAction(record){
       return [
         {
           label: '详情',
           onClick: handleDetail.bind(null, record),
         }
         // {
         //   label: '编辑',
         //   onClick: handleEdit.bind(null, record),
         //   auth: 'wave:wms_wave_master:edit'
         // }
       ]
   }


  /**
   * 下拉操作栏
   */
  function getDropDownAction(record){
    return [
      // {
      //   label: '详情',
      //   onClick: handleDetail.bind(null, record),
      // }, {
      //   label: '删除',
      //   popConfirm: {
      //     title: '是否确认删除',
      //     confirm: handleDelete.bind(null, record),
      //     placement: 'topLeft'
      //   },
      //   auth: 'wave:wms_wave_master:delete'
      // }
    ]
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
  function CreatePrinterList(){
    let LODOP=getLodop();
    var iPrinterCount=LODOP.GET_PRINTER_COUNT();
    //创建pcData数组，无数数量为iPrinterCount
    for(var i=0;i<iPrinterCount;i++){
      //pcData添加元素
      pcData[i]={"id":i,"pcName":LODOP.GET_PRINTER_NAME(i)};
    }
  }
  CreatePrinterList();

  // 引入SDK后初始化实例，仅执行一次
  const sdkCallback = result => {};
  const sdkParams = {
    env: "sbox", // 生产：pro；沙箱：sbox。不传默认生产，转生产需要修改这里
    partnerID: "Y2VL6F82",
    callback: sdkCallback,
    notips: false
  };
  const printSdk = new SCPPrint(sdkParams);

  // 获取打印机列表
  const getPrintersCallback = result => {
    if (result.code === 1) {
      const printers = result.printers;

      const selectElement = document.getElementById("printers");

      // 渲染打印机选择框下拉值
      for (let i = 0; i < printers.length; i++) {
        const item = printers[i];
        var option = document.createElement("option");
        option.innerHTML = item.name;
        option.value = item.index;
        selectElement.appendChild(option);
      }

      // 设置默认打印机
      var printer = 0;
      selectElement.value = printer;
      printSdk.setPrinter(printer);
    }
  };
  printSdk.getPrinters(getPrintersCallback);

  // 选择打印机
  function selectPrinter(e) {
    // 设置打印机
    printSdk.setPrinter(e.target.value);
  }

  // 打印
  function print() {
    const data = {
      requestID: "11133",
      accessToken: "EB767051A8764E3DA1611716AAE13FBA",
      templateCode: "fm_150_standard_Y2VL6F82",
      templateVersion: "",
      documents: [
        {
          masterWaybillNo: "SF7444497619913"
        }
      ],
      extJson: {},
      customTemplateCode: ""
    };
    const callback = function(result) {};
    const options = {
      lodopFn: "PRINT" // 默认打印，预览传PREVIEW
    };
    printSdk.print(data, callback, options);
  }
  function printWaybills() {
    print()
  }

</script>

<style lang="less" scoped>
  html[data-theme='light'] {
    .cgformErpList {
      height: 100%;
      .content {
        background-color: #fff;
        height: 100%;
      }
    }
  }

  :deep(.ant-picker),:deep(.ant-input-number){
    width: 100%;
  }
</style>
