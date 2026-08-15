package com.nabin.workflow.security.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@Slf4j
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    /**
     * Safe, generic message shown to the user. The real exception is only logged server-side
     * and is never placed into the redirect URL.
     */
    private static final String AUTHENTICATION_FAILED_MESSAGE = "Authentication failed. Please try again.";
    private static final String LOGIN_PATH = "/login";
    private static final String CALLBACK_PATH_SUFFIX = "/auth/callback";

    @Value("${app.oauth2.redirect-uri:http://localhost:5173/auth/callback}")
    private String redirectUri;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {

        // The real failure reason is logged server-side only.
        log.error("OAuth2 authentication failed", exception);

        // Extract frontend base URL from redirect URI (with a safe fallback if it is not shaped as expected)
        String frontendUrl = extractFrontendBaseUrl(redirectUri);

        // Redirect to login page with a controlled, non-sensitive error
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + LOGIN_PATH)
                .queryParam("error", "oauth2_failed")
                .queryParam("message", AUTHENTICATION_FAILED_MESSAGE)
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String extractFrontendBaseUrl(String redirectUri) {
        int idx = redirectUri.lastIndexOf(CALLBACK_PATH_SUFFIX);
        if (idx <= 0) {
            return redirectUri;
        }
        return redirectUri.substring(0, idx);
    }
}