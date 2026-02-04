package CakeApp.com.example.CakeApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "seller_orders")
public class SellerOrder {

    @Id
    private String id;

    private String orderId;

    private String sellerId;

    private String customerName;
    private String customerEmail;

    private String cakeId;
    private String cakeName;
    private String cakeImageUrl;
    private double cakePrice;
    private int quantity;

    private double totalAmount;
    private String orderStatus;
}

