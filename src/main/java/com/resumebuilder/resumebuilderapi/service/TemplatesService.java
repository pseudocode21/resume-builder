package com.resumebuilder.resumebuilderapi.service;

import com.resumebuilder.resumebuilderapi.dto.AuthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.resumebuilder.resumebuilderapi.util.AppConstants.PREMIUM;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplatesService {

    private final AuthService authService;

    public Map<String, Object> getTemplates(@Nullable Object principal) {
        //Step 1: Get the current Profile
        AuthResponse authResponse = authService.getProfile(principal);

        //Step 2: Get the available templates based on subscription
        List<String> availableTemplates;
        Boolean isPremium = PREMIUM.equalsIgnoreCase(authResponse.getSubscriptionPlan());

        if (isPremium) {
            availableTemplates = List.of("01", "02", "03");
        }else {
            availableTemplates = List.of("01");
        }

        //Step 3: Add the data into map
        Map<String, Object> restricitons = new HashMap<>();
        restricitons.put("availableTemplates", availableTemplates);
        restricitons.put("allTemplates", List.of("01", "02", "03"));
        restricitons.put("subscriptionPlan", authResponse.getSubscriptionPlan());
        restricitons.put("isPremium", isPremium);

        //Step 4: return the result
        return restricitons;
    }


}
