package com.stackroute.contentservice.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document
public class Content {


    @Id
    private int id;
    private String title;
    private String description;
    private String authorName;
    private String editorName;
    private String editorStatus;
    private String designerStatus;
    private String designerName;
    private String typeName;
    private Boolean selectHelper;
    private List<String> genres=new ArrayList<>();
    private List<Status> status=new ArrayList<>();
    private String  createdAt;
    private boolean isPlagarised;
    private boolean plagarismCheckDone;

}
