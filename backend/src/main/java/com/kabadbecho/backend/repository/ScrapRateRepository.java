package com.kabadbecho.backend.repository;

import com.kabadbecho.backend.model.ScrapRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScrapRateRepository extends JpaRepository<ScrapRate, Long> {
    List<ScrapRate> findByIsActiveTrue();
}
