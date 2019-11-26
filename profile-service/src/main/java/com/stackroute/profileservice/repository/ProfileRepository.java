package com.stackroute.profileservice.repository;

import com.stackroute.profileservice.model.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileRepository extends MongoRepository<Profile,Integer> {

    @Query("{'username' : ?0}")
    Profile findByName(String title);

    @Query("{'role' : ?0}")
    List<Profile> findByRole(String role);

}
