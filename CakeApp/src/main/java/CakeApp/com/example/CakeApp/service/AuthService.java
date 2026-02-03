package CakeApp.com.example.CakeApp.service;

import CakeApp.com.example.CakeApp.config.CloudinaryConfig;
import CakeApp.com.example.CakeApp.dto.*;
import CakeApp.com.example.CakeApp.model.*;
import CakeApp.com.example.CakeApp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MongoTemplate mongoTemplate;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CloudinaryConfig cloudinaryConfig;


    // ================= SIGNUP =================
    public SignupResponseDto signup(SignupRequestDto request) {

        Query emailCheckQuery = new Query(
                Criteria.where("email").is(request.getEmail())
        );

        if (mongoTemplate.exists(emailCheckQuery, User.class)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CUSTOMER");

        User savedUser = mongoTemplate.save(user);

        SignupResponseDto response = new SignupResponseDto();
        response.setId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());
        response.setCreatedAt(savedUser.getCreatedAt());

        return response;
    }

    // ================= LOGIN =================
    public LoginResponseDto login(LoginRequestDto request) {

        Query loginQuery = new Query(
                Criteria.where("email").is(request.getEmail())
        );

        User user = mongoTemplate.findOne(loginQuery, User.class);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole());

        LoginResponseDto response = new LoginResponseDto();
        response.setToken(token);
        response.setId(user.getId());
        response.setRole(user.getRole());

        return response;
    }

    // ================= HOME (NO DB, HARD CODED) =================
    public HomeResponseDto home() {

        return new HomeResponseDto(
                "Welcome to CakeApp 🎂",
                "CakeApp is a secure platform to order delicious cakes using JWT authentication."
        );
    }

    // ================= PROFILE =================
    public ProfileResponseDto profile(String userId) {

        Query query = new Query(
                Criteria.where("id").is(userId)
        );

        User user = mongoTemplate.findOne(query, User.class);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return new ProfileResponseDto(
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    // ================= BECOME SELLER =================
    public BecomeSellerResponseDto becomeSeller(String userId) {

        Query query = new Query(
                Criteria.where("id").is(userId)
        );

        User user = mongoTemplate.findOne(query, User.class);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if ("SELLER".equals(user.getRole())) {
            throw new RuntimeException("User is already a seller");
        }

        // change role
        user.setRole("SELLER");
        mongoTemplate.save(user);

        // generate NEW token with updated role
        String newToken = jwtUtil.generateToken(user.getId(), user.getRole());

        return new BecomeSellerResponseDto(
                "You are now a SELLER 🎉",
                user.getRole(),
                newToken
        );
    }

    public ShopResponseDto createShop(
            String sellerId,
            ShopRequestDto request,
            MultipartFile image
    ) throws Exception {

        User seller = mongoTemplate.findById(sellerId, User.class);

        if (seller == null || !"SELLER".equals(seller.getRole())) {
            throw new RuntimeException("Only SELLER can create shop");
        }

        // check existing shop
        Query checkQuery = new Query(
                Criteria.where("sellerId").is(sellerId)
        );

        if (mongoTemplate.exists(checkQuery, Shop.class)) {
            throw new RuntimeException("Seller already has a shop");
        }

        String imageUrl = cloudinaryConfig.uploadImage(image);

        Shop shop = new Shop();
        shop.setSellerId(sellerId);
        shop.setShopName(request.getShopName());
        shop.setShopPhone(request.getShopPhone());
        shop.setShopAddress(request.getShopAddress());
        shop.setShopImageUrl(imageUrl);

        Shop savedShop = mongoTemplate.save(shop);

        return new ShopResponseDto(
                savedShop.getId(),
                savedShop.getShopName(),
                savedShop.getShopPhone(),
                savedShop.getShopAddress(),
                savedShop.getShopImageUrl()
        );
    }

    public ShopResponseDto getMyShop(String sellerId) {

        Query query = new Query(
                Criteria.where("sellerId").is(sellerId)
        );

        Shop shop = mongoTemplate.findOne(query, Shop.class);

        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }

        return new ShopResponseDto(
                shop.getId(),
                shop.getShopName(),
                shop.getShopPhone(),
                shop.getShopAddress(),
                shop.getShopImageUrl()
        );
    }

    public ShopResponseDto updateShop(
            String sellerId,
            ShopRequestDto request,
            MultipartFile image
    ) throws Exception {

        Query query = new Query(
                Criteria.where("sellerId").is(sellerId)
        );

        Shop shop = mongoTemplate.findOne(query, Shop.class);

        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }

        shop.setShopName(request.getShopName());
        shop.setShopPhone(request.getShopPhone());
        shop.setShopAddress(request.getShopAddress());

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryConfig.uploadImage(image);
            shop.setShopImageUrl(imageUrl);
        }

        Shop updatedShop = mongoTemplate.save(shop);

        return new ShopResponseDto(
                updatedShop.getId(),
                updatedShop.getShopName(),
                updatedShop.getShopPhone(),
                updatedShop.getShopAddress(),
                updatedShop.getShopImageUrl()
        );
    }

    public String deleteShop(String sellerId) {

        Query query = new Query(
                Criteria.where("sellerId").is(sellerId)
        );

        Shop shop = mongoTemplate.findOne(query, Shop.class);

        if (shop == null) {
            throw new RuntimeException("Shop not found");
        }

        mongoTemplate.remove(shop);

        return "Shop deleted successfully ❌";
    }

    public CakeResponseDto addCake(
            String sellerId,
            CakeRequestDto request,
            MultipartFile image
    ) throws Exception {

        // seller ka shop check
        Query shopQuery = new Query(
                Criteria.where("sellerId").is(sellerId)
        );
        Shop shop = mongoTemplate.findOne(shopQuery, Shop.class);

        if (shop == null) {
            throw new RuntimeException("Create shop before adding cakes");
        }

        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Cake image is required");
        }

        String imageUrl = cloudinaryConfig.uploadImage(image);

        Cake cake = new Cake();
        cake.setSellerId(sellerId);
        cake.setShopId(shop.getId());
        cake.setCakeName(request.getCakeName());
        cake.setCakeFlavour(request.getCakeFlavour());
        cake.setCakeWeight(request.getCakeWeight());
        cake.setCakePrice(request.getCakePrice());
        cake.setCakeImageUrl(imageUrl);

        Cake savedCake = mongoTemplate.save(cake);

        return new CakeResponseDto(
                savedCake.getId(),
                savedCake.getCakeName(),
                savedCake.getCakeFlavour(),
                savedCake.getCakeWeight(),
                savedCake.getCakePrice(),
                savedCake.getCakeImageUrl()
        );
    }

    public List<CakeResponseDto> getMyCakes(String sellerId) {

        Query query = new Query(
                Criteria.where("sellerId").is(sellerId)
        );

        List<Cake> cakes = mongoTemplate.find(query, Cake.class);

        return cakes.stream()
                .map(c -> new CakeResponseDto(
                        c.getId(),
                        c.getCakeName(),
                        c.getCakeFlavour(),
                        c.getCakeWeight(),
                        c.getCakePrice(),
                        c.getCakeImageUrl()
                ))
                .collect(Collectors.toList());
    }

    public CakeResponseDto updateCake(
            String sellerId,
            String cakeId,
            CakeRequestDto request,
            MultipartFile image
    ) throws Exception {

        Cake cake = mongoTemplate.findById(cakeId, Cake.class);

        if (cake == null || !cake.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Cake not found or unauthorized");
        }

        cake.setCakeName(request.getCakeName());
        cake.setCakeFlavour(request.getCakeFlavour());
        cake.setCakeWeight(request.getCakeWeight());
        cake.setCakePrice(request.getCakePrice());

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryConfig.uploadImage(image);
            cake.setCakeImageUrl(imageUrl);
        }

        Cake updatedCake = mongoTemplate.save(cake);

        return new CakeResponseDto(
                updatedCake.getId(),
                updatedCake.getCakeName(),
                updatedCake.getCakeFlavour(),
                updatedCake.getCakeWeight(),
                updatedCake.getCakePrice(),
                updatedCake.getCakeImageUrl()
        );
    }

    public String deleteCake(String sellerId, String cakeId) {

        Cake cake = mongoTemplate.findById(cakeId, Cake.class);

        if (cake == null || !cake.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Cake not found or unauthorized");
        }

        mongoTemplate.remove(cake);

        return "Cake deleted successfully ❌";
    }

    public List<PublicCakeResponseDto> getAllCakes() {

        List<Cake> cakes = mongoTemplate.findAll(Cake.class);

        return cakes.stream().map(cake -> {

            Shop shop = mongoTemplate.findById(cake.getShopId(), Shop.class);

            String shopName = (shop != null) ? shop.getShopName() : "Unknown Shop";

            return new PublicCakeResponseDto(
                    cake.getId(),
                    cake.getCakeName(),
                    cake.getCakeFlavour(),
                    cake.getCakeWeight(),
                    cake.getCakePrice(),
                    cake.getCakeImageUrl(),
                    shopName
            );
        }).collect(Collectors.toList());
    }

    public CartResponseDto addToCart(String userId, AddToCartRequestDto request) {

        User user = mongoTemplate.findById(userId, User.class);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Cake cake = mongoTemplate.findById(request.getCakeId(), Cake.class);
        if (cake == null) {
            throw new RuntimeException("Cake not found");
        }

        Query query = new Query(
                Criteria.where("userId").is(userId)
                        .and("cakeId").is(cake.getId())
        );

        Cart cart = mongoTemplate.findOne(query, Cart.class);

        if (cart != null) {
            cart.setQuantity(cart.getQuantity() + 1);
        } else {
            cart = new Cart();
            cart.setUserId(user.getId());
            cart.setUsername(user.getUsername());
            cart.setCakeId(cake.getId());
            cart.setCakeName(cake.getCakeName());
            cart.setCakePrice(cake.getCakePrice());
            cart.setCakeImageUrl(cake.getCakeImageUrl());
            cart.setQuantity(1);
        }

        Cart saved = mongoTemplate.save(cart);

        return new CartResponseDto(
                saved.getUserId(),
                saved.getUsername(),
                saved.getCakeId(),
                saved.getCakeName(),
                saved.getCakePrice(),
                saved.getCakeImageUrl(),
                saved.getQuantity()
        );
    }

    public CartResponseDto updateCartQuantity(String userId, UpdateCartQuantityRequestDto request) {

        Query query = new Query(
                Criteria.where("userId").is(userId)
                        .and("cakeId").is(request.getCakeId())
        );

        Cart cart = mongoTemplate.findOne(query, Cart.class);

        if (cart == null) {
            throw new RuntimeException("Cart item not found");
        }

        int newQty = cart.getQuantity() + request.getQuantity();

        if (newQty <= 0) {
            mongoTemplate.remove(cart);
            return null;
        }

        cart.setQuantity(newQty);
        Cart updated = mongoTemplate.save(cart);

        return new CartResponseDto(
                updated.getUserId(),
                updated.getUsername(),
                updated.getCakeId(),
                updated.getCakeName(),
                updated.getCakePrice(),
                updated.getCakeImageUrl(),
                updated.getQuantity()
        );
    }

    public List<CartResponseDto> getMyCart(String userId) {

        Query query = new Query(
                Criteria.where("userId").is(userId)
        );

        List<Cart> carts = mongoTemplate.find(query, Cart.class);

        return carts.stream()
                .map(c -> new CartResponseDto(
                        c.getUserId(),
                        c.getUsername(),
                        c.getCakeId(),
                        c.getCakeName(),
                        c.getCakePrice(),
                        c.getCakeImageUrl(),
                        c.getQuantity()
                ))
                .collect(Collectors.toList());
    }

    public String removeCartItem(String userId, String cakeId) {

        Query query = new Query(
                Criteria.where("userId").is(userId)
                        .and("cakeId").is(cakeId)
        );

        mongoTemplate.remove(query, Cart.class);

        return "Item removed from cart ❌";
    }

    public String clearCart(String userId) {

        Query query = new Query(
                Criteria.where("userId").is(userId)
        );

        mongoTemplate.remove(query, Cart.class);

        return "Cart cleared successfully 🧹";
    }

}

