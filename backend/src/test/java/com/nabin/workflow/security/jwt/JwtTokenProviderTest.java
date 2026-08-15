package com.nabin.workflow.security.jwt;

import com.nabin.workflow.security.user.UserPrincipal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtTokenProviderTest {

    private static final String VALID_SECRET = "test-secret-0123456789-abcdefghijklmnopqrstuvwxyz";

    private UserPrincipal principal() {
        return new UserPrincipal(1L, "testuser", "test@example.com", "password", true, Collections.emptyList());
    }

    private JwtTokenProvider provider() {
        return new JwtTokenProvider(VALID_SECRET, 900000L, 604800000L, "WorkFlow");
    }

    @Test
    @DisplayName("Missing secret should fail fast at startup")
    void constructor_NullSecret_ShouldFailFast() {
        assertThatThrownBy(() -> new JwtTokenProvider(null, 900000L, 604800000L, "WorkFlow"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("JWT signing secret is not configured");
    }

    @Test
    @DisplayName("Blank secret should fail fast at startup")
    void constructor_BlankSecret_ShouldFailFast() {
        assertThatThrownBy(() -> new JwtTokenProvider("   ", 900000L, 604800000L, "WorkFlow"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("JWT signing secret is not configured");
    }

    @Test
    @DisplayName("Too-short secret should fail fast at startup")
    void constructor_ShortSecret_ShouldFailFast() {
        assertThatThrownBy(() -> new JwtTokenProvider("short", 900000L, 604800000L, "WorkFlow"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("at least 32 characters");
    }

    @Test
    @DisplayName("Token generation and validation round-trip should succeed")
    void generateAndValidateToken_RoundTrip_ShouldSucceed() {
        JwtTokenProvider jwtTokenProvider = provider();
        String token = jwtTokenProvider.generateTokenFromUserPrincipal(principal());

        assertThat(token).isNotBlank();
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        assertThat(jwtTokenProvider.getEmailFromToken(token)).isEqualTo("test@example.com");
        assertThat(jwtTokenProvider.getUserIdFromToken(token)).isEqualTo(1L);
        assertThat(jwtTokenProvider.getUsernameFromToken(token)).isEqualTo("testuser");
        assertThat(jwtTokenProvider.isTokenExpired(token)).isFalse();
    }

    @Test
    @DisplayName("Tampered token should be rejected")
    void validateToken_TamperedToken_ShouldBeFalse() {
        JwtTokenProvider jwtTokenProvider = provider();
        String token = jwtTokenProvider.generateTokenFromUserPrincipal(principal());
        String tampered = token.substring(0, token.length() - 2) + "XX";

        assertThat(jwtTokenProvider.validateToken(tampered)).isFalse();
    }

    @Test
    @DisplayName("Expired token should be rejected")
    void validateToken_ExpiredToken_ShouldBeFalse() {
        JwtTokenProvider jwtTokenProvider = new JwtTokenProvider(VALID_SECRET, -60000L, 604800000L, "WorkFlow");
        String token = jwtTokenProvider.generateTokenFromUserPrincipal(principal());

        assertThat(jwtTokenProvider.validateToken(token)).isFalse();
        assertThat(jwtTokenProvider.isTokenExpired(token)).isTrue();
    }

    @Test
    @DisplayName("Garbage input should be rejected without throwing")
    void validateToken_GarbageInput_ShouldBeFalse() {
        JwtTokenProvider jwtTokenProvider = provider();

        assertThat(jwtTokenProvider.validateToken("not.a.jwt")).isFalse();
        assertThat(jwtTokenProvider.validateToken("")).isFalse();
    }
}
