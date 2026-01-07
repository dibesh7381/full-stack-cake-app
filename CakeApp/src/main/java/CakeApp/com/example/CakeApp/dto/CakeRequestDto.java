package CakeApp.com.example.CakeApp.dto;

import lombok.Data;

@Data
public class CakeRequestDto {

    private String cakeType;
    private String flavour;

    private Double weightKg;   // 🔥 NEW
    private Double price;
}

