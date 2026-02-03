package CakeApp.com.example.CakeApp.dto;

import lombok.Data;

@Data
public class LoginResponseDto {

    private String token;
    private String id;
    private String role;
}
