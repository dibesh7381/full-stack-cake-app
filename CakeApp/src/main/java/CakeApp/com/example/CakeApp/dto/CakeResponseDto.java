package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CakeResponseDto {

    private Long id;

    private Long sellerId;
    private Long shopId;

    private String cakeType;
    private String flavour;

    private Double weightKg;   // 🔥 NEW
    private Double price;

    private String imageUrl;
}

