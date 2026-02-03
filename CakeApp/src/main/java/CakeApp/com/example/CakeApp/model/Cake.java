package CakeApp.com.example.CakeApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "cakes")
public class Cake {

    @Id
    private String id;

    private String sellerId;   // security check
    private String shopId;     // kis shop ka cake

    private String cakeName;
    private String cakeFlavour;
    private double cakeWeight; // in kg (0.5, 1, 2 etc)
    private double cakePrice;

    private String cakeImageUrl;

    private LocalDateTime createdAt = LocalDateTime.now();
}

