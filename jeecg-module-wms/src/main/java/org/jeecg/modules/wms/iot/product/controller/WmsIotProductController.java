package org.jeecg.modules.wms.iot.product.controller;

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
import org.jeecg.modules.wms.iot.product.entity.WmsIotProduct;
import org.jeecg.modules.wms.iot.product.service.IWmsIotProductService;

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
 * @Description: IoT产品表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Tag(name="IoT产品表")
@RestController
@RequestMapping("/iot/manage/product")
@Slf4j
public class WmsIotProductController extends JeecgController<WmsIotProduct, IWmsIotProductService> {
	@Autowired
	private IWmsIotProductService wmsIotProductService;

	/**
	 * 分页列表查询
	 *
	 * @param wmsIotProduct
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	//@AutoLog(value = "IoT产品表-分页列表查询")
	@Operation(summary="IoT产品表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<IPage<WmsIotProduct>> queryPageList(WmsIotProduct wmsIotProduct,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<WmsIotProduct> queryWrapper = QueryGenerator.initQueryWrapper(wmsIotProduct, req.getParameterMap());
		Page<WmsIotProduct> page = new Page<WmsIotProduct>(pageNo, pageSize);
		IPage<WmsIotProduct> pageList = wmsIotProductService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	/**
	 *   添加
	 *
	 * @param wmsIotProduct
	 * @return
	 */
	@AutoLog(value = "IoT产品表-添加")
	@Operation(summary="IoT产品表-添加")
	@RequiresPermissions("iot:manage:product:add")
	@PostMapping(value = "/add")
	public Result<String> add(@RequestBody WmsIotProduct wmsIotProduct) {
		wmsIotProductService.save(wmsIotProduct);
		return Result.OK("添加成功！");
	}

	/**
	 *  编辑
	 *
	 * @param wmsIotProduct
	 * @return
	 */
	@AutoLog(value = "IoT产品表-编辑")
	@Operation(summary="IoT产品表-编辑")
	@RequiresPermissions("iot:manage:product:edit")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<String> edit(@RequestBody WmsIotProduct wmsIotProduct) {
		wmsIotProductService.updateById(wmsIotProduct);
		return Result.OK("编辑成功!");
	}

	/**
	 *   通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "IoT产品表-通过id删除")
	@Operation(summary="IoT产品表-通过id删除")
	@RequiresPermissions("iot:manage:product:delete")
	@DeleteMapping(value = "/delete")
	public Result<String> delete(@RequestParam(name="id",required=true) String id) {
		wmsIotProductService.removeById(id);
		return Result.OK("删除成功!");
	}

	/**
	 *  批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "IoT产品表-批量删除")
	@Operation(summary="IoT产品表-批量删除")
	@RequiresPermissions("iot:manage:product:deleteBatch")
	@DeleteMapping(value = "/deleteBatch")
	public Result<String> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.wmsIotProductService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功!");
	}

	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	//@AutoLog(value = "IoT产品表-通过id查询")
	@Operation(summary="IoT产品表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<WmsIotProduct> queryById(@RequestParam(name="id",required=true) String id) {
		WmsIotProduct wmsIotProduct = wmsIotProductService.getById(id);
		if(wmsIotProduct==null) {
			return Result.error("未找到对应数据");
		}
		return Result.OK(wmsIotProduct);
	}

    /**
    * 导出excel
    *
    * @param request
    * @param wmsIotProduct
    */
    @RequiresPermissions("iot:manage:product:exportXls")
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, WmsIotProduct wmsIotProduct) {
        return super.exportXls(request, wmsIotProduct, WmsIotProduct.class, "IoT产品表");
    }

    /**
      * 通过excel导入数据
    *
    * @param request
    * @param response
    * @return
    */
    @RequiresPermissions("iot:manage:product:importExcel")
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, WmsIotProduct.class);
    }

}
