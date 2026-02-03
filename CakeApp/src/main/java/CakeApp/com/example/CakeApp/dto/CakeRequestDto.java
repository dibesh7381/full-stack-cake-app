package CakeApp.com.example.CakeApp.dto;

import lombok.Data;

@Data
public class CakeRequestDto {

    private String cakeName;
    private String cakeFlavour;
    private double cakeWeight;
    private double cakePrice;
}

