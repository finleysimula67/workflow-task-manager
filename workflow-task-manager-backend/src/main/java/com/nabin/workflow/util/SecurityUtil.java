package com.nabin.workflow.util;

import com.nabin.workflow.exception.UnauthorizedException;
import com.nabin.workflow.security.user.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

//for security
@Component
public class SecurityUtil {
    /**
     * Get currently authenticated user
     */
    public static UserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();

        // Normal JWT login
        if (principal instanceof UserPrincipal userPrincipal) {
            return userPrincipal;
        }

        // Google OAuth2 login — principal is OAuth2User
        // The name/subject is the user's DB id set during OAuth2UserService
        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User oauth2User) {
            Object id = oauth2User.getAttribute("id"); // ← depends on what your OAuth2UserService sets
            if (id != null) {
                // Re-wrap in UserPrincipal or just throw a helpful error
                throw new UnauthorizedException(
                        "OAuth2 principal not mapped to UserPrincipal. Fix OAuth2UserService to return UserPrincipal."
                );
            }
        }

        throw new UnauthorizedException("Invalid authentication principal type: "
                + principal.getClass().getName()); // ← now you'll see exact type in logs
    }

    /**
     * Get current user's ID
     */
    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Get current user's email
     */
    public static String getCurrentUserEmail() {
        return getCurrentUser().getEmail();
    }

    /**
     * Get current user's username
     */
    public static String getCurrentUsername() {
        return getCurrentUser().getUsername();
    }

    /**
     * Check if current user has a specific role
     */
    public static boolean hasRole(String role) {
        UserPrincipal user = getCurrentUser();
        return user.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(role));
    }

    /**
     * Check if current user is admin
     */
    public static boolean isAdmin() {
        return hasRole("ROLE_ADMIN");
    }

    /**
     * Check if user owns the resource
     */
    public static boolean isOwner(Long userId) {
        return getCurrentUserId().equals(userId);
    }

    /**
     * Validate user owns the resource, throw exception if not
     */
    public static void validateOwnership(Long userId) {
        if (!isOwner(userId)) {
            throw new UnauthorizedException("You don't have permission to access this resource");
        }
    }
}