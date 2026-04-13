package pl.edu.agh.project_manager.security;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pl.edu.agh.project_manager.domain.enums.UserRole;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public record UserPrincipal(
        UUID userId
) implements UserDetails {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        throw new UnsupportedOperationException();
    }

    @Override
    public @Nullable String getPassword() {
        throw new UnsupportedOperationException();
    }

    @Override
    public String getUsername() {
        throw new UnsupportedOperationException();
    }
}
