package pl.edu.agh.project_manager.controller;

import jakarta.validation.Valid;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.project_manager.controller.dto.auth.AuthResponse;
import pl.edu.agh.project_manager.controller.dto.auth.LoginRequest;
import pl.edu.agh.project_manager.controller.dto.auth.RegisterRequest;
import pl.edu.agh.project_manager.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @NonNull
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        String accessToken = authService.register(registerRequest.toCommand());
        return ResponseEntity.ok(new AuthResponse(accessToken));

    }

    @PostMapping("/login")
    @NonNull
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        String accessToken = authService.login(loginRequest.toCommand());
        return ResponseEntity.ok(new AuthResponse(accessToken));

    }
}
