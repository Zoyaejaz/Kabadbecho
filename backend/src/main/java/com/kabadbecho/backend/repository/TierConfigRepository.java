package com.kabadbecho.backend.repository;

import com.kabadbecho.backend.model.TierConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TierConfigRepository extends JpaRepository<TierConfig, Long> {
    TierConfig findByTierName(String tierName);
}
