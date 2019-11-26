package com.stackroute.recommendation.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@NodeEntity
public class User {
    @Id @GeneratedValue
    private Long id;
    private String name;
    double cost;
    int exp;



}
