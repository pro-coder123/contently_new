package com.stackroute.contentservice.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentDTO {
    @Id
    private int id;
    private boolean isPlagCheckingDone;
    private boolean isPlagarized;
}
