package org.jeecg.modules.wms.goods.controller;

import java.util.Arrays;
import java.util.List;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jeecg.common.api.vo.Result;
import org.jeecg.modules.wms.goods.entity.WmsProductCategories;
import org.jeecg.modules.wms.goods.service.IWmsProductCategoriesService;
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
 * @Description: 农产品类别表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Tag(name="农产品类别表")
@RestController
@RequestMapping("/goods/wmsProductCategories")
@Slf4j
public class WmsProductCategoriesController extends JeecgController<WmsProductCategories, IWmsProductCategoriesService> {
	@Autowired
	private IWmsProductCategoriesService wmsProductCategoriesService;

	/**
	 * 树形列表查询（一次性返回全部，前端按 children 渲染）
	 *
	 * @return
	 */
	@Operation(summary="农产品类别表-树形列表查询")
	@GetMapping(value = "/list")
	public Result<List<WmsProductCategories>> queryTreeList() {
		List<WmsProductCategories> tree = wmsProductCategoriesService.queryTreeList();
		return Result.OK(tree);
	}

	/**
	 *   添加
	 *
	 * @param wmsProductCategories
	 * @return
	 */
	@AutoLog(value = "农产品类别表-添加")
	@Operation(summary="农产品类别表-添加")
	@RequiresPermissions("goods:wms_product_categories:add")
	@PostMapping(value = "/add")
	public Result<String> add(@RequestBody WmsProductCategories wmsProductCategories) {
		wmsProductCategoriesService.add(wmsProductCategories);
		return Result.OK("添加成功！");
	}

	/**
	 *  编辑
	 *
	 * @param wmsProductCategories
	 * @return
	 */
	@AutoLog(value = "农产品类别表-编辑")
	@Operation(summary="农产品类别表-编辑")
	@RequiresPermissions("goods:wms_product_categories:edit")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<String> edit(@RequestBody WmsProductCategories wmsProductCategories) {
		wmsProductCategoriesService.updateById(wmsProductCategories);
		return Result.OK("编辑成功!");
	}

	/**
	 *   通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "农产品类别表-通过id删除")
	@Operation(summary="农产品类别表-通过id删除")
	@RequiresPermissions("goods:wms_product_categories:delete")
	@DeleteMapping(value = "/delete")
	public Result<String> delete(@RequestParam(name="id",required=true) String id) {
		wmsProductCategoriesService.removeById(id);
		return Result.OK("删除成功!");
	}

	/**
	 *  批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "农产品类别表-批量删除")
	@Operation(summary="农产品类别表-批量删除")
	@RequiresPermissions("goods:wms_product_categories:deleteBatch")
	@DeleteMapping(value = "/deleteBatch")
	public Result<String> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.wmsProductCategoriesService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功!");
	}

	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	@Operation(summary="农产品类别表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<WmsProductCategories> queryById(@RequestParam(name="id",required=true) String id) {
		WmsProductCategories wmsProductCategories = wmsProductCategoriesService.getById(id);
		if(wmsProductCategories==null) {
			return Result.error("未找到对应数据");
		}
		return Result.OK(wmsProductCategories);
	}

    /**
    * 导出excel
    *
    * @param request
    * @param wmsProductCategories
    */
    @RequiresPermissions("goods:wms_product_categories:exportXls")
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, WmsProductCategories wmsProductCategories) {
        return super.exportXls(request, wmsProductCategories, WmsProductCategories.class, "农产品类别表");
    }

    /**
      * 通过excel导入数据
    *
    * @param request
    * @param response
    * @return
    */
    @RequiresPermissions("goods:wms_product_categories:importExcel")
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, WmsProductCategories.class);
    }

}
