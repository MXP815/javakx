<template>
  <div>
    <BasicForm @register="registerForm" ref="formRef"/>
    <!-- 子表单区域 -->
    <a-tabs v-model:activeKey="activeKey" animated  @change="handleChangeTabs">
      <a-tab-pane tab="出库单明细" key="wmsOutOrdersItems" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="wmsOutOrdersItems"
          v-if="wmsOutOrdersItemsTable.show"
          :loading="wmsOutOrdersItemsTable.loading"
          :columns="wmsOutOrdersItemsTable.columns"
          :dataSource="wmsOutOrdersItemsTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
          :toolbar="true"
        />
      </a-tab-pane>
      <a-tab-pane tab="出库单分配明细" key="wmsOutOrdersAllocation" :forceRender="true">
        <JVxeTable
          keep-source
          resizable
          ref="wmsOutOrdersAllocation"
          v-if="wmsOutOrdersAllocationTable.show"
          :loading="wmsOutOrdersAllocationTable.loading"
          :columns="wmsOutOrdersAllocationTable.columns"
          :dataSource="wmsOutOrdersAllocationTable.dataSource"
          :height="340"
          :rowNumber="true"
          :rowSelection="true"
          :disabled="formDisabled"
          :toolbar="true"
        />
      </a-tab-pane>
    </a-tabs>

    <div style="width: 100%;text-align: center" v-if="!formDisabled">
      <a-button @click="handleSubmit" pre-icon="ant-design:check" type="primary">提 交</a-button>
    </div>
  </div>
</template>

<script lang="ts">

  import {BasicForm, useForm} from '/@/components/Form/index';
  import { computed, defineComponent, reactive, ref, unref } from 'vue';
  import {defHttp} from '/@/utils/http/axios';
  import { propTypes } from '/@/utils/propTypes';
  import { useJvxeMethod } from '/@/hooks/system/useJvxeMethods';
  import { VALIDATE_FAILED } from '/@/utils/common/vxeUtils';
  import {getBpmFormSchema,wmsOutOrdersAllocationColumns} from '../WmsOutOrders.data';
  import {saveOrUpdate,wmsOutOrdersItemsList,wmsOutOrdersAllocationList} from '../WmsOutOrders.api';

  export default defineComponent({
    name: "WmsOutOrdersForm",
    components:{
      BasicForm,
    },
    props:{
      formData: propTypes.object.def({}),
      formBpm: propTypes.bool.def(true),
    },
    setup(props){
      const [registerForm, { setFieldsValue, setProps }] = useForm({
        labelWidth: 150,
        schemas: getBpmFormSchema(props.formData),
        showActionButtonGroup: false,
        baseColProps: {span: 12}
      });

      const formDisabled = computed(()=>{
        if(props.formData.disabled === false){
          return false;
        }
        return true;
      });

      const refKeys = ref(['wmsOutOrdersItems', 'wmsOutOrdersAllocation', ]);
      const activeKey = ref('wmsOutOrdersItems');
      const wmsOutOrdersItems = ref();
      const wmsOutOrdersAllocation = ref();
      const tableRefs = {wmsOutOrdersItems, wmsOutOrdersAllocation, };
      const wmsOutOrdersItemsTable = reactive({
        loading: false,
        dataSource: [],
        columns:wmsOutOrdersItemsColumns,
        show: false
      })
      const wmsOutOrdersAllocationTable = reactive({
        loading: false,
        dataSource: [],
        columns:wmsOutOrdersAllocationColumns,
        show: false
      })

      const [handleChangeTabs,handleSubmit,requestSubTableData,formRef] = useJvxeMethod(requestAddOrEdit,classifyIntoFormData,tableRefs,activeKey,refKeys,validateSubForm);

      function classifyIntoFormData(allValues) {
        let main = Object.assign({}, allValues.formValue)
        return {
          ...main, // 展开
          wmsOutOrdersItemsList: allValues.tablesValue[0].tableData,
          wmsOutOrdersAllocationList: allValues.tablesValue[1].tableData,
        }
      }

      //表单提交事件
      async function requestAddOrEdit(values) {
        await saveOrUpdate(values, true);
      }

      const queryByIdUrl = '/outorder/wmsOutOrders/queryById';
      async function initFormData(){
        let params = {id: props.formData.dataId};
        const data = await defHttp.get({url: queryByIdUrl, params});
        //设置表单的值
        await setFieldsValue({...data});
        requestSubTableData(wmsOutOrdersItemsList, {id: data.id}, wmsOutOrdersItemsTable, ()=>{
          wmsOutOrdersItemsTable.show = true;
        });
        requestSubTableData(wmsOutOrdersAllocationList, {id: data.id}, wmsOutOrdersAllocationTable, ()=>{
          wmsOutOrdersAllocationTable.show = true;
        });
        //默认是禁用
        await setProps({disabled: formDisabled.value})
      }

      initFormData();

      return {
        registerForm,
        formDisabled,
        formRef,
        handleSubmit,
        activeKey,
        handleChangeTabs,
        wmsOutOrdersItems,
        wmsOutOrdersAllocation,
        wmsOutOrdersItemsTable,
        wmsOutOrdersAllocationTable,
      }
    }
  });
</script>
