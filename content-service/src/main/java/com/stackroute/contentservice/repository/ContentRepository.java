package com.stackroute.contentservice.repository;

import com.stackroute.contentservice.model.Content;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends MongoRepository<Content, Integer> {


    @Query("{'title' : ?0}")
    Content findByTitle(String title);


    @Query("{ $or: [ {'authorName' :  ?0 }, {'editorName' :  ?0 },{'designerName' :  ?0 } ] }")
    List<Content> findByName(String authorName);

}
