package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShopResponseDto {
    private String id;
    private String shopName;
    private String shopPhone;
    private String shopAddress;
    private String shopImageUrl;
}

