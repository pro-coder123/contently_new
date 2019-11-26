package com.stackroute.purchasingservice.service;


import com.stackroute.purchasingservice.model.Purchase;
import com.stackroute.purchasingservice.sequence.Custom;
import com.stackroute.purchasingservice.exceptions.InternalServerErrorException;
import com.stackroute.purchasingservice.exceptions.NullValueFieldException;
import com.stackroute.purchasingservice.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;
    @Autowired
    private MongoOperations mongo;

    public Purchase savePurchase(Purchase purchase) throws NullValueFieldException,InternalServerErrorException {

        try {
            Purchase u = purchaseRepository.save(purchase);
            return u;
        }catch (Exception e){
            throw new InternalServerErrorException();
        }

    }

   public List<Purchase> findByUsername(String username) throws InternalServerErrorException {
        try {
            return purchaseRepository.findByUsername(username);
        }
        catch(Exception ex){
            throw new InternalServerErrorException();
        }
    }

    public boolean findByBookId(int id,String username) throws InternalServerErrorException
    {
        try
        {
            List<Purchase> purchaseList= purchaseRepository.findByBookId((id));
            if(purchaseList!=null){
                for (Purchase purchase:purchaseList){
                    if(purchase.getUsername().equals(username)){
                        return true;
                    }
                }
            }
            return false;
        }
        catch (Exception e)
        {
            throw new InternalServerErrorException();
        }



    }


    public int getNextSequence(String seqName)
        {
            Custom counter = mongo.findAndModify(
                    query(where("_id").is(seqName)),
                    new Update().inc("seq",1),
                    options().returnNew(true).upsert(true),
                    Custom.class);
            return counter.getSeq();
        }

}
