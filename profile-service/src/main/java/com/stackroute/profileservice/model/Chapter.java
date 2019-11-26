package com.stackroute.profileservice.model;

import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapter {
    private int bookId;
    private int chapterIndex;
    private boolean releaseNext = false;
    private Date date;
}
