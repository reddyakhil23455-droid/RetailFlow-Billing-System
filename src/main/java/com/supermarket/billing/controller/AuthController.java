package com.supermarket.billing.controller;

import com.supermarket.billing.model.User;
import com.supermarket.billing.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {

        try {

            String username = request.get("username");
            String password = request.get("password");

            User user = authService.login(username, password);

            // Never send password back to frontend
            Map<String, Object> response = new HashMap<>();

            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {

            authService.register(user);

            return ResponseEntity.ok(
                    Map.of("message", "Registration successful")
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}