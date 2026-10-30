package org.jeecg.modules.wms.iot.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class IotWebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(iotWebSocketHandler(), "/iotwebsocket/{userId}")
                .setAllowedOrigins("*");
    }

    @Bean
    public IotWebSocketHandler iotWebSocketHandler() {
        return new IotWebSocketHandler();
    }
}
