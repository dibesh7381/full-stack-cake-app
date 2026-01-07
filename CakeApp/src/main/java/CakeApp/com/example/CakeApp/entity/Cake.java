package CakeApp.com.example.CakeApp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cakes")
public class Cake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // users.id
    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    // seller_shops.id
    @Column(name = "shop_id", nullable = false)
    private Long shopId;

    @Column(name = "cake_type", nullable = false)
    private String cakeType;

    @Column(nullable = false)
    private String flavour;

    @Column(name = "weight_kg", nullable = false)
    private Double weightKg;

    @Column(nullable = false)
    private Double price;

    @Column(name = "image_url")
    private String imageUrl;
}

