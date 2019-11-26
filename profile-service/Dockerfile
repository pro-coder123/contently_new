FROM adoptopenjdk/openjdk11-openj9:alpine-jre
ADD ./target/profile-service-0.0.1-SNAPSHOT.jar /usr/src/profile-service-0.0.1-SNAPSHOT.jar
WORKDIR usr/src
ENTRYPOINT ["java","-jar", "profile-service-0.0.1-SNAPSHOT.jar"]