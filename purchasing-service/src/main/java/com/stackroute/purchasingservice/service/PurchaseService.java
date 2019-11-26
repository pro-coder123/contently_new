package com.stackroute.purchasingservice.service;

import com.stackroute.purchasingservice.exceptions.InternalServerErrorException;
import com.stackroute.purchasingservice.exceptions.NullValueFieldException;
import com.stackroute.purchasingservice.model.Purchase;

import java.util.List;


public interface PurchaseService {

    Purchase savePurchase(Purchase purchase) throws NullValueFieldException,InternalServerErrorException;

    List<Purchase> findByUsername(String username) throws InternalServerErrorException;


    boolean findByBookId(int id,String username) throws InternalServerErrorException;


    int getNextSequence(String seq);
}
