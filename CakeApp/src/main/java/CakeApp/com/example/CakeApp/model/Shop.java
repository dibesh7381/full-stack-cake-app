package CakeApp.com.example.CakeApp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "shops")
public class Shop {

    @Id
    private String id;

    private String sellerId;
    private String shopName;
    private String shopPhone;
    private String shopAddress;
    private String shopImageUrl;
}

