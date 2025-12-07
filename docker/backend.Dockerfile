FROM mysql:8.0
RUN microdnf -y update && microdnf -y install java-1.8.0-openjdk-headless && microdnf clean all || \
    (dnf -y update && dnf -y install java-1.8.0-openjdk-headless && dnf clean all)
WORKDIR /app
COPY backend/target/backend-1.0.0.jar app.jar
ENV JAVA_OPTS=""
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
