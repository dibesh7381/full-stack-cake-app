package CakeApp.com.example.CakeApp.dto;

import lombok.Data;

@Data
public class AddToCartRequestDto {
    private Long cakeId;
    private Integer quantity; // usually 1
}

