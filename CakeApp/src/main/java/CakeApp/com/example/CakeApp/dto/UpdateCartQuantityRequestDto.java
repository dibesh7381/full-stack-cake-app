package CakeApp.com.example.CakeApp.dto;

import lombok.Data;

@Data
public class UpdateCartQuantityRequestDto {
    private String cakeId;
    private int quantity; // +1 or -1
}
