package com.stackroute.purchasingservice.service;

import com.stackroute.purchasingservice.exceptions.GlobalExceptionHandler;
import com.stackroute.purchasingservice.exceptions.InternalServerErrorException;
import com.stackroute.purchasingservice.model.Purchase;
import com.stackroute.purchasingservice.repository.PurchaseRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

public class ServiceTest {


    Purchase purchase;

    @Mock
    PurchaseRepository purchaseRepository;

    @InjectMocks
    PurchaseServiceImpl purchaseService;
    @Before
    public void setUp() {

        MockitoAnnotations.initMocks(this);
        purchase = new Purchase();
        purchase.setId(123);
        purchase.setBook_id(111);


    }
    @Test
    public void savePurchaseTestSuccess() throws InternalServerErrorException {

        when(purchaseRepository.save(any())).thenReturn(purchase);


    }

    @Test(expected = InternalServerErrorException.class)
    public void savePurchaseTestFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }
    @Test
    public void findPurchaseTestSuccess() throws InternalServerErrorException {

        when(purchaseRepository.findByUsername(any())).thenReturn(anyList());

        purchaseService.findByUsername("Varun");


        verify(purchaseRepository,times(1)).findByUsername("Varun");



    }

    @Test(expected = InternalServerErrorException.class)
    public void findPurchaseTestFailure() throws InternalServerErrorException {
        throw new InternalServerErrorException();
    }

}
