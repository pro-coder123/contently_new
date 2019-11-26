package com.stackroute.recommendation.domain;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchasingDto {


    @Id
    int id;
    int book_id;
    String username;

}

