package org.jeecg.modules.wms.iot.monitor.controller;

import java.util.Arrays;
import java.util.List;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.wms.iot.monitor.entity.WmsIotMonitorConfig;
import org.jeecg.modules.wms.iot.monitor.service.IWmsIotMonitorConfigService;

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
 * @Description: 监控配置表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Tag(name="监控配置表")
@RestController
@RequestMapping("/iot/manage/monitor")
@Slf4j
public class WmsIotMonitorConfigController extends JeecgController<WmsIotMonitorConfig, IWmsIotMonitorConfigService> {
	@Autowired
	private IWmsIotMonitorConfigService wmsIotMonitorConfigService;

	/**
	 * 分页列表查询
	 *
	 * @param wmsIotMonitorConfig
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	//@AutoLog(value = "监控配置表-分页列表查询")
	@Operation(summary="监控配置表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<IPage<WmsIotMonitorConfig>> queryPageList(WmsIotMonitorConfig wmsIotMonitorConfig,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<WmsIotMonitorConfig> queryWrapper = QueryGenerator.initQueryWrapper(wmsIotMonitorConfig, req.getParameterMap());
		Page<WmsIotMonitorConfig> page = new Page<WmsIotMonitorConfig>(pageNo, pageSize);
		IPage<WmsIotMonitorConfig> pageList = wmsIotMonitorConfigService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	/**
	 *   添加
	 *
	 * @param wmsIotMonitorConfig
	 * @return
	 */
	@AutoLog(value = "监控配置表-添加")
	@Operation(summary="监控配置表-添加")
	@RequiresPermissions("iot:manage:monitor:add")
	@PostMapping(value = "/add")
	public Result<String> add(@RequestBody WmsIotMonitorConfig wmsIotMonitorConfig) {
		wmsIotMonitorConfigService.save(wmsIotMonitorConfig);
		return Result.OK("添加成功！");
	}

	/**
	 *  编辑
	 *
	 * @param wmsIotMonitorConfig
	 * @return
	 */
	@AutoLog(value = "监控配置表-编辑")
	@Operation(summary="监控配置表-编辑")
	@RequiresPermissions("iot:manage:monitor:edit")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<String> edit(@RequestBody WmsIotMonitorConfig wmsIotMonitorConfig) {
		wmsIotMonitorConfigService.updateById(wmsIotMonitorConfig);
		return Result.OK("编辑成功!");
	}

	/**
	 *   通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "监控配置表-通过id删除")
	@Operation(summary="监控配置表-通过id删除")
	@RequiresPermissions("iot:manage:monitor:delete")
	@DeleteMapping(value = "/delete")
	public Result<String> delete(@RequestParam(name="id",required=true) String id) {
		wmsIotMonitorConfigService.removeById(id);
		return Result.OK("删除成功!");
	}

	/**
	 *  批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "监控配置表-批量删除")
	@Operation(summary="监控配置表-批量删除")
	@RequiresPermissions("iot:manage:monitor:deleteBatch")
	@DeleteMapping(value = "/deleteBatch")
	public Result<String> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.wmsIotMonitorConfigService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功!");
	}

	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	//@AutoLog(value = "监控配置表-通过id查询")
	@Operation(summary="监控配置表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<WmsIotMonitorConfig> queryById(@RequestParam(name="id",required=true) String id) {
		WmsIotMonitorConfig wmsIotMonitorConfig = wmsIotMonitorConfigService.getById(id);
		if(wmsIotMonitorConfig==null) {
			return Result.error("未找到对应数据");
		}
		return Result.OK(wmsIotMonitorConfig);
	}

    /**
    * 导出excel
    *
    * @param request
    * @param wmsIotMonitorConfig
    */
    @RequiresPermissions("iot:manage:monitor:exportXls")
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, WmsIotMonitorConfig wmsIotMonitorConfig) {
        return super.exportXls(request, wmsIotMonitorConfig, WmsIotMonitorConfig.class, "监控配置表");
    }

    /**
      * 通过excel导入数据
    *
    * @param request
    * @param response
    * @return
    */
    @RequiresPermissions("iot:manage:monitor:importExcel")
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, WmsIotMonitorConfig.class);
    }

}
