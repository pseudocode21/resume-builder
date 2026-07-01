package com.resumebuilder.resumebuilderapi.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.resumebuilder.resumebuilderapi.document.Payment;
import com.resumebuilder.resumebuilderapi.document.User;
import com.resumebuilder.resumebuilderapi.dto.AuthResponse;
import com.resumebuilder.resumebuilderapi.repository.PaymentRepository;
import com.resumebuilder.resumebuilderapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.resumebuilder.resumebuilderapi.util.AppConstants.PREMIUM;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AuthService authService;
    private final UserRepository userRepository;

    @Value("${razorpay.key.id}")
    private String razorpaykeyId;
    @Value("${razorpay.key.secret}")
    private String razorpaykeySecret;

    public Payment createOrder( Object principal, String planType) throws RazorpayException {

        //Initial Step
        AuthResponse authResponse = authService.getProfile(principal);

        // Step 1: Intialize the razorpay Client
        RazorpayClient razorpayClient = new RazorpayClient(razorpaykeyId, razorpaykeySecret);

        // Step 2: prepare the json object to pass the razorpay
        int amount = 99900; //amount is in paisa, we pass this via backend not frontend because we have only one plan of Rs. 999
        String currency = "INR";
        String receipt = PREMIUM + UUID.randomUUID().toString().substring(0, 8);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount);
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);

        // Step 3: Call the razorpay API to create order
        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        // Step 4: Save the order details into database
        Payment newPayment = Payment.builder()
                .userId(authResponse.getId())
                .razorpayOrderId(razorpayOrder.get("id"))
                .amount(amount)
                .currency(currency)
                .planType(planType)
                .status("create")
                .receipt(receipt)
                .build();

        //Step 5: return the result
        return paymentRepository.save(newPayment);
    }

    public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);

            boolean isValidSignature = Utils.verifyPaymentSignature(attributes, razorpaykeySecret);

            if (isValidSignature) {
                Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() -> new RuntimeException("Payment not found"));
                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setRazorpaySignature(razorpaySignature);
                payment.setStatus("paid");
                paymentRepository.save(payment);

                //upgrade the user subscription
                upgradeUserSubscription(payment.getUserId(), payment.getPlanType());
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("Error verifying the payment : ", e);
            return  false;
        }
    }

    private void upgradeUserSubscription(String userId, String planType) {

        User existinguser = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        existinguser.setSubscriptionPlan(planType);

        userRepository.save(existinguser);

        log.info("User {} upgraded to {} plan", userId, planType);

    }

    public List<Payment> getUserPayments(@Nullable Object principal) {
        //Step 1: Get the user profile
        AuthResponse authResponse = authService.getProfile(principal);

        //Step 2: Call the repo finder method
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(authResponse.getId());
    }

    public Payment getPaymentDetails(String orderId) {
       return paymentRepository.findByRazorpayOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}
