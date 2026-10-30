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
import org.jeecg.modules.wms.wmstask.entity.WmsTasks;
import org.jeecg.modules.wms.wmstask.service.IWmsTasksService;

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
 * @Description: 任务表
 * @Author: jeecg-boot
 * @Date:   2026-09-22
 * @Version: V1.0
 */
@Tag(name="任务表")
@RestController
@RequestMapping("/wmstask/wmsTasks")
@Slf4j
public class WmsTasksController extends JeecgController<WmsTasks, IWmsTasksService> {
	@Autowired
	private IWmsTasksService wmsTasksService;
	
	/**
	 * 分页列表查询
	 *
	 * @param wmsTasks
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	//@AutoLog(value = "任务表-分页列表查询")
	@Operation(summary="任务表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<IPage<WmsTasks>> queryPageList(WmsTasks wmsTasks,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
        QueryWrapper<WmsTasks> queryWrapper = QueryGenerator.initQueryWrapper(wmsTasks, req.getParameterMap());
		Page<WmsTasks> page = new Page<WmsTasks>(pageNo, pageSize);
		IPage<WmsTasks> pageList = wmsTasksService.page(page, queryWrapper);
		return Result.OK(pageList);
	}
	
	/**
	 *   添加
	 *
	 * @param wmsTasks
	 * @return
	 */
	@AutoLog(value = "任务表-添加")
	@Operation(summary="任务表-添加")
	@RequiresPermissions("wmstask:wms_tasks:add")
	@PostMapping(value = "/add")
	public Result<String> add(@RequestBody WmsTasks wmsTasks) {
		wmsTasksService.save(wmsTasks);
		return Result.OK("添加成功！");
	}
	
	/**
	 *  编辑
	 *
	 * @param wmsTasks
	 * @return
	 */
	@AutoLog(value = "任务表-编辑")
	@Operation(summary="任务表-编辑")
	@RequiresPermissions("wmstask:wms_tasks:edit")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<String> edit(@RequestBody WmsTasks wmsTasks) {
		wmsTasksService.updateById(wmsTasks);
		return Result.OK("编辑成功!");
	}
	
	/**
	 *   通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "任务表-通过id删除")
	@Operation(summary="任务表-通过id删除")
	@RequiresPermissions("wmstask:wms_tasks:delete")
	@DeleteMapping(value = "/delete")
	public Result<String> delete(@RequestParam(name="id",required=true) String id) {
		wmsTasksService.removeById(id);
		return Result.OK("删除成功!");
	}
	
	/**
	 *  批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "任务表-批量删除")
	@Operation(summary="任务表-批量删除")
	@RequiresPermissions("wmstask:wms_tasks:deleteBatch")
	@DeleteMapping(value = "/deleteBatch")
	public Result<String> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.wmsTasksService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功!");
	}
	
	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	//@AutoLog(value = "任务表-通过id查询")
	@Operation(summary="任务表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<WmsTasks> queryById(@RequestParam(name="id",required=true) String id) {
		WmsTasks wmsTasks = wmsTasksService.getById(id);
		if(wmsTasks==null) {
			return Result.error("未找到对应数据");
		}
		return Result.OK(wmsTasks);
	}

    /**
    * 导出excel
    *
    * @param request
    * @param wmsTasks
    */
    @RequiresPermissions("wmstask:wms_tasks:exportXls")
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, WmsTasks wmsTasks) {
        return super.exportXls(request, wmsTasks, WmsTasks.class, "任务表");
    }

    /**
      * 通过excel导入数据
    *
    * @param request
    * @param response
    * @return
    */
    @RequiresPermissions("wmstask:wms_tasks:importExcel")
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, WmsTasks.class);
    }

}
