FROM eclipse-temurin:25-jdk-noble AS build
WORKDIR /workspace/backend

COPY backend/mvnw ./mvnw
COPY backend/.mvn ./.mvn
COPY backend/pom.xml ./pom.xml
COPY openapi ../openapi

RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

COPY backend/src ./src
RUN ./mvnw -B -DskipTests package && \
    java -Djarmode=tools -jar target/*.jar extract --layers --launcher --destination target/extracted

FROM eclipse-temurin:25-jre-noble
WORKDIR /app

RUN groupadd --system --gid 1001 spring && \
    useradd --system --uid 1001 --gid spring spring

COPY --from=build --chown=spring:spring /workspace/backend/target/extracted/dependencies/ ./
COPY --from=build --chown=spring:spring /workspace/backend/target/extracted/spring-boot-loader/ ./
COPY --from=build --chown=spring:spring /workspace/backend/target/extracted/snapshot-dependencies/ ./
COPY --from=build --chown=spring:spring /workspace/backend/target/extracted/application/ ./

USER spring
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
