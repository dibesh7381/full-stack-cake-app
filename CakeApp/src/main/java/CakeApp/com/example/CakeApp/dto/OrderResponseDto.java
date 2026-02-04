package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDto {

    private String orderId;

    private String cakeName;
    private String cakeImageUrl;
    private double cakePrice;
    private int quantity;

    private String shopName;

    private double totalAmount;
    private String orderStatus;
}


