package com.resumebuilder.resumebuilderapi.service;

import com.resumebuilder.resumebuilderapi.document.User;
import com.resumebuilder.resumebuilderapi.dto.AuthResponse;
import com.resumebuilder.resumebuilderapi.dto.FirebaseAuthRequest;
import com.resumebuilder.resumebuilderapi.dto.LoginRequest;
import com.resumebuilder.resumebuilderapi.dto.RegisterRequest;
import com.resumebuilder.resumebuilderapi.exception.ResourceExistsException;
import com.resumebuilder.resumebuilderapi.repository.UserRepository;
import com.resumebuilder.resumebuilderapi.util.JwtUtil;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    public AuthResponse register(RegisterRequest request) {
        log.info("Inside AuthService: register() {]",request);

        if(userRepository.existsByEmail(request.getEmail()))
            throw new ResourceExistsException("User Already exists with this email");

        User newUser = toDocument(request);
        userRepository.save(newUser);

        // Attempt to send verification email (non-blocking - registration succeeds even if email fails)
        try {
            sendVerficationEmail(newUser);
        } catch (Exception e) {
            log.warn("Verification email could not be sent (user registered successfully): {}", e.getMessage());
        }
        return toResponse(newUser);

    }

    private void sendVerficationEmail(User newUser) {
        try {
            log.info("Inside Auth Service - sendVerificationEmail()");
            String link = appBaseUrl+"/api/auth/verify-email?token="+newUser.getVerificationToken();
            String html = "<div style='font-family:san-serif'>" +
                    "<h2> Verify your email </h2>" +
                    "<p><a href='" + link + "' style='display:inline-block;padding:10px 16px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;'>Verify Email </a></p>"
                    +
                    "<p> Or Copy this link: "+link+"</p>"+
                    "<p>This link expires in 24 hours.</p>"+
                    "</div>";
            log.info("Sending mail to .....{}", newUser.getEmail());
            emailService.sendHtmlEmail(newUser.getEmail(), "Verify your email", html);
            log.info("MAIL SENT SUCCESSFULLY");
        } catch (Exception e) {
            log.error("Exception while sending email", e);

            throw new RuntimeException("Failed to send verification email : " + e.getMessage());
        }
    }

    private AuthResponse toResponse(User newUser) {
        return AuthResponse.builder()
                .id(newUser.getId())
                .name(newUser.getName())
                .email(newUser.getEmail())
                .profileImageUrl(newUser.getProfileImageUrl())
                .emailVerified(newUser.isEmailVerified())
                .subscriptionPlan(newUser.getSubscriptionPlan())
                .createdAt(newUser.getCreatedAt())
                .updatedAt(newUser.getUpdatedAt())
                .build();
    }
    private User toDocument(RegisterRequest request){
        return  User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .profileImageUrl(request.getProfileImageUrl())
                .subscriptionPlan("Basic")
                .emailVerified(true)  // Auto-verify: Render free tier blocks SMTP, so skip email verification
                .verificationToken(UUID.randomUUID().toString())
                .verificationExpires(LocalDateTime.now().plusHours(24))
                .build();
    }
    public void verifyEmail(String token){
        log.info("Inside AuthService: verifyEmail():{}",token);
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(()->new RuntimeException("Invalid or expired verification"));
        if (user.getVerificationExpires() != null && user.getVerificationExpires().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired. Please request new one");
        }
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationExpires(null);
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
       User existingUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid Email or Password"));

        if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            throw new UsernameNotFoundException("Invalid Email or Password");
        }
        if (!existingUser.isEmailVerified()) {
            throw new RuntimeException("Please verify your Email before logging in.");
        }
        String token = jwtUtil.generateToken(existingUser.getId());

        AuthResponse response = toResponse(existingUser);
        response.setToken(token);
        return response;
    }

    public AuthResponse firebaseLogin(com.resumebuilder.resumebuilderapi.dto.FirebaseAuthRequest request) {
        log.info("Inside AuthService: firebaseLogin()");
        try {
            String[] parts = request.getIdToken().split("\\.");
            if (parts.length < 2) {
                throw new RuntimeException("Invalid token format");
            }
            String payloadJson = new String(java.util.Base64.getUrlDecoder().decode(parts[1]), java.nio.charset.StandardCharsets.UTF_8);
            JsonNode node = objectMapper.readTree(payloadJson);

            String email = node.has("email") ? node.get("email").asText() : null;
            String name = node.has("name") ? node.get("name").asText() : (email != null ? email.split("@")[0] : "Google User");
            String picture = node.has("picture") ? node.get("picture").asText() : null;

            if (email == null || email.isBlank()) {
                throw new RuntimeException("Email not found in Google account token");
            }

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = User.builder()
                        .name(name)
                        .email(email)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .profileImageUrl(picture)
                        .subscriptionPlan("Basic")
                        .emailVerified(true)
                        .build();
                return userRepository.save(newUser);
            });

            if (!user.isEmailVerified()) {
                user.setEmailVerified(true);
                userRepository.save(user);
            }

            String token = jwtUtil.generateToken(user.getId());
            AuthResponse response = toResponse(user);
            response.setToken(token);
            return response;

        } catch (Exception e) {
            log.error("Error during Firebase authentication", e);
            throw new RuntimeException("Google Authentication failed: " + e.getMessage());
        }
    }

    public void resendVerification(String email) {
        //Step 1: FInd the user account by email
        User user = userRepository.findByEmail(email)
                .orElseThrow( () -> new RuntimeException("User not found!"));

        //Step 2: Check the email is verified
        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        //Step 3: Set the new Verification token and expires time
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationExpires(LocalDateTime.now().plusHours(24));

        // Step 4: Update the user
        userRepository.save(user);

        //Step 5: Resend the verification email
        sendVerficationEmail(user);
    }

    public AuthResponse getProfile(Object principalObject) {
        User existingUser = (User) principalObject;
        return toResponse(existingUser);
    }

}
