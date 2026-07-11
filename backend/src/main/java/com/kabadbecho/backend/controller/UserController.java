package com.kabadbecho.backend.controller;

import com.kabadbecho.backend.model.User;
import com.kabadbecho.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok(userOpt.get());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestParam String email, @RequestBody User profileUpdates) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();
        if (profileUpdates.getName() != null) user.setName(profileUpdates.getName());
        if (profileUpdates.getPhone() != null) user.setPhone(profileUpdates.getPhone());
        if (profileUpdates.getAddress() != null) user.setAddress(profileUpdates.getAddress());
        if (profileUpdates.getAltPhone() != null) user.setAltPhone(profileUpdates.getAltPhone());
        if (profileUpdates.getCity() != null) user.setCity(profileUpdates.getCity());
        if (profileUpdates.getState() != null) user.setState(profileUpdates.getState());
        if (profileUpdates.getPincode() != null) user.setPincode(profileUpdates.getPincode());
        if (profileUpdates.getProfilePicUrl() != null) user.setProfilePicUrl(profileUpdates.getProfilePicUrl());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }
}
