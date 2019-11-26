package com.stackroute.recommendation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class SpringNeo4jApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringNeo4jApplication.class, args);
	}

}
