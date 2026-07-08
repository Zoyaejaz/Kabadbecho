package com.kabadbecho.backend.controller;

import com.kabadbecho.backend.model.User;
import com.kabadbecho.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Map;
import java.util.Optional;

import com.kabadbecho.backend.config.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${admin.email:admin@kabadbecho.com}")
    private String adminEmail;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        Map<String, String> errorResponse = new HashMap<>();

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            errorResponse.put("message", "Email is required");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            errorResponse.put("message", "Email is already in use!");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Validate role
        String role = user.getRole();
        if (role == null || (!role.equals("USER") && !role.equals("SCRAP_COLLECTOR"))) {
            errorResponse.put("message", "Invalid role specified. Role must be USER or SCRAP_COLLECTOR.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save user
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        Map<String, String> errorResponse = new HashMap<>();
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            errorResponse.put("message", "Email and password are required.");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Check if admin
        if (email.equalsIgnoreCase(adminEmail)) {
            if (password.equals(adminPassword)) {
                String token = jwtUtil.generateToken(adminEmail, "ADMIN");
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", "ADMIN");
                response.put("email", adminEmail);
                response.put("name", "Admin");
                return ResponseEntity.ok(response);
            } else {
                errorResponse.put("message", "Invalid admin password.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
        }

        // Check database for normal users or scrap collectors
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            errorResponse.put("message", "User not found with this email.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            errorResponse.put("message", "Invalid password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }

        // Authentication successful
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("phone", user.getPhone());
        response.put("address", user.getAddress());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestParam String email, @RequestBody Map<String, String> request) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Current password is incorrect"));
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
