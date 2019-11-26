FROM openjdk:11
ADD ./target/demo-0.0.1-SNAPSHOT.jar /usr/src/demo-0.0.1-SNAPSHOT.jar
ADD ./Plagiarism-Checker /usr/src/Plagiarism-Checker
WORKDIR usr/src
ENTRYPOINT ["java","-jar", "/usr/src/demo-0.0.1-SNAPSHOT.jar"]
RUN apt-get update && apt-get install -y python-pip
RUN pip install docx requests futures
