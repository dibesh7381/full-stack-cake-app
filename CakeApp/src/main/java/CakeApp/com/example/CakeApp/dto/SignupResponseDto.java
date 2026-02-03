package CakeApp.com.example.CakeApp.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SignupResponseDto {

    private String id;
    private String username;
    private String email;
    private String role;
    private LocalDateTime createdAt;
}
