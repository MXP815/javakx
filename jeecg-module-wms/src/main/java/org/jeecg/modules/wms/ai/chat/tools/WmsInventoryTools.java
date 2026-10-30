package org.jeecg.modules.wms.ai.chat.tools;

import com.baomidou.mybatisplus.core.metadata.IPage;
import org.jeecg.modules.wms.ai.chat.vo.WmsInventoryQuery;
import org.jeecg.modules.wms.inventory.entity.WmsInventory;
import org.jeecg.modules.wms.inventory.service.IWmsInventoryService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @description 库存工具类
 */
@Component
public class WmsInventoryTools {

    @Autowired
    private IWmsInventoryService wmsInventoryService;

    /**
     * 查询库存
     */
    @Tool(description = "根据条件查询库存信息")
    public List<WmsInventory> queryInventory(@ToolParam(description = "库存查询条件") WmsInventoryQuery query, @ToolParam(description = "库存查询页码") Integer pageNo) {
        if (pageNo == null || pageNo <= 0) {
            pageNo = 1;
        }
        WmsInventory wmsInventory = new WmsInventory();
        BeanUtils.copyProperties(query, wmsInventory);
        IPage<WmsInventory> wmsInventoryIPage = wmsInventoryService.queryList(wmsInventory, pageNo, 10);
        List<WmsInventory> records = wmsInventoryIPage.getRecords();
        return records;
    }
}