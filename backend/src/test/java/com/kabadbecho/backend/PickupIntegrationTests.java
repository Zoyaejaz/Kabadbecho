package com.kabadbecho.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kabadbecho.backend.model.PickupRequest;
import com.kabadbecho.backend.model.User;
import com.kabadbecho.backend.repository.PickupRequestRepository;
import com.kabadbecho.backend.repository.UserRepository;
import com.kabadbecho.backend.config.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class PickupIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PickupRequestRepository pickupRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private String userToken;
    private String collectorToken;
    private String adminToken;

    @BeforeEach
    public void setup() {
        pickupRequestRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();

        // Create mock users
        User normalUser = new User("Test User", "user@test.com", "pass", "123", "addr", "USER");
        userRepository.save(normalUser);
        userToken = "Bearer " + jwtUtil.generateToken(normalUser.getEmail(), normalUser.getRole());

        User collector = new User("Test Collector", "collector@test.com", "pass", "123", "addr", "SCRAP_COLLECTOR");
        userRepository.save(collector);
        collectorToken = "Bearer " + jwtUtil.generateToken(collector.getEmail(), collector.getRole());

        adminToken = "Bearer " + jwtUtil.generateToken("admin@kabadbecho.com", "ADMIN");
    }

    @Test
    public void testSuccessfulPickupCreation() throws Exception {
        Map<String, Object> req = new HashMap<>();
        req.put("name", "Test User");
        req.put("email", "user@test.com");
        req.put("address", "123 Test St");
        req.put("scrapType", "Metal");
        req.put("weight", 15.0);

        MvcResult result = mockMvc.perform(post("/api/pickups")
                .header("Authorization", userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        String content = result.getResponse().getContentAsString();
        PickupRequest saved = objectMapper.readValue(content, PickupRequest.class);

        assertEquals("PENDING", saved.getStatus());
        assertNotNull(saved.getId());
    }

    @Test
    public void testRoleBasedAccessControl() throws Exception {
        // Normal user requesting Admin endpoint -> 403
        mockMvc.perform(get("/api/admin/pickups")
                .header("Authorization", userToken))
                .andExpect(status().isForbidden());

        // Admin requesting Admin endpoint -> 200
        mockMvc.perform(get("/api/admin/pickups")
                .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testInvalidStateTransition() throws Exception {
        // Create request
        PickupRequest req = new PickupRequest();
        req.setEmail("test@test.com");
        req.setStatus("PENDING");
        PickupRequest saved = pickupRequestRepository.save(req);

        // Try transitioning straight to ARRIVED without ACCEPTED
        Map<String, Object> updateReq = new HashMap<>();
        updateReq.put("status", "ARRIVED");

        mockMvc.perform(put("/api/pickups/" + saved.getId() + "/status")
                .header("Authorization", collectorToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid State Transition: Must be ACCEPTED before ARRIVED."));
    }

    @Test
    public void testConcurrentAcceptanceRaceCondition() throws Exception {
        // Create a single PENDING request
        PickupRequest req = new PickupRequest();
        req.setEmail("test@test.com");
        req.setStatus("PENDING");
        final PickupRequest saved = pickupRequestRepository.save(req);

        int numberOfThreads = 2;
        ExecutorService service = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(1); // Wait for threads to execute simultaneously
        CountDownLatch done = new CountDownLatch(numberOfThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        for (int i = 0; i < numberOfThreads; i++) {
            service.execute(() -> {
                try {
                    latch.await();
                    MvcResult result = mockMvc.perform(post("/api/pickups/" + saved.getId() + "/accept")
                            .header("Authorization", collectorToken))
                            .andReturn();

                    int status = result.getResponse().getStatus();
                    if (status == 200) {
                        successCount.incrementAndGet();
                    } else if (status == 409) {
                        conflictCount.incrementAndGet();
                    }
                } catch (Exception ignored) {
                } finally {
                    done.countDown();
                }
            });
        }

        latch.countDown(); // Start all threads
        done.await(); // Wait for completion

        // Precisely one should succeed (200), and one should fail (409)
        assertEquals(1, successCount.get());
        assertEquals(1, conflictCount.get());
    }
}
