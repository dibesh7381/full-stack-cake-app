package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BecomeSellerResponseDto {

    private String message;
    private String role;
    private String token;
}
