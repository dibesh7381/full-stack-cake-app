package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AllCakesResponseDto {

    private Long cakeId;
    private Long sellerId;

    private String cakeType;
    private String flavour;
    private Double weightKg;
    private Double price;
    private String imageUrl;

    // shop info
    private Long shopId;
    private String shopName;
    private String city;
    private String state;
}

