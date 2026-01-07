package CakeApp.com.example.CakeApp.dto;

import lombok.Data;

@Data
public class SellerShopRequestDto {
    private String shopName;
    private String ownerName;
    private String address;
    private String city;
    private String state;
    private String pincode;
}
