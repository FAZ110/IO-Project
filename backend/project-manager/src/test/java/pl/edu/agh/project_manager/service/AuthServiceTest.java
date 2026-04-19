package pl.edu.agh.project_manager.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.edu.agh.project_manager.domain.entity.ActivationToken;
import pl.edu.agh.project_manager.domain.entity.User;
import pl.edu.agh.project_manager.domain.enums.UserRole;
import pl.edu.agh.project_manager.domain.enums.UserStatus;
import pl.edu.agh.project_manager.domain.exception.ApiErrorCode;
import pl.edu.agh.project_manager.domain.exception.ApplicationException;
import pl.edu.agh.project_manager.repository.ActivationTokenRepository;
import pl.edu.agh.project_manager.repository.UserRepository;
import pl.edu.agh.project_manager.security.JwtService;
import pl.edu.agh.project_manager.security.TokenPair;
import pl.edu.agh.project_manager.service.command.auth.LoginCommand;
import pl.edu.agh.project_manager.service.command.auth.RegisterCommand;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ActivationTokenRepository tokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;


    @Test
    void login_ShouldReturnTokenPair_WhenCredentialsAreValidAndUserIsActive() {
        // given
        LoginCommand command = new LoginCommand("test@test.com", "password");
        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("encoded-password");
        user.setUserRole(UserRole.COMMON);
        user.setUserStatus(UserStatus.ACTIVE);

        TokenPair expectedTokenPair = new TokenPair("access-token", "refresh-token");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail(command.email())).thenReturn(Optional.of(user));
        when(jwtService.generateTokenPair(any(UserDetails.class))).thenReturn(expectedTokenPair);

        // when
        TokenPair result = authService.login(command);

        // then
        assertEquals(expectedTokenPair.accessToken(), result.accessToken());
        assertEquals(expectedTokenPair.refreshToken(), result.refreshToken());
    }

    @Test
    void login_ShouldThrowAccessDenied_WhenUserIsNotActive() {
        // given
        LoginCommand command = new LoginCommand("test@test.com", "password");
        User inactiveUser = new User();
        inactiveUser.setEmail("test@test.com");
        inactiveUser.setUserStatus(UserStatus.PENDING);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail(command.email())).thenReturn(Optional.of(inactiveUser));

        // when & then
        ApplicationException exception = assertThrows(
                ApplicationException.class,
                () -> authService.login(command)
        );

        assertEquals(ApiErrorCode.ACCESS_DENIED, exception.getErrorCode());
        verify(jwtService, never()).generateTokenPair(any(UserDetails.class));
    }


    @Test
    void register_ShouldThrowException_WhenTokenIsExpired() {
        // given
        RegisterCommand command = new RegisterCommand("token123", "John", "Doe", "password");

        ActivationToken mockToken = mock(ActivationToken.class);
        when(mockToken.isExpired()).thenReturn(true);

        when(tokenRepository.findByToken(command.activationToken()))
                .thenReturn(Optional.of(mockToken));

        // when & then
        ApplicationException exception = assertThrows(
                ApplicationException.class,
                () -> authService.register(command)
        );

        assertEquals(ApiErrorCode.ACTIVATION_TOKEN_EXPIRED, exception.getErrorCode());

        verify(tokenRepository).delete(mockToken);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void refreshAccessToken_ShouldThrowException_WhenTokenIsInvalid() {
        // given
        String badToken = "invalid-jwt-token";
        when(jwtService.extractUsername(badToken)).thenReturn(null);

        // when & then
        ApplicationException exception = assertThrows(
                ApplicationException.class,
                () -> authService.refreshAccessToken(badToken)
        );

        assertEquals(ApiErrorCode.INVALID_REFRESH_TOKEN, exception.getErrorCode());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void refreshAccessToken_ShouldReturnNewToken_WhenRefreshTokenIsValid() {
        // given
        String validRefreshToken = "valid-refresh-token";
        String userEmail = "test@test.com";
        String expectedAccessToken = "new-access-token";

        UserDetails mockUserDetails = mock(UserDetails.class);

        when(jwtService.extractUsername(validRefreshToken)).thenReturn(userEmail);
        when(userDetailsService.loadUserByUsername(userEmail)).thenReturn(mockUserDetails);
        when(jwtService.isTokenValid(validRefreshToken, mockUserDetails)).thenReturn(true);
        when(jwtService.generateToken(mockUserDetails)).thenReturn(expectedAccessToken);

        // when
        String result = authService.refreshAccessToken(validRefreshToken);

        // then
        assertEquals(expectedAccessToken, result);
    }
}