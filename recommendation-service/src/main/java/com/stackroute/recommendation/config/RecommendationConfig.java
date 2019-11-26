package com.stackroute.recommendation.config;

import com.stackroute.recommendation.domain.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RecommendationConfig {

    @Bean
    public User getUser()
    {
        return new User();
    }
}
