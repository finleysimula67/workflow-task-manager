package com.nabin.workflow.repository;

import com.nabin.workflow.entities.PasswordResetToken;
import com.nabin.workflow.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    @Modifying
    @Query("DELETE FROM PasswordResetToken prt WHERE prt.user = :user")
    void deleteByUser(User user);

    @Modifying
    @Query("DELETE FROM PasswordResetToken prt WHERE prt.expiryDate < :now")
    void deleteExpiredTokens(LocalDateTime now);
}