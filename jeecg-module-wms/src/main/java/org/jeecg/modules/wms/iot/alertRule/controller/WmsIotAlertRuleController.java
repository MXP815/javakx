package org.jeecg.modules.wms.iot.alertRule.controller;

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
import org.jeecg.modules.wms.iot.alertRule.entity.WmsIotAlertRule;
import org.jeecg.modules.wms.iot.alertRule.service.IWmsIotAlertRuleService;

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
 * @Description: 报警规则表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Tag(name="报警规则表")
@RestController
@RequestMapping("/iot/manage/alertRule")
@Slf4j
public class WmsIotAlertRuleController extends JeecgController<WmsIotAlertRule, IWmsIotAlertRuleService> {
	@Autowired
	private IWmsIotAlertRuleService wmsIotAlertRuleService;

	/**
	 * 分页列表查询
	 *
	 * @param wmsIotAlertRule
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	//@AutoLog(value = "报警规则表-分页列表查询")
	@Operation(summary="报警规则表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<IPage<WmsIotAlertRule>> queryPageList(WmsIotAlertRule wmsIotAlertRule,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<WmsIotAlertRule> queryWrapper = QueryGenerator.initQueryWrapper(wmsIotAlertRule, req.getParameterMap());
		Page<WmsIotAlertRule> page = new Page<WmsIotAlertRule>(pageNo, pageSize);
		IPage<WmsIotAlertRule> pageList = wmsIotAlertRuleService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	/**
	 *   添加
	 *
	 * @param wmsIotAlertRule
	 * @return
	 */
	@AutoLog(value = "报警规则表-添加")
	@Operation(summary="报警规则表-添加")
	@RequiresPermissions("iot:manage:alertRule:add")
	@PostMapping(value = "/add")
	public Result<String> add(@RequestBody WmsIotAlertRule wmsIotAlertRule) {
		wmsIotAlertRuleService.save(wmsIotAlertRule);
		return Result.OK("添加成功！");
	}

	/**
	 *  编辑
	 *
	 * @param wmsIotAlertRule
	 * @return
	 */
	@AutoLog(value = "报警规则表-编辑")
	@Operation(summary="报警规则表-编辑")
	@RequiresPermissions("iot:manage:alertRule:edit")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<String> edit(@RequestBody WmsIotAlertRule wmsIotAlertRule) {
		wmsIotAlertRuleService.updateById(wmsIotAlertRule);
		return Result.OK("编辑成功!");
	}

	/**
	 *   通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "报警规则表-通过id删除")
	@Operation(summary="报警规则表-通过id删除")
	@RequiresPermissions("iot:manage:alertRule:delete")
	@DeleteMapping(value = "/delete")
	public Result<String> delete(@RequestParam(name="id",required=true) String id) {
		wmsIotAlertRuleService.removeById(id);
		return Result.OK("删除成功!");
	}

	/**
	 *  批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "报警规则表-批量删除")
	@Operation(summary="报警规则表-批量删除")
	@RequiresPermissions("iot:manage:alertRule:deleteBatch")
	@DeleteMapping(value = "/deleteBatch")
	public Result<String> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.wmsIotAlertRuleService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功!");
	}

	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	//@AutoLog(value = "报警规则表-通过id查询")
	@Operation(summary="报警规则表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<WmsIotAlertRule> queryById(@RequestParam(name="id",required=true) String id) {
		WmsIotAlertRule wmsIotAlertRule = wmsIotAlertRuleService.getById(id);
		if(wmsIotAlertRule==null) {
			return Result.error("未找到对应数据");
		}
		return Result.OK(wmsIotAlertRule);
	}

    /**
    * 导出excel
    *
    * @param request
    * @param wmsIotAlertRule
    */
    @RequiresPermissions("iot:manage:alertRule:exportXls")
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, WmsIotAlertRule wmsIotAlertRule) {
        return super.exportXls(request, wmsIotAlertRule, WmsIotAlertRule.class, "报警规则表");
    }

    /**
      * 通过excel导入数据
    *
    * @param request
    * @param response
    * @return
    */
    @RequiresPermissions("iot:manage:alertRule:importExcel")
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, WmsIotAlertRule.class);
    }

}
