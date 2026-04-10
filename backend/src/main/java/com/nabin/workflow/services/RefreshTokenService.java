package com.nabin.workflow.services;

import com.nabin.workflow.entities.RefreshToken;
import com.nabin.workflow.entities.User;
import com.nabin.workflow.exception.ResourceNotFoundException;
import com.nabin.workflow.exception.UnauthorizedException;
import com.nabin.workflow.repository.RefreshTokenRepository;
import com.nabin.workflow.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Value("${jwt.refresh-expiration}")
    private Long refreshTokenExpirationMs;

    /**
     * Create a new refresh token for user
     */
    @Transactional
    public RefreshToken createRefreshToken(Long userId, HttpServletRequest request) {
        return createRefreshToken(userId, request, refreshTokenExpirationMs);
    }

    /**
     * Create a new refresh token for user with custom expiration
     */
    @Transactional
    public RefreshToken createRefreshToken(Long userId, HttpServletRequest request, long expirationMs) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Generate unique token
        String token = UUID.randomUUID().toString();

        // Calculate expiry date with custom expiration
        LocalDateTime expiryDate = LocalDateTime.now()
                .plusSeconds(expirationMs / 1000);

        // Extract device info
        String userAgent = request.getHeader("User-Agent");
        String ipAddress = getClientIP(request);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiryDate(expiryDate)
                .userAgent(userAgent)
                .ipAddress(ipAddress)
                .revoked(false)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);

        log.info("Refresh token created for user: {} (expires: {}, duration: {} ms)", userId, expiryDate, expirationMs);

        return savedToken;
    }

    /**
     * Verify and return refresh token
     */
    @Transactional(readOnly = true)
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        // Check if revoked
        if (refreshToken.isRevoked()) {
            log.warn("Attempted to use revoked refresh token");
            throw new UnauthorizedException("Refresh token has been revoked");
        }

        // Check if expired
        if (refreshToken.isExpired()) {
            log.warn("Attempted to use expired refresh token");
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token has expired. Please login again.");
        }

        return refreshToken;
    }

    /**
     * Rotate refresh token (delete old, create new)
     * This is called when refreshing access token
     */
    @Transactional
    public RefreshToken rotateRefreshToken(RefreshToken oldToken, HttpServletRequest request) {
        log.info("Rotating refresh token for user: {}", oldToken.getUser().getId());

        // Revoke old token
        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        // Create new token
        return createRefreshToken(oldToken.getUser().getId(), request);
    }

    /**
     * Revoke a specific refresh token
     */
    @Transactional
    public void revokeRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Refresh token not found"));

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        log.info("Refresh token revoked for user: {}", refreshToken.getUser().getId());
    }

    /**
     * Revoke all refresh tokens for a user (logout from all devices)
     */
    @Transactional
    public void revokeAllUserTokens(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        refreshTokenRepository.revokeAllUserTokens(user);

        log.info("All refresh tokens revoked for user: {}", userId);
    }

    /**
     * Delete expired tokens (scheduled task - runs daily at 3 AM)
     */
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional
    public void deleteExpiredTokens() {
        log.info("Cleaning up expired refresh tokens...");
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Expired refresh tokens cleaned up");
    }

    /**
     * Get client IP address from request
     */
    private String getClientIP(HttpServletRequest request) {
        String[] headers = {
                "X-Forwarded-For",
                "Proxy-Client-IP",
                "WL-Proxy-Client-IP",
                "HTTP_X_FORWARDED_FOR",
                "HTTP_X_FORWARDED",
                "HTTP_X_CLUSTER_CLIENT_IP",
                "HTTP_CLIENT_IP",
                "HTTP_FORWARDED_FOR",
                "HTTP_FORWARDED",
                "HTTP_VIA",
                "REMOTE_ADDR"
        };

        for (String header : headers) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                return ip.split(",")[0].trim();
            }
        }

        return request.getRemoteAddr();
    }
}