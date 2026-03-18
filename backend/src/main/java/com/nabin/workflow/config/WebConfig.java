package com.nabin.workflow.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    // ── Shared helper so both methods use identical logic ──────
    private List<String> getAllowedOriginPatterns() {
        List<String> patterns = new ArrayList<>();

        // Always allow localhost in any port (for local development)
        patterns.add("http://localhost:*");
        patterns.add("http://127.0.0.1:*");

        // Add whatever is in your config (production URLs, etc.)
        // e.g. "https://myapp.com,https://www.myapp.com"
        Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .forEach(patterns::add);

        return patterns;
    }

    // ── Spring MVC CORS (for regular controllers) ──────────────
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                          // was /api/**, now covers all paths
                .allowedOriginPatterns(                     // was allowedOrigins() — patterns support wildcards + credentials
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

        // Now reads from config — same origins as addCorsMappings above
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
        source.registerCorsConfiguration("/**", configuration); // was /api/**, now matches addCorsMappings
        return source;
    }
}
