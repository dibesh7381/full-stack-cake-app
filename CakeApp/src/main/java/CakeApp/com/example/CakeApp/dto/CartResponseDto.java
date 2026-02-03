package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartResponseDto {

    // user info
    private String userId;
    private String username;

    // product info
    private String cakeId;
    private String cakeName;
    private double cakePrice;
    private String cakeImageUrl;

    // cart info
    private int quantity;
}

