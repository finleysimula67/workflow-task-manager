package com.nabin.workflow.security.user;

import com.nabin.workflow.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@Getter @Setter
public class UserPrincipal implements UserDetails, OAuth2User {

    private Long id;
    private String username;
    private String email;
    private String password;
    private Boolean enabled;
    private Collection<? extends GrantedAuthority> authorities;

    /**
     * Build UserPrincipal from User entity
     */
    public static UserPrincipal build(User user) {
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());

        return new UserPrincipal(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getEnabled(),
                authorities
        );
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;  // Using email as username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String getName() {
        return "";
    }

    public String getActualUsername() {
        return username;
    }
}