package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CakeResponseDto {

    private String id;
    private String cakeName;
    private String cakeFlavour;
    private double cakeWeight;
    private double cakePrice;
    private String cakeImageUrl;
}

