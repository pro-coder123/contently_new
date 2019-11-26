package com.stackroute.recommendation.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@NodeEntity
public class Type {
    @Id
    @GeneratedValue
    Long id;
    String name;
}