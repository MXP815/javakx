package org.jeecg.modules.wms.bigscreen.config;

import com.baomidou.dynamic.datasource.DynamicRoutingDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

/**
 * 大屏统计专用 JdbcTemplate：显式绑定 master（MySQL 业务库）
 * 避免与 airag 模块的 vectorJdbcTemplate（PostgreSQL）冲突
 */
@Configuration
public class BigScreenJdbcConfig {

    @Bean("bigScreenJdbcTemplate")
    public JdbcTemplate bigScreenJdbcTemplate(DataSource dataSource) {
        if (dataSource instanceof DynamicRoutingDataSource routingDataSource) {
            DataSource master = routingDataSource.getDataSource("master");
            if (master != null) {
                return new JdbcTemplate(master);
            }
        }
        return new JdbcTemplate(dataSource);
    }
}
