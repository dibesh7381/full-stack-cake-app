package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SellerShopResponseDto {

    private Long id;
    private Long sellerId;

    private String shopName;
    private String ownerName;
    private String address;
    private String city;
    private String state;
    private String pincode;

    private String shopImageUrl;
}
