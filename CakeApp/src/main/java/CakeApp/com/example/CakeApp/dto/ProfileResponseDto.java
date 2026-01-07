package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponseDto {

    private Long id;
    private String name;
    private String email;
    private String role;
}

