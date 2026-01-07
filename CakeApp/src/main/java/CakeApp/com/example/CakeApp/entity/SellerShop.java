package CakeApp.com.example.CakeApp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "seller_shops")
public class SellerShop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // users.id (FK-style, no constraint)
    @Column(name = "seller_id", nullable = false, unique = true)
    private Long sellerId;

    @Column(name = "shop_name", nullable = false)
    private String shopName;

    @Column(name = "owner_name", nullable = false)
    private String ownerName;

    private String address;
    private String city;
    private String state;
    private String pincode;

    @Column(name = "shop_image_url")
    private String shopImageUrl;
}

