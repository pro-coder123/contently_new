package com.stackroute.purchasingservice.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackroute.purchasingservice.Payment.StripeClient;
import com.stackroute.purchasingservice.exceptions.GlobalExceptionHandler;
import com.stackroute.purchasingservice.exceptions.InternalServerErrorException;
import com.stackroute.purchasingservice.model.Purchase;
import com.stackroute.purchasingservice.service.PurchaseService;
import com.stackroute.purchasingservice.service.RabbitMQSender;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@WebMvcTest
public class ControllerTest {



    Purchase purchase;

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private PurchaseService purchaseService;

    @MockBean
    private RabbitMQSender rabbitMQSender;

    @MockBean
    private StripeClient stripeClient;


    @InjectMocks
    private PurchaseController purchaseController;

    @Before
    public void setUp() {

        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(purchaseController).setControllerAdvice(new GlobalExceptionHandler()).build();

        purchase = new Purchase();
        purchase.setId(123);
        purchase.setBook_id(111);


    }




    @Test
    public void savePurchaseSuccess() throws Exception {
        when(purchaseService.savePurchase(any())).thenReturn(purchase);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/save")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(purchase)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andDo(MockMvcResultHandlers.print());
    }
    @Test
    public void savePurchaseFailure() throws Exception {
        when(purchaseService.savePurchase(any())).thenThrow(InternalServerErrorException.class);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/save")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(purchase)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void getPurchaseSuccess() throws Exception {
        when(purchaseService.findByUsername(any())).thenReturn(anyList());
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/user/Varun")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(purchase)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }
    @Test
    public void getPurchaseFailure() throws Exception {
        when(purchaseService.findByUsername(any())).thenThrow(InternalServerErrorException.class);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/user/Varun")
                .contentType(MediaType.APPLICATION_JSON).content(asJsonString(purchase)))
                .andExpect(MockMvcResultMatchers.status().isInternalServerError())
                .andDo(MockMvcResultHandlers.print());
    }













    private static String asJsonString(final Object obj)
    {
        try{
            return new ObjectMapper().writeValueAsString(obj);

        }catch(Exception e){
            throw new RuntimeException(e);
        }
    }


}
