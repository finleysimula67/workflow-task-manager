package com.nabin.workflow.config;

import com.nabin.workflow.security.jwt.JwtAuthenticationFilter;
import com.nabin.workflow.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.nabin.workflow.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.nabin.workflow.security.oauth2.OAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // Injected dependencies
    private final CorsConfigurationSource corsConfigurationSource;  // CORS configuration
    private final UserDetailsService userDetailsService;  // Loads users from database
    private final JwtAuthenticationFilter jwtAuthenticationFilter;  // Validates JWT tokens
    private final OAuth2UserService oAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2FailureHandler;

    /**
     * Password encoder - BCrypt
     * Used to hash passwords during registration
     * Used to verify passwords during login
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication Provider
     * Connects UserDetailsService + PasswordEncoder
     * Tells Spring Security HOW to authenticate users
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());      // How to check passwords
        return authProvider;
    }

    /**
     * Authentication Manager
     * Required for programmatic authentication (login endpoint)
     * Used by AuthenticationService.authenticateUser()
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // 1. THIS BLOCK PREVENTS THE WHITE SCREEN
                // Instead of showing a white page, it sends a clean 401 Unauthorized status
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                        )
                )
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/test/**",
                                "/login/oauth2/**",
                                "/oauth2/**",
                                "/api/files/**"
                        ).permitAll()

                        // Admin endpoints (protected by @PreAuthorize)
                        .requestMatchers("/api/admin/**").authenticated()

                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        // 2. WE REMOVED .loginPage() here to stop the "Unsafe attempt" Chrome error
                        // Spring now handles the back button by using the exception handler above
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oAuth2UserService)  // Custom user service
                        )
                        .successHandler(oAuth2SuccessHandler)  // Success handler
                        .failureHandler(oAuth2FailureHandler)  // Failure handler
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}