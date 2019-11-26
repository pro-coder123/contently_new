package com.stackroute.purchasingservice.repository;

import com.stackroute.purchasingservice.model.Purchase;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRepository extends MongoRepository<Purchase, Integer> {


    @Query("{'username' : ?0}")
    List<Purchase> findByUsername(String username);

    @Query("{'book_id' : ?0}")
    List<Purchase> findByBookId(int id);

}
