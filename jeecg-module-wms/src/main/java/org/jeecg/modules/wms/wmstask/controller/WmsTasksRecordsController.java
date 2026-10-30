package org.jeecg.modules.wms.wmstask.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.system.query.QueryRuleEnum;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.wms.wmstask.entity.WmsTasksRecords;
import org.jeecg.modules.wms.wmstask.service.IWmsTasksRecordsService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;
import org.jeecg.common.system.base.controller.JeecgController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.apache.shiro.authz.annotation.RequiresPermissions;

 /**
 * @Description: 任务执行记录表
 * @Author: jeecg-boot
 * @Date:   2026-09-22
 * @Version: V1.0
 */
@Tag(name="任务执行记录表")
@RestController
@RequestMapping("/wmstask/wmsTasksRecords")
@Slf4j
public class WmsTasksRecordsController extends JeecgController<WmsTasksRecords, IWmsTasksRecordsService> {
	@Autowired
	private IWmsTasksRecordsService wmsTasksRecordsService;
	
	/**
	 * 分页列表查询
	 *
	 * @param wmsTasksRecords
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	//@AutoLog(value = "任务执行记录表-分页列表查询")
	@Operation(summary="任务执行记录表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<IPage<WmsTasksRecords>> queryPageList(WmsTasksRecords wmsTasksRecords,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
        QueryWrapper<WmsTasksRecords> queryWrapper = QueryGenerator.initQueryWrapper(wmsTasksRecords, req.getParameterMap());
		Page<WmsTasksRecords> page = new Page<WmsTasksRecords>(pageNo, pageSize);
		IPage<WmsTasksRecords> pageList = wmsTasksRecordsService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 *   添加
	 *
	 * @param wmsTasksRecords
	 * @return
	 */
	@AutoLog(value = "任务执行记录表-添加")
	@Operation(summary="任务执行记录表-添加")
	@RequiresPermissions("wmstask:wms_tasks_records:add")
	@PostMapping(value = "/add")
	public Result<String> add(@RequestBody WmsTasksRecords wmsTasksRecords) {
		wmsTasksRecordsService.save(wmsTasksRecords);
		return Result.OK("添加成功！");
	}
	
	/**
	 *  编辑
	 *
	 * @param wmsTasksRecords
	 * @return
	 */
	@AutoLog(value = "任务执行记录表-编辑")
	@Operation(summary="任务执行记录表-编辑")
	@RequiresPermissions("wmstask:wms_tasks_records:edit")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<String> edit(@RequestBody WmsTasksRecords wmsTasksRecords) {
		wmsTasksRecordsService.updateById(wmsTasksRecords);
		return Result.OK("编辑成功!");
	}
	
	/**
	 *   通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "任务执行记录表-通过id删除")
	@Operation(summary="任务执行记录表-通过id删除")
	@RequiresPermissions("wmstask:wms_tasks_records:delete")
	@DeleteMapping(value = "/delete")
	public Result<String> delete(@RequestParam(name="id",required=true) String id) {
		wmsTasksRecordsService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 *  批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "任务执行记录表-批量删除")
	@Operation(summary="任务执行记录表-批量删除")
	@RequiresPermissions("wmstask:wms_tasks_records:deleteBatch")
	@DeleteMapping(value = "/deleteBatch")
	public Result<String> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.wmsTasksRecordsService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功!");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	//@AutoLog(value = "任务执行记录表-通过id查询")
	@Operation(summary="任务执行记录表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<WmsTasksRecords> queryById(@RequestParam(name="id",required=true) String id) {
		WmsTasksRecords wmsTasksRecords = wmsTasksRecordsService.getById(id);
		if(wmsTasksRecords==null) {
			return Result.error("未找到对应数据");
		}
		return Result.OK(wmsTasksRecords);
	}

    /**
    * 导出excel
    *
    * @param request
    * @param wmsTasksRecords
    */
    @RequiresPermissions("wmstask:wms_tasks_records:exportXls")
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, WmsTasksRecords wmsTasksRecords) {
        return super.exportXls(request, wmsTasksRecords, WmsTasksRecords.class, "任务执行记录表");
    }

    /**
      * 通过excel导入数据
    *
    * @param request
    * @param response
    * @return
    */
    @RequiresPermissions("wmstask:wms_tasks_records:importExcel")
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, WmsTasksRecords.class);
    }

}
