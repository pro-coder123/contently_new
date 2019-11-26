package com.stackroute.recommendation.domain;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicationsDto {

    int id;
    String title;
    String description;
    String  authorName;
    String editorName;   // list of userId of editors
    String designerName; // list of userId of designer
    String typeName;
    List<String> genres;
    double price;
    String publishedAt;
    int noOfPurchases;
    double rating;

}
