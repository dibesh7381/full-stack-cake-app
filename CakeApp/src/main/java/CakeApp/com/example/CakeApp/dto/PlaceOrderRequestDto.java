package CakeApp.com.example.CakeApp.dto;

import lombok.Data;

@Data
public class PlaceOrderRequestDto {

    private String cakeId;
    private int quantity;

    private String houseNo;
    private String colony;
    private String landmark;
    private String pincode;
    private String mobileNumber;

    private String paymentMethod;
}

