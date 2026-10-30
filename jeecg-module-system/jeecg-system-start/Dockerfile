FROM registry.cn-hangzhou.aliyuncs.com/dockerhub_mirror/java:21-anolis

LABEL maintainer="鲜农仓-WMS" description="鲜农仓-农产品冷链仓储系统后端"

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /app

EXPOSE 8089

ADD ./target/jeecg-system-start-3.8.1.jar ./

CMD sleep 60;java -Djava.security.egd=file:/dev/./urandom -jar jeecg-system-start-3.8.1.jar