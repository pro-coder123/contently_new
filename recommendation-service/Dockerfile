FROM adoptopenjdk/openjdk11-openj9:alpine-jre
ADD ./target/SpringNeo4j-0.0.1-SNAPSHOT.jar /usr/src/SpringNeo4j-0.0.1-SNAPSHOT.jar
WORKDIR usr/src
ENTRYPOINT ["java","-jar", "SpringNeo4j-0.0.1-SNAPSHOT.jar"]
