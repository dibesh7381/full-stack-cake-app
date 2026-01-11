package CakeApp.com.example.CakeApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CartItemResponseDto {

    private Long cartItemId;
    private Long cakeId;
    private String cakeType;
    private String imageUrl;
    private Double price;
    private Integer quantity;
    private Double totalPrice;
}

