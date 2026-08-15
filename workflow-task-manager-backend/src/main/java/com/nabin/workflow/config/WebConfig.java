package com.nabin.workflow.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final List<String> allowedOrigins;
    private final boolean allowLocalDevOrigins;

    /**
     * CORS is profile/environment driven.
     * <p>
     * - Development (default profile): {@code cors.allow-local-origins=true} enables
     *   {@code http://localhost:*} and {@code http://127.0.0.1:*} in addition to the
     *   explicitly configured origins.
     * - Production: set {@code cors.allow-local-origins=false} so ONLY the explicitly
     *   configured trusted origins are allowed. Wildcards are never used.
     */
    public WebConfig(
            @Value("${cors.allowed.origins:}") String allowedOrigins,
            @Value("${cors.allow-local-origins:false}") boolean allowLocalDevOrigins) {
        this.allowedOrigins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        this.allowLocalDevOrigins = allowLocalDevOrigins;
    }

    // ── Shared helper so both methods use identical logic ──────
    private List<String> getAllowedOriginPatterns() {
        List<String> patterns = new ArrayList<>();

        // Only added in development (cors.allow-local-origins=true)
        if (allowLocalDevOrigins) {
            patterns.add("http://localhost:*");
            patterns.add("http://127.0.0.1:*");
        }

        // Explicitly configured trusted origins (e.g. production URLs)
        patterns.addAll(allowedOrigins);

        return patterns;
    }

    // ── Spring MVC CORS (for regular controllers) ──────────────
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                        getAllowedOriginPatterns().toArray(new String[0])
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Disposition")
                .allowCredentials(true)
                .maxAge(3600);
    }

    // ── Spring Security CORS (used for security filter chain) ──
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Same origins as addCorsMappings above
        configuration.setAllowedOriginPatterns(getAllowedOriginPatterns());

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
        ));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Disposition"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
