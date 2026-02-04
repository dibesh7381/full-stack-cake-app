package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SellerOrderResponseDto {

    private String orderId;

    private String customerName;
    private String customerEmail;

    private String cakeName;
    private String cakeImageUrl;
    private double cakePrice;
    private int quantity;

    private double totalAmount;
    private String orderStatus;
}
