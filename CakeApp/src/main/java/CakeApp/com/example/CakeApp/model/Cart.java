package CakeApp.com.example.CakeApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "cart")
public class Cart {

    @Id
    private String id;

    private String userId;
    private String username;
    private String cakeId;
    private String cakeName;
    private double cakePrice;
    private String cakeImageUrl;
    private int quantity;
}
