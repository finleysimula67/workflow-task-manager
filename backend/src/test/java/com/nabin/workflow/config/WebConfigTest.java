package com.nabin.workflow.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class WebConfigTest {

    private List<String> originPatterns(boolean allowLocalDevOrigins, String allowedOrigins) {
        WebConfig config = new WebConfig(allowedOrigins, allowLocalDevOrigins);
        UrlBasedCorsConfigurationSource source = (UrlBasedCorsConfigurationSource) config.corsConfigurationSource();
        CorsConfiguration corsConfig = source.getCorsConfigurations().get("/**");
        return corsConfig.getAllowedOriginPatterns();
    }

    @Test
    @DisplayName("Development mode should allow localhost origins plus configured origins")
    void development_ShouldIncludeLocalhostAndConfiguredOrigins() {
        List<String> patterns = originPatterns(true, "https://app.example.com");

        assertThat(patterns).contains(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://app.example.com"
        );
    }

    @Test
    @DisplayName("Production mode should only allow explicitly configured origins")
    void production_ShouldOnlyAllowConfiguredOrigins() {
        List<String> patterns = originPatterns(false, "https://app.example.com");

        assertThat(patterns).containsExactly("https://app.example.com");
    }

    @Test
    @DisplayName("Production mode should never allow localhost origins")
    void production_ShouldNeverAllowLocalhost() {
        List<String> patterns = originPatterns(false, "https://app.example.com");

        assertThat(patterns).doesNotContain("http://localhost:*", "http://127.0.0.1:*");
    }

    @Test
    @DisplayName("Empty production origin list should not introduce any wildcard")
    void noOriginsConfigured_ShouldNotIntroduceWildcard() {
        List<String> patterns = originPatterns(false, "");

        assertThat(patterns).isEmpty();
        assertThat(patterns).doesNotContain("*");
    }

    @Test
    @DisplayName("Allowed origins should never contain an arbitrary wildcard")
    void never_ShouldAllowArbitraryWildcardOrigin() {
        List<String> patterns = originPatterns(true, "http://localhost:5173");

        assertThat(patterns).doesNotContain("*");
        assertThat(patterns).doesNotContain("http://*");
        assertThat(patterns).doesNotContain("https://*");
    }
}
