FROM azul/zulu-openjdk:17-latest as build
WORKDIR /tmp
COPY agent/ agent/
RUN cd agent && ./gradlew bootJar

FROM azul/zulu-openjdk:17-latest as run
WORKDIR /app
COPY --from=build /tmp/agent/build/libs/agent.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
