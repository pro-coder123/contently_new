package com.stackroute.publicationservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class PublicationsDto {

    int id;
    String title;
    String description;
    String  authorName;
    String  editorName;
    String designerName;
    String typeName;
    List<String> genres;
    double price;
    String publishedAt;
    int noOfPurchases;
    double rating;

}
