package org.jeecg.modules.wms.goods.controller;

import java.util.Arrays;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.modules.wms.goods.entity.WmsProductBrand;
import org.jeecg.modules.wms.goods.service.IWmsProductBrandService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.system.base.controller.JeecgController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.jeecg.common.aspect.annotation.AutoLog;
import org.apache.shiro.authz.annotation.RequiresPermissions;

 /**
 * @Description: 产地品牌表
 * @Author: jeecg-boot
 * @Date:   2026-10-30
 * @Version: V1.0
 */
@Tag(name="产地品牌表")
@RestController
@RequestMapping("/goods/wmsProductBrand")
@Slf4j
public class WmsProductBrandController extends JeecgController<WmsProductBrand, IWmsProductBrandService> {
	@Autowired
	private IWmsProductBrandService wmsProductBrandService;

	/**
	 * 分页列表查询
	 *
	 * @param pageNo
	 * @param pageSize
	 * @param wmsProductBrand
	 * @return
	 */
	@Operation(summary="产地品牌表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<IPage<WmsProductBrand>> queryPageList(WmsProductBrand wmsProductBrand,
													   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
													   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
													   HttpServletRequest req) {
		QueryWrapper<WmsProductBrand> queryWrapper = QueryGenerator.initQueryWrapper(wmsProductBrand, req.getParameterMap());
		Page<WmsProductBrand> page = new Page<WmsProductBrand>(pageNo, pageSize);
		IPage<WmsProductBrand> pageList = wmsProductBrandService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	/**
	 *   添加
	 *
	 * @param wmsProductBrand
	 * @return
	 */
	@AutoLog(value = "产地品牌表-添加")
	@Operation(summary="产地品牌表-添加")
	@RequiresPermissions("goods:wms_product_brand:add")
	@PostMapping(value = "/add")
	public Result<String> add(@RequestBody WmsProductBrand wmsProductBrand) {
		wmsProductBrandService.save(wmsProductBrand);
		return Result.OK("添加成功！");
	}

	/**
	 *  编辑
	 *
	 * @param wmsProductBrand
	 * @return
	 */
	@AutoLog(value = "产地品牌表-编辑")
	@Operation(summary="产地品牌表-编辑")
	@RequiresPermissions("goods:wms_product_brand:edit")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<String> edit(@RequestBody WmsProductBrand wmsProductBrand) {
		wmsProductBrandService.updateById(wmsProductBrand);
		return Result.OK("编辑成功!");
	}

	/**
	 *   通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "产地品牌表-通过id删除")
	@Operation(summary="产地品牌表-通过id删除")
	@RequiresPermissions("goods:wms_product_brand:delete")
	@DeleteMapping(value = "/delete")
	public Result<String> delete(@RequestParam(name="id",required=true) String id) {
		wmsProductBrandService.removeById(id);
		return Result.OK("删除成功!");
	}

	/**
	 *  批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "产地品牌表-批量删除")
	@Operation(summary="产地品牌表-批量删除")
	@RequiresPermissions("goods:wms_product_brand:deleteBatch")
	@DeleteMapping(value = "/deleteBatch")
	public Result<String> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.wmsProductBrandService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功!");
	}

	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@Operation(summary="产地品牌表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<WmsProductBrand> queryById(@RequestParam(name="id",required=true) String id) {
		WmsProductBrand wmsProductBrand = wmsProductBrandService.getById(id);
		if(wmsProductBrand==null) {
			return Result.error("未找到对应数据");
		}
		return Result.OK(wmsProductBrand);
	}

    /**
    * 导出excel
    *
    * @param request
    * @param wmsProductBrand
    */
    @RequiresPermissions("goods:wms_product_brand:exportXls")
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, WmsProductBrand wmsProductBrand) {
        return super.exportXls(request, wmsProductBrand, WmsProductBrand.class, "产地品牌表");
    }

    /**
      * 通过excel导入数据
    *
    * @param request
    * @param response
    * @return
    */
    @RequiresPermissions("goods:wms_product_brand:importExcel")
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, WmsProductBrand.class);
    }

}
