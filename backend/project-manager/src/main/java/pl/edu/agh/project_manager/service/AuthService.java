package pl.edu.agh.project_manager.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.edu.agh.project_manager.domain.entity.ActivationToken;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ActivationTokenRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.security.JwtService;
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

    @Transactional
    public String register(RegisterCommand command) {
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

        UserDetails userDetails = new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserRole().name()))
        );

        return jwtService.generateToken(userDetails);
    }

    @Transactional
    public String login(LoginCommand command) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        command.email(),
                        command.password()
                )
        );

        var user = userRepository.findByEmail(command.email())
                .orElseThrow();

        UserDetails userDetails = new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getUserRole().name()))
        );

        return jwtService.generateToken(userDetails);
    }
}
