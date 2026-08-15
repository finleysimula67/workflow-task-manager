package com.nabin.workflow.security.oauth2;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

class OAuth2AuthenticationFailureHandlerTest {

    private final OAuth2AuthenticationFailureHandler handler = new OAuth2AuthenticationFailureHandler();

    private String captureRedirectUrl(String redirectUri) throws Exception {
        AtomicReference<String> captured = new AtomicReference<>();
        RedirectStrategy recordingStrategy = (request, response, url) -> captured.set(url);
        handler.setRedirectStrategy(recordingStrategy);
        ReflectionTestUtils.setField(handler, "redirectUri", redirectUri);

        handler.onAuthenticationFailure(
                new MockHttpServletRequest(),
                new MockHttpServletResponse(),
                new OAuth2AuthenticationException("Database error: connection failed on line 42")
        );

        return captured.get();
    }

    @Test
    @DisplayName("Failure redirect should not expose the raw exception message")
    void failure_ShouldNotExposeExceptionMessage() throws Exception {
        String url = captureRedirectUrl("http://localhost:5173/auth/callback");

        assertThat(url).contains("error=oauth2_failed");
        assertThat(url).contains("message=");
        assertThat(url).doesNotContain("Database error");
        assertThat(url).doesNotContain("connection failed");
        assertThat(url).doesNotContain("line 42");
    }

    @Test
    @DisplayName("Failure redirect should point to login page with a safe controlled message")
    void failure_ShouldRedirectToLoginWithSafeMessage() throws Exception {
        String url = captureRedirectUrl("https://app.example.com/auth/callback");

        assertThat(url).startsWith("https://app.example.com/login");
        assertThat(url).contains("error=oauth2_failed");
        assertThat(url).contains("message=Authentication");
        assertThat(url).doesNotContain("OAuth2AuthenticationException");
        assertThat(url).doesNotContain("Exception");
    }

    @Test
    @DisplayName("Redirect URI without the /auth/callback suffix should not break the handler")
    void failure_RedirectUriWithoutCallbackSuffix_ShouldNotThrow() throws Exception {
        assertThatCode(() -> captureRedirectUrl("https://app.example.com"))
                .doesNotThrowAnyException();
    }
}
