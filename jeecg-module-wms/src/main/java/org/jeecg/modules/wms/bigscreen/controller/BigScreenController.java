package org.jeecg.modules.wms.bigscreen.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.jeecg.common.api.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 首页大屏数据接口（真实业务数据）
 */
@Tag(name = "首页大屏")
@RestController
@RequestMapping("/bigscreen")
@Slf4j
public class BigScreenController {

    @Autowired
    @Qualifier("bigScreenJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    /**
     * 待办任务卡片：待收货、待上架、待拣货、待打包
     */
    @Operation(summary = "大屏-待办任务")
    @GetMapping("/todo-tasks")
    public Result<Map<String, Object>> todoTasks(@RequestParam(name = "warehouseId", required = false) String warehouseId) {
        long receiving = countTasks("RECEIVING_TASK", warehouseId);
        long putaway = countTasks("PUTAWAY_TASK", warehouseId);
        long picking = countTasks("PICKING_TASK", warehouseId);
        long packing = countOutOrders("PICKED", warehouseId);

        List<Map<String, Object>> taskCards = new ArrayList<>();
        taskCards.add(card("待收货任务", "visit-count|svg", receiving));
        taskCards.add(card("待上架任务", "total-sales|svg", putaway));
        taskCards.add(card("待拣货任务", "download-count|svg", picking));

        Map<String, Object> packCard = card("待打包数", "transaction|svg", packing);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("taskCards", taskCards);
        result.put("packCard", packCard);
        return Result.OK(result);
    }

    /**
     * 入库趋势：按月份统计入库单数量
     */
    @Operation(summary = "大屏-入库趋势")
    @GetMapping("/in-order-trend")
    public Result<List<Map<String, Object>>> inOrderTrend(@RequestParam(name = "warehouseId", required = false) String warehouseId) {
        String sql = "SELECT DATE_FORMAT(create_time, '%Y-%m') AS ym, COUNT(*) AS cnt FROM wms_stock_in_orders"
                + (isEmpty(warehouseId) ? "" : " WHERE warehouse_id = ?")
                + " GROUP BY DATE_FORMAT(create_time, '%Y-%m') ORDER BY ym DESC LIMIT 12";
        List<Map<String, Object>> rows = isEmpty(warehouseId)
                ? jdbcTemplate.queryForList(sql)
                : jdbcTemplate.queryForList(sql, warehouseId);
        return Result.OK(toTrend(rows));
    }

    /**
     * 出库趋势：按月份统计出库单数量
     */
    @Operation(summary = "大屏-出库趋势")
    @GetMapping("/out-order-trend")
    public Result<List<Map<String, Object>>> outOrderTrend(@RequestParam(name = "warehouseId", required = false) String warehouseId) {
        String sql = "SELECT DATE_FORMAT(create_time, '%Y-%m') AS ym, COUNT(*) AS cnt FROM wms_out_orders"
                + (isEmpty(warehouseId) ? "" : " WHERE warehouse_id = ?")
                + " GROUP BY DATE_FORMAT(create_time, '%Y-%m') ORDER BY ym DESC LIMIT 12";
        List<Map<String, Object>> rows = isEmpty(warehouseId)
                ? jdbcTemplate.queryForList(sql)
                : jdbcTemplate.queryForList(sql, warehouseId);
        return Result.OK(toTrend(rows));
    }

    /**
     * 货主出库量排行
     */
    @Operation(summary = "大屏-货主出库排行")
    @GetMapping("/owner-rank")
    public Result<List<Map<String, Object>>> ownerRank(@RequestParam(name = "warehouseId", required = false) String warehouseId) {
        String sql = "SELECT o.owner_id AS ownerId, COALESCE(c.owner_name, o.owner_id) AS ownerName, COUNT(*) AS cnt"
                + " FROM wms_out_orders o LEFT JOIN wms_cargo_owners c ON o.owner_id = c.id"
                + (isEmpty(warehouseId) ? "" : " WHERE o.warehouse_id = ?")
                + " GROUP BY o.owner_id, c.owner_name ORDER BY cnt DESC LIMIT 5";
        List<Map<String, Object>> rows = isEmpty(warehouseId)
                ? jdbcTemplate.queryForList(sql)
                : jdbcTemplate.queryForList(sql, warehouseId);
        List<Map<String, Object>> ranks = new ArrayList<>();
        for (Map<String, Object> row : rows) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", row.get("ownerName"));
            item.put("total", ((Number) row.get("cnt")).intValue());
            ranks.add(item);
        }
        return Result.OK(ranks);
    }

    /**
     * 库存预警：低于安全库存、临期、已过效期
     */
    @Operation(summary = "大屏-库存预警")
    @GetMapping("/inventory-alert")
    public Result<List<Map<String, Object>>> inventoryAlert(@RequestParam(name = "warehouseId", required = false) String warehouseId) {
        String sql = "SELECT i.product_id AS productId, p.product_code AS productCode, p.product_name AS productName,"
                + " w.warehouse_name AS warehouseName, i.batch_number AS batchNumber,"
                + " i.available_quantity AS availableQuantity, i.expiry_date AS expiryDate"
                + " FROM wms_inventory i LEFT JOIN wms_products p ON i.product_id = p.id"
                + " LEFT JOIN wms_warehouses w ON i.warehouse_id = w.id"
                + " WHERE (i.available_quantity < 100 OR (i.expiry_date IS NOT NULL AND i.expiry_date < DATE_ADD(CURDATE(), INTERVAL 30 DAY)))"
                + (isEmpty(warehouseId) ? "" : " AND i.warehouse_id = ?")
                + " ORDER BY i.available_quantity ASC, i.expiry_date ASC LIMIT 20";
        List<Map<String, Object>> rows = isEmpty(warehouseId)
                ? jdbcTemplate.queryForList(sql)
                : jdbcTemplate.queryForList(sql, warehouseId);

        List<Map<String, Object>> alerts = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (Map<String, Object> row : rows) {
            Object expiry = row.get("expiryDate");
            LocalDate expiryDate = null;
            if (expiry instanceof java.sql.Date) {
                expiryDate = ((java.sql.Date) expiry).toLocalDate();
            } else if (expiry instanceof Timestamp) {
                expiryDate = ((Timestamp) expiry).toLocalDateTime().toLocalDate();
            } else if (expiry instanceof LocalDateTime) {
                expiryDate = ((LocalDateTime) expiry).toLocalDate();
            }
            int available = row.get("availableQuantity") == null ? 0 : ((Number) row.get("availableQuantity")).intValue();

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("productCode", row.get("productCode"));
            item.put("productName", row.get("productName"));
            item.put("warehouseName", row.get("warehouseName"));
            item.put("batchNumber", row.get("batchNumber"));
            item.put("availableQuantity", available);
            item.put("alertType", alertType(expiryDate, available, today));
            item.put("alertDate", expiryDate == null ? "" : expiryDate.toString());
            alerts.add(item);
        }
        return Result.OK(alerts);
    }

    /**
     * 按任务类型统计未完成任务数
     */
    private long countTasks(String taskType, String warehouseId) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM wms_tasks WHERE task_type = ? AND task_status = 'CREATED'");
        if (!isEmpty(warehouseId)) {
            sql.append(" AND (target_warehouse_id = ? OR source_warehouse_id = ?)");
            return jdbcTemplate.queryForObject(sql.toString(), Long.class, taskType, warehouseId, warehouseId);
        }
        return jdbcTemplate.queryForObject(sql.toString(), Long.class, taskType);
    }

    /**
     * 按状态统计出库单数量
     */
    private long countOutOrders(String status, String warehouseId) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM wms_out_orders WHERE status = ?");
        if (isEmpty(warehouseId)) {
            return jdbcTemplate.queryForObject(sql.toString(), Long.class, status);
        }
        sql.append(" AND warehouse_id = ?");
        return jdbcTemplate.queryForObject(sql.toString(), Long.class, status, warehouseId);
    }

    private Map<String, Object> card(String title, String icon, long count) {
        Map<String, Object> card = new LinkedHashMap<>();
        card.put("title", title);
        card.put("icon", icon);
        card.put("value", count);
        card.put("total", count);
        card.put("action", "当天");
        return card;
    }

    /**
     * 月份倒序结果转为升序的 {name, value}
     */
    private List<Map<String, Object>> toTrend(List<Map<String, Object>> rows) {
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = rows.size() - 1; i >= 0; i--) {
            Map<String, Object> row = rows.get(i);
            String ym = String.valueOf(row.get("ym"));
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("name", ym.length() >= 2 ? Integer.parseInt(ym.substring(ym.length() - 2)) + "月" : ym);
            item.put("value", ((Number) row.get("cnt")).intValue());
            trend.add(item);
        }
        return trend;
    }

    private String alertType(LocalDate expiryDate, int available, LocalDate today) {
        if (expiryDate != null && expiryDate.isBefore(today)) {
            return "已过效期";
        }
        if (expiryDate != null && !expiryDate.isAfter(today.plusDays(30))) {
            return "近效期预警";
        }
        return available < 100 ? "低于安全库存" : "正常";
    }

    private boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}
