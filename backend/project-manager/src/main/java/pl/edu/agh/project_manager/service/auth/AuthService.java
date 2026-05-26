package pl.edu.agh.project_manager.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.domain.entity.user.ActivationToken;
import pl.edu.agh.project_manager.domain.entity.user.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.domain.event.SystemNewEmployeeEvent;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.user.ActivationTokenRepository;
import pl.edu.agh.project_manager.repository.user.UserRepository;
import pl.edu.agh.project_manager.security.JwtService;
import pl.edu.agh.project_manager.security.TokenPair;
import pl.edu.agh.project_manager.security.UserPrincipal;
import pl.edu.agh.project_manager.service.command.auth.LoginCommand;
import pl.edu.agh.project_manager.service.command.auth.RegisterCommand;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ActivationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public TokenPair register(RegisterCommand command) {
        ActivationToken activationToken = tokenRepository.findByToken(command.activationToken())
                .orElseThrow(() -> new ApplicationException(ApiErrorCode.ACTIVATION_TOKEN_NOT_FOUND));

        if (activationToken.isExpired()) {
            tokenRepository.delete(activationToken);
            throw new ApplicationException(ApiErrorCode.ACTIVATION_TOKEN_EXPIRED);
        }

        User user = activationToken.getUser();

        user.setName(command.name());
        user.setSurname(command.surname());
        user.setPassword(passwordEncoder.encode(command.password()));
        user.setUserStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        tokenRepository.delete(activationToken);

        if (user.getUserRole() == UserRole.COMMON && user.getSupervisor() != null) {
            eventPublisher.publishEvent(new SystemNewEmployeeEvent(
                    user.getId(),
                    user.getSupervisor(),
                    user.getFullName()
            ));
        }

        UserDetails userDetails = new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getName(),
                user.getSurname(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name())),
                user.getUserRole()
        );

        return jwtService.generateTokenPair(userDetails);
    }

    @Transactional
    public TokenPair login(LoginCommand command) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        command.email(),
                        command.password()
                )
        );

        var user = userRepository.findByEmail(command.email())
                .orElseThrow();

        if (user.getUserStatus() != UserStatus.ACTIVE) {
            throw new ApplicationException(ApiErrorCode.ACCESS_DENIED, "User account is not active.");
        }

        UserDetails userDetails = new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getName(),
                user.getSurname(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name())),
                user.getUserRole()
        );

        return jwtService.generateTokenPair(userDetails);
    }

    public String refreshAccessToken(String refreshToken) {
        final String userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                return jwtService.generateToken(userDetails);
            }
        }

        throw new ApplicationException(ApiErrorCode.INVALID_REFRESH_TOKEN);
    }
}
