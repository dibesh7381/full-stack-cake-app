package CakeApp.com.example.CakeApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String userId;
    private String username;

    private String sellerId;
    private String sellerEmail;

    // ordered cake details (flat)
    private String cakeId;
    private String cakeName;
    private String cakeImageUrl;
    private double cakePrice;
    private int quantity;

    private double totalAmount;

    // Address
    private String houseNo;
    private String colony;
    private String landmark;
    private String pincode;
    private String mobileNumber;

    // Payment
    private String paymentMethod; // COD / UPI / BANK

    private String orderStatus = "PLACED";

    private LocalDateTime createdAt = LocalDateTime.now();
}

