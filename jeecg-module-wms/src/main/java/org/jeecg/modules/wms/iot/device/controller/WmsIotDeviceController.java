package org.jeecg.modules.wms.iot.device.controller;

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
import org.jeecg.modules.wms.iot.device.entity.WmsIotDevice;
import org.jeecg.modules.wms.iot.device.service.IWmsIotDeviceService;

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
 * @Description: IoT设备表
 * @Author: jeecg-boot
 * @Date:   2026-10-28
 * @Version: V1.0
 */
@Tag(name="IoT设备表")
@RestController
@RequestMapping("/iot/manage/device")
@Slf4j
public class WmsIotDeviceController extends JeecgController<WmsIotDevice, IWmsIotDeviceService> {
	@Autowired
	private IWmsIotDeviceService wmsIotDeviceService;

	/**
	 * 分页列表查询
	 *
	 * @param wmsIotDevice
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	//@AutoLog(value = "IoT设备表-分页列表查询")
	@Operation(summary="IoT设备表-分页列表查询")
	@GetMapping(value = "/list")
	public Result<IPage<WmsIotDevice>> queryPageList(WmsIotDevice wmsIotDevice,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<WmsIotDevice> queryWrapper = QueryGenerator.initQueryWrapper(wmsIotDevice, req.getParameterMap());
		Page<WmsIotDevice> page = new Page<WmsIotDevice>(pageNo, pageSize);
		IPage<WmsIotDevice> pageList = wmsIotDeviceService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	/**
	 *   添加
	 *
	 * @param wmsIotDevice
	 * @return
	 */
	@AutoLog(value = "IoT设备表-添加")
	@Operation(summary="IoT设备表-添加")
	@RequiresPermissions("iot:manage:device:add")
	@PostMapping(value = "/add")
	public Result<String> add(@RequestBody WmsIotDevice wmsIotDevice) {
		wmsIotDeviceService.save(wmsIotDevice);
		return Result.OK("添加成功！");
	}

	/**
	 *  编辑
	 *
	 * @param wmsIotDevice
	 * @return
	 */
	@AutoLog(value = "IoT设备表-编辑")
	@Operation(summary="IoT设备表-编辑")
	@RequiresPermissions("iot:manage:device:edit")
	@RequestMapping(value = "/edit", method = {RequestMethod.PUT,RequestMethod.POST})
	public Result<String> edit(@RequestBody WmsIotDevice wmsIotDevice) {
		wmsIotDeviceService.updateById(wmsIotDevice);
		return Result.OK("编辑成功!");
	}

	/**
	 *   通过id删除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "IoT设备表-通过id删除")
	@Operation(summary="IoT设备表-通过id删除")
	@RequiresPermissions("iot:manage:device:delete")
	@DeleteMapping(value = "/delete")
	public Result<String> delete(@RequestParam(name="id",required=true) String id) {
		wmsIotDeviceService.removeById(id);
		return Result.OK("删除成功!");
	}

	/**
	 *  批量删除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "IoT设备表-批量删除")
	@Operation(summary="IoT设备表-批量删除")
	@RequiresPermissions("iot:manage:device:deleteBatch")
	@DeleteMapping(value = "/deleteBatch")
	public Result<String> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.wmsIotDeviceService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量删除成功!");
	}

	/**
	 * 通过id查询
	 *
	 * @param id
	 * @return
	 */
	//@AutoLog(value = "IoT设备表-通过id查询")
	@Operation(summary="IoT设备表-通过id查询")
	@GetMapping(value = "/queryById")
	public Result<WmsIotDevice> queryById(@RequestParam(name="id",required=true) String id) {
		WmsIotDevice wmsIotDevice = wmsIotDeviceService.getById(id);
		if(wmsIotDevice==null) {
			return Result.error("未找到对应数据");
		}
		return Result.OK(wmsIotDevice);
	}

    /**
    * 导出excel
    *
    * @param request
    * @param wmsIotDevice
    */
    @RequiresPermissions("iot:manage:device:exportXls")
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, WmsIotDevice wmsIotDevice) {
        return super.exportXls(request, wmsIotDevice, WmsIotDevice.class, "IoT设备表");
    }

    /**
      * 通过excel导入数据
    *
    * @param request
    * @param response
    * @return
    */
    @RequiresPermissions("iot:manage:device:importExcel")
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, WmsIotDevice.class);
    }

}
