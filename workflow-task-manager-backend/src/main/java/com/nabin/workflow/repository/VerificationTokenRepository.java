package com.nabin.workflow.repository;

import com.nabin.workflow.entities.User;
import com.nabin.workflow.entities.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(String token);

    Optional<VerificationToken> findByUser(User user);

    @Modifying
    @Query("DELETE FROM VerificationToken vt WHERE vt.expiryDate < :now")
    void deleteExpiredTokens(LocalDateTime now);
}