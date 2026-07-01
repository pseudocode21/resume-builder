package com.resumebuilder.resumebuilderapi.controller;

import com.razorpay.RazorpayException;
import com.resumebuilder.resumebuilderapi.document.Payment;
import com.resumebuilder.resumebuilderapi.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.resumebuilder.resumebuilderapi.util.AppConstants.PREMIUM;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, String> request, Authentication authentication) throws RazorpayException {

        //Step 1: Validate the request
        String planType = request.get("planType");
        if (!PREMIUM.equalsIgnoreCase(planType)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid Plan Type"));
        }

        //Step 2: Call the service method
        Payment payment = paymentService.createOrder(authentication.getPrincipal(), planType);

        //Step 3: Prepare the response object
        Map<String, Object> response = Map.of(
                "orderId", payment.getRazorpayOrderId(),
                "amount", payment.getAmount(),
                "currency", payment.getCurrency(),
                "receipt", payment.getReceipt());

        //Step 4: return response
        return ResponseEntity.ok(response);
    }


    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {

        //Validate the Request
        String razorpayOrderId = request.get("razorpay_order_id");
        String razorpayPaymentId = request.get("razorpay_payment_id");
        String razorpaySignature = request.get("razorpay_signature");

        if (Objects.isNull(razorpayPaymentId) || Objects.isNull(razorpayOrderId) || Objects.isNull(razorpaySignature)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing requires payment parameters"));
        }

        //Step 2: Call the service Method
        boolean isValid = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        //Step 3: return the response
        if (isValid) {
            return ResponseEntity.ok(Map.of(
                    "message", "Payment Verified Successfully",
                    "status", "success"
            ));
        } else return ResponseEntity.badRequest().body(Map.of("message", "Payment Verification Failed"));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(Authentication authentication) {
        // Step 1: Call the service method
        List<Payment> payments = paymentService.getUserPayments(authentication.getPrincipal());

        // Step 2: return the response
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable String orderId) {
        // Step 1: Call the service method
        Payment paymentDetails = paymentService.getPaymentDetails(orderId);

        // Step 2: return the response
        return ResponseEntity.ok(paymentDetails);
    }
}
