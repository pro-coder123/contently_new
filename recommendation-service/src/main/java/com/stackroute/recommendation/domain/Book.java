package com.stackroute.recommendation.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@NodeEntity
public class Book {



    @Id@GeneratedValue
    private Long id;
    private Long bookId;
    private String bookName;
    private double bookPrice;
    private int nop;





}
