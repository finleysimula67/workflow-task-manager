package com.nabin.workflow.security.oauth2;

import com.nabin.workflow.entities.RefreshToken;
import com.nabin.workflow.security.user.UserPrincipal;
import com.nabin.workflow.security.jwt.JwtTokenProvider;
import com.nabin.workflow.services.RefreshTokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.oauth2.redirect-uri:http://localhost:5173/auth/callback}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        log.info("OAuth2 authentication successful");

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        // Generate JWT access token
        String accessToken = jwtTokenProvider.generateTokenFromUserPrincipal(userPrincipal);

        // Generate refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(
                userPrincipal.getId(),
                request
        );

        log.info("JWT tokens generated for OAuth2 user: {}", userPrincipal.getEmail());

        // Redirect with both tokens
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", accessToken)
                .queryParam("refreshToken", refreshToken.getToken())
                .build()
                .toUriString();

        log.info("Redirecting to: {}", targetUrl);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}