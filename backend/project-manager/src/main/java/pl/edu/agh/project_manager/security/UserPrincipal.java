package pl.edu.agh.project_manager.security;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pl.edu.agh.project_manager.domain.enums.UserRole;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public record UserPrincipal(
        UUID userId,
        String email,
        String password,
        Collection<? extends GrantedAuthority> authorities
) implements UserDetails {

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
        return email;
    }
}
