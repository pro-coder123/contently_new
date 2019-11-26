package com.stackroute.purchasingservice.controller;



import com.stackroute.purchasingservice.Payment.StripeClient;
import com.stackroute.purchasingservice.exceptions.InternalServerErrorException;
import com.stackroute.purchasingservice.exceptions.NullValueFieldException;
import com.stackroute.purchasingservice.model.Purchase;
import com.stackroute.purchasingservice.service.PurchaseService;
import com.stackroute.purchasingservice.service.RabbitMQSender;
import com.stripe.model.Charge;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

//@CrossOrigin(origins = "http://localhost", maxAge = 3600)
@CrossOrigin
@RestController
@RequestMapping("/api/v1")
@Api(value="purchase", description="purchaseservice")
public class PurchaseController {

    private PurchaseService purchaseService;
    private RabbitMQSender rabbitMQSender;
    private ResponseEntity responseEntity;
    private StripeClient stripeClient;

    @Autowired
    public PurchaseController(PurchaseService purchaseService, RabbitMQSender rabbitMQSender, StripeClient stripeClient) {
        this.purchaseService = purchaseService;
        this.rabbitMQSender = rabbitMQSender;
        this.stripeClient = stripeClient;
    }

    @ApiOperation(value = "payment gateway")
    @PostMapping(value = "/payment")
    public Charge chargeCard(HttpServletRequest request) throws Exception {
        String token = request.getHeader("token");
        Double amount = Double.parseDouble(request.getHeader("amount"));
        return this.stripeClient.chargeCreditCard(token, amount);
    }


    @ApiOperation(value = "save new purchase")
    @PostMapping(value = "/save")
    public ResponseEntity<Purchase> registerUser(@RequestBody Purchase purchase) throws  InternalServerErrorException, NullValueFieldException {

        rabbitMQSender.sendContent(purchase);
        purchase.setId(purchaseService.getNextSequence("customSequences"));
        return new ResponseEntity<Purchase> (purchaseService.savePurchase(purchase), HttpStatus.CREATED);
    }


    @ApiOperation(value = "get the existing purchase by user")
    @GetMapping(value = "/user/{username}")
    public ResponseEntity<?> getContent(@PathVariable("username") String username) throws InternalServerErrorException
    {
        responseEntity=new ResponseEntity<>(purchaseService.findByUsername(username),HttpStatus.OK);
        return responseEntity;
    }

    @ApiOperation(value = "get the existing purchases by book id")
    @GetMapping(value = "/book/{id}/{username}")
    public ResponseEntity<?> getByEditorId(@PathVariable("id") int id,@PathVariable("username") String username) throws InternalServerErrorException
    {
        responseEntity=new ResponseEntity<>(purchaseService.findByBookId(id,username),HttpStatus.OK);
        return responseEntity;
    }
}
