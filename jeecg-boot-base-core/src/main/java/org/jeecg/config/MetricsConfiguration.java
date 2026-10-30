package org.jeecg.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.jvm.ClassLoaderMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmCompilationMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmGcMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmHeapPressureMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmInfoMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmThreadDeadlockMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmThreadMetrics;
import io.micrometer.core.instrument.binder.system.FileDescriptorMetrics;
import io.micrometer.core.instrument.binder.system.ProcessorMetrics;
import io.micrometer.core.instrument.binder.system.UptimeMetrics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 手动将 JVM/系统级 MeterBinder 绑定到 MeterRegistry。
 * <p>
 * Spring Boot 3.x 的 JvmMetricsAutoConfiguration / SystemMetricsAutoConfiguration /
 * ProcessMetricsAutoConfiguration 要么条件不满足要么被移除，导致 /actuator/metrics
 * 端点没有 JVM、CPU、线程、GC 等关键指标。
 * <p>
 * 这里通过 ApplicationRunner 在应用启动后显式 bindTo 所有 binder，
 * 绕过 Spring Boot auto-config 的条件判断。
 */
@Component
public class MetricsConfiguration implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(MetricsConfiguration.class);

    @Autowired(required = false)
    private MeterRegistry meterRegistry;

    @Override
    public void run(ApplicationArguments args) {
        if (meterRegistry == null) {
            log.warn("[Metrics] MeterRegistry Bean 不存在！无法绑定 JVM/系统 binder");
            return;
        }
        log.info("[Metrics] 开始绑定 JVM/系统级 MeterBinder 到 MeterRegistry (当前 meters={})",
                meterRegistry.getMeters().size());

        // JVM 指标
        new JvmMemoryMetrics().bindTo(meterRegistry);
        new JvmThreadMetrics().bindTo(meterRegistry);
        new JvmThreadDeadlockMetrics().bindTo(meterRegistry);
        new JvmGcMetrics().bindTo(meterRegistry);
        new JvmHeapPressureMetrics().bindTo(meterRegistry);
        new JvmCompilationMetrics().bindTo(meterRegistry);
        new ClassLoaderMetrics().bindTo(meterRegistry);
        new JvmInfoMetrics().bindTo(meterRegistry);

        // 系统指标（CPU/文件描述符/uptime）
        new ProcessorMetrics().bindTo(meterRegistry);
        new FileDescriptorMetrics().bindTo(meterRegistry);
        new UptimeMetrics().bindTo(meterRegistry);

        log.info("[Metrics] ✅ 绑定完成，metrics 总数={}", meterRegistry.getMeters().size());
    }
}
