package com.kabadbecho.backend.controller;

import com.kabadbecho.backend.model.ScrapRate;
import com.kabadbecho.backend.repository.ScrapRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rates")
public class ScrapRateController {

    @Autowired
    private ScrapRateRepository scrapRateRepository;

    @GetMapping
    public ResponseEntity<List<ScrapRate>> getActiveRates() {
        return ResponseEntity.ok(scrapRateRepository.findByIsActiveTrue());
    }

    @PostMapping
    public ResponseEntity<?> addOrUpdateRate(@RequestBody ScrapRate rate) {
        // Protected by SecurityConfig hasRole("ADMIN")
        ScrapRate saved = scrapRateRepository.save(rate);
        return ResponseEntity.ok(Map.of("message", "Rate updated", "rate", saved));
    }
}
