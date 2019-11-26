FROM adoptopenjdk/openjdk11-openj9:alpine-jre
ADD ./target/purchasing-service-0.0.1-SNAPSHOT.jar /usr/src/purchasing-service-0.0.1-SNAPSHOT.jar
WORKDIR usr/src
ENTRYPOINT ["java","-jar", "purchasing-service-0.0.1-SNAPSHOT.jar"]
