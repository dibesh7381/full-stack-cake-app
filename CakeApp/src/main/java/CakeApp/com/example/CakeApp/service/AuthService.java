package CakeApp.com.example.CakeApp.service;
import CakeApp.com.example.CakeApp.config.CloudinaryConfig;
import CakeApp.com.example.CakeApp.dto.*;
import CakeApp.com.example.CakeApp.exception.CustomApiException;
import CakeApp.com.example.CakeApp.security.JwtUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    @PersistenceContext
    private EntityManager em;

    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CloudinaryConfig cloudinaryConfig;

    /* ================= SIGNUP ================= */
    @Transactional
    public SignupResponseDto signup(SignupRequestDto request) {

        Boolean exists = (Boolean) em.createNativeQuery("""
            SELECT EXISTS (
                SELECT 1 FROM users WHERE email = :email
            )
        """)
                .setParameter("email", request.getEmail())
                .getSingleResult();

        if (exists) {
            throw new CustomApiException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        Object[] row = (Object[]) em.createNativeQuery("""
            INSERT INTO users (name, email, password, role)
            VALUES (:name, :email, :password, 'CUSTOMER')
            RETURNING id, name, email, role
        """)
                .setParameter("name", request.getName())
                .setParameter("email", request.getEmail())
                .setParameter(
                        "password",
                        passwordEncoder.encode(request.getPassword())
                )
                .getSingleResult();

        return new SignupResponseDto(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                (String) row[3]
        );
    }

    /* ================= LOGIN ================= */
    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestDto request) {

        Object[] row;
        try {
            row = (Object[]) em.createNativeQuery("""
                SELECT id, name, email, password, role
                FROM users
                WHERE email = :email
            """)
                    .setParameter("email", request.getEmail())
                    .getSingleResult();
        } catch (NoResultException e) {
            throw new CustomApiException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                (String) row[3]
        )) {
            throw new CustomApiException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        String email = (String) row[2];
        String role  = (String) row[4];

        // 🔥 JWT SUBJECT = EMAIL
        String token = jwtUtil.generateToken(email, role);

        return new LoginResponseDto(
                ((Number) row[0]).longValue(),
                (String) row[1],
                email,
                role,
                token
        );
    }

    /* ================= PROFILE ================= */
    @Transactional(readOnly = true)
    public ProfileResponseDto getProfile(String email) {

        Object[] row;
        try {
            row = (Object[]) em.createNativeQuery("""
                SELECT id, name, email, role
                FROM users
                WHERE email = :email
            """)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (NoResultException e) {
            throw new CustomApiException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }

        return new ProfileResponseDto(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                (String) row[3]
        );
    }

    /* ================= ROLE UPGRADE ================= */
    @Transactional
    public String upgradeToSellerAndGenerateToken(String email) {

        String role;
        try {
            role = (String) em.createNativeQuery("""
                SELECT role FROM users WHERE email = :email
            """)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (NoResultException e) {
            throw new CustomApiException(
                    HttpStatus.NOT_FOUND,
                    "User not found"
            );
        }

        if ("SELLER".equals(role)) {
            throw new CustomApiException(
                    HttpStatus.BAD_REQUEST,
                    "User is already a seller"
            );
        }

        em.createNativeQuery("""
            UPDATE users SET role = 'SELLER' WHERE email = :email
        """)
                .setParameter("email", email)
                .executeUpdate();

        // 🔥 NEW TOKEN (EMAIL + SELLER)
        return jwtUtil.generateToken(email, "SELLER");
    }

    /* ================= HOME PAGE ================= */
    public HomePageDto getHomePage() {
        return new HomePageDto(
                "Welcome to CakeApp 🍰",
                "Freshly baked cakes, handcrafted with love."
        );
    }

    /* ================= CREATE SELLER SHOP ================= */
    @Transactional
    public SellerShopResponseDto createSellerShop(
            String email,
            SellerShopRequestDto dto,
            MultipartFile image
    ) {

        // 1️⃣ Get sellerId by email
        Long sellerId = ((Number) em.createNativeQuery("""
        SELECT id
        FROM users
        WHERE email = :email
    """)
                .setParameter("email", email)
                .getSingleResult()
        ).longValue();

        // 2️⃣ Check if seller shop already exists
        Boolean exists = (Boolean) em.createNativeQuery("""
        SELECT EXISTS (
            SELECT 1
            FROM seller_shops
            WHERE seller_id = :sellerId
        )
    """)
                .setParameter("sellerId", sellerId)
                .getSingleResult();

        if (exists) {
            throw new CustomApiException(
                    HttpStatus.BAD_REQUEST,
                    "Seller shop already exists"
            );
        }

        // 3️⃣ Upload image
        String imageUrl = cloudinaryConfig.uploadImage(image, "cakeapp/shops");

        // 4️⃣ Insert seller shop & return generated id
        Long shopId = ((Number) em.createNativeQuery("""
        INSERT INTO seller_shops (
            seller_id,
            shop_name,
            owner_name,
            address,
            city,
            state,
            pincode,
            shop_image_url
        )
        VALUES (
            :sellerId,
            :shopName,
            :ownerName,
            :address,
            :city,
            :state,
            :pincode,
            :imageUrl
        )
        RETURNING id
    """)
                .setParameter("sellerId", sellerId)
                .setParameter("shopName", dto.getShopName())
                .setParameter("ownerName", dto.getOwnerName())
                .setParameter("address", dto.getAddress())
                .setParameter("city", dto.getCity())
                .setParameter("state", dto.getState())
                .setParameter("pincode", dto.getPincode())
                .setParameter("imageUrl", imageUrl)
                .getSingleResult()
        ).longValue();

        // 5️⃣ Response DTO
        return new SellerShopResponseDto(
                shopId,
                sellerId,
                dto.getShopName(),
                dto.getOwnerName(),
                dto.getAddress(),
                dto.getCity(),
                dto.getState(),
                dto.getPincode(),
                imageUrl
        );
    }


    /* ================= UPDATE SELLER SHOP ================= */
    @Transactional
    public SellerShopResponseDto updateSellerShop(
            String email,
            SellerShopRequestDto dto,
            MultipartFile image
    ) {

        Object[] row;
        try {
            row = (Object[]) em.createNativeQuery("""
            SELECT s.id, s.seller_id, s.shop_image_url
            FROM seller_shops s
            JOIN users u ON u.id = s.seller_id
            WHERE u.email = :email
        """)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (NoResultException e) {
            throw new CustomApiException(
                    HttpStatus.NOT_FOUND,
                    "Seller shop not found"
            );
        }

        Long shopId = ((Number) row[0]).longValue();
        Long sellerId = ((Number) row[1]).longValue();
        String oldImage = (String) row[2];

        String imageUrl = oldImage;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryConfig.uploadImage(image, "cakeapp/shops");
        }

        em.createNativeQuery("""
        UPDATE seller_shops SET
          shop_name = :shopName,
          owner_name = :ownerName,
          address = :address,
          city = :city,
          state = :state,
          pincode = :pincode,
          shop_image_url = :imageUrl
        WHERE id = :shopId
    """)
                .setParameter("shopName", dto.getShopName())
                .setParameter("ownerName", dto.getOwnerName())
                .setParameter("address", dto.getAddress())
                .setParameter("city", dto.getCity())
                .setParameter("state", dto.getState())
                .setParameter("pincode", dto.getPincode())
                .setParameter("imageUrl", imageUrl)
                .setParameter("shopId", shopId)
                .executeUpdate();

        return new SellerShopResponseDto(
                shopId,
                sellerId,
                dto.getShopName(),
                dto.getOwnerName(),
                dto.getAddress(),
                dto.getCity(),
                dto.getState(),
                dto.getPincode(),
                imageUrl
        );
    }


    /* ================= ADD CAKE ================= */
    @Transactional
    public CakeResponseDto addCake(
            String email,
            CakeRequestDto dto,
            MultipartFile image
    ) {

        /* ================= GET SELLER ID ================= */
        Long sellerId = ((Number) em.createNativeQuery("""
        SELECT id
        FROM users
        WHERE email = :email
    """)
                .setParameter("email", email)
                .getSingleResult()
        ).longValue();

        /* ================= GET SHOP ID ================= */
        Long shopId;
        try {
            shopId = ((Number) em.createNativeQuery("""
            SELECT id
            FROM seller_shops
            WHERE seller_id = :sellerId
        """)
                    .setParameter("sellerId", sellerId)
                    .getSingleResult()
            ).longValue();
        } catch (NoResultException e) {
            throw new CustomApiException(
                    HttpStatus.BAD_REQUEST,
                    "Create shop before adding cakes"
            );
        }

        /* ================= UPLOAD IMAGE ================= */
        String imageUrl =
                cloudinaryConfig.uploadImage(image, "cakeapp/cakes");

        /* ================= INSERT CAKE + RETURN ID ================= */
        Long cakeId = ((Number) em.createNativeQuery("""
        INSERT INTO cakes (
            seller_id,
            shop_id,
            cake_type,
            flavour,
            weight_kg,
            price,
            image_url
        )
        VALUES (
            :sellerId,
            :shopId,
            :cakeType,
            :flavour,
            :weightKg,
            :price,
            :imageUrl
        )
        RETURNING id
    """)
                .setParameter("sellerId", sellerId)
                .setParameter("shopId", shopId)
                .setParameter("cakeType", dto.getCakeType())
                .setParameter("flavour", dto.getFlavour())
                .setParameter("weightKg", dto.getWeightKg())
                .setParameter("price", dto.getPrice())
                .setParameter("imageUrl", imageUrl)
                .getSingleResult()
        ).longValue();

        /* ================= RESPONSE ================= */
        return new CakeResponseDto(
                cakeId,                 // 🔥 generated id
                sellerId,
                shopId,
                dto.getCakeType(),
                dto.getFlavour(),
                dto.getWeightKg(),
                dto.getPrice(),
                imageUrl
        );
    }


    /* ================= GET ALL CAKES ================= */
    @Transactional(readOnly = true)
    public List<AllCakesResponseDto> getAllCakes() {

        List<Object[]> rows = em.createNativeQuery("""
        SELECT
          c.id,            -- 0 cakeId
          c.seller_id,     -- 1 sellerId ✅
          c.cake_type,     -- 2
          c.flavour,       -- 3
          c.weight_kg,     -- 4
          c.price,         -- 5
          c.image_url,     -- 6
          s.id,            -- 7 shopId
          s.shop_name,     -- 8
          s.city,          -- 9
          s.state          -- 10
        FROM cakes c
        JOIN seller_shops s ON s.id = c.shop_id
        ORDER BY c.id DESC
    """).getResultList();

        List<AllCakesResponseDto> result = new ArrayList<>();

        for (Object[] r : rows) {
            result.add(new AllCakesResponseDto(
                    ((Number) r[0]).longValue(),   // cakeId
                    ((Number) r[1]).longValue(),   // sellerId ✅
                    (String) r[2],                 // cakeType
                    (String) r[3],                 // flavour
                    ((Number) r[4]).doubleValue(), // weightKg
                    ((Number) r[5]).doubleValue(), // price
                    (String) r[6],                 // imageUrl
                    ((Number) r[7]).longValue(),   // shopId
                    (String) r[8],                 // shopName
                    (String) r[9],                 // city
                    (String) r[10]                 // state
            ));
        }

        return result;
    }


    @Transactional(readOnly = true)
    public List<CakeResponseDto> getSellerCakes(String email) {

        Long sellerId = ((Number) em.createNativeQuery("""
        SELECT id FROM users WHERE email = :email
    """).setParameter("email", email)
                .getSingleResult()).longValue();

        List<Object[]> rows = em.createNativeQuery("""
        SELECT id, cake_type, flavour, weight_kg, price, image_url
        FROM cakes
        WHERE seller_id = :sellerId
        ORDER BY id DESC
    """)
                .setParameter("sellerId", sellerId)
                .getResultList();

        List<CakeResponseDto> list = new ArrayList<>();

        for (Object[] r : rows) {
            list.add(new CakeResponseDto(
                    ((Number) r[0]).longValue(),
                    sellerId,
                    null,
                    (String) r[1],
                    (String) r[2],
                    ((Number) r[3]).doubleValue(),
                    ((Number) r[4]).doubleValue(),
                    (String) r[5]
            ));
        }
        return list;
    }

    @Transactional
    public void updateCake(
            String email,
            Long cakeId,
            CakeRequestDto dto,
            MultipartFile image
    ) {

        Long sellerId = ((Number) em.createNativeQuery("""
        SELECT id FROM users WHERE email = :email
    """).setParameter("email", email)
                .getSingleResult()).longValue();

        String imageSql = "";
        if (image != null && !image.isEmpty()) {
            String imageUrl =
                    cloudinaryConfig.uploadImage(image, "cakeapp/cakes");
            imageSql = ", image_url = '" + imageUrl + "'";
        }

        int updated = em.createNativeQuery("""
        UPDATE cakes SET
          cake_type = :cakeType,
          flavour   = :flavour,
          weight_kg = :weightKg,
          price     = :price
        """ + imageSql + """
        WHERE id = :cakeId AND seller_id = :sellerId
    """)
                .setParameter("cakeType", dto.getCakeType())
                .setParameter("flavour", dto.getFlavour())
                .setParameter("weightKg", dto.getWeightKg())
                .setParameter("price", dto.getPrice())
                .setParameter("cakeId", cakeId)
                .setParameter("sellerId", sellerId)
                .executeUpdate();

        if (updated == 0) {
            throw new CustomApiException(
                    HttpStatus.NOT_FOUND,
                    "Cake not found"
            );
        }
    }

    @Transactional
    public void deleteCake(String email, Long cakeId) {

        Long sellerId = ((Number) em.createNativeQuery("""
        SELECT id FROM users WHERE email = :email
    """).setParameter("email", email)
                .getSingleResult()).longValue();

        int deleted = em.createNativeQuery("""
        DELETE FROM cakes
        WHERE id = :cakeId AND seller_id = :sellerId
    """)
                .setParameter("cakeId", cakeId)
                .setParameter("sellerId", sellerId)
                .executeUpdate();

        if (deleted == 0) {
            throw new CustomApiException(
                    HttpStatus.NOT_FOUND,
                    "Cake not found"
            );
        }
    }

    @Transactional(readOnly = true)
    public SellerShopResponseDto getSellerShop(String email) {

        Object[] row;
        try {
            row = (Object[]) em.createNativeQuery("""
            SELECT
              s.id,
              s.seller_id,
              s.shop_name,
              s.owner_name,
              s.address,
              s.city,
              s.state,
              s.pincode,
              s.shop_image_url
            FROM seller_shops s
            JOIN users u ON u.id = s.seller_id
            WHERE u.email = :email
        """)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (NoResultException e) {
            throw new CustomApiException(
                    HttpStatus.NOT_FOUND,
                    "Seller shop not found"
            );
        }

        return new SellerShopResponseDto(
                ((Number) row[0]).longValue(),
                ((Number) row[1]).longValue(),
                (String) row[2],
                (String) row[3],
                (String) row[4],
                (String) row[5],
                (String) row[6],
                (String) row[7],
                (String) row[8]
        );
    }

    @Transactional(readOnly = true)
    public PageResponseDto<AllCakesResponseDto> getAllCakesPaginated(
            int page,
            int size
    ) {

        int offset = page * size;

        /* ===== TOTAL COUNT ===== */
        Number total = (Number) em.createNativeQuery("""
        SELECT COUNT(*)
        FROM cakes
    """).getSingleResult();

        /* ===== DATA QUERY ===== */
        List<Object[]> rows = em.createNativeQuery("""
        SELECT
          c.id,
          c.seller_id,
          c.cake_type,
          c.flavour,
          c.weight_kg,
          c.price,
          c.image_url,
          s.id,
          s.shop_name,
          s.city,
          s.state
        FROM cakes c
        JOIN seller_shops s ON s.id = c.shop_id
        ORDER BY c.id DESC
        LIMIT :limit OFFSET :offset
    """)
                .setParameter("limit", size)
                .setParameter("offset", offset)
                .getResultList();

        List<AllCakesResponseDto> list = new ArrayList<>();

        for (Object[] r : rows) {
            list.add(new AllCakesResponseDto(
                    ((Number) r[0]).longValue(),
                    ((Number) r[1]).longValue(),
                    (String) r[2],
                    (String) r[3],
                    ((Number) r[4]).doubleValue(),
                    ((Number) r[5]).doubleValue(),
                    (String) r[6],
                    ((Number) r[7]).longValue(),
                    (String) r[8],
                    (String) r[9],
                    (String) r[10]
            ));
        }

        int totalPages = (int) Math.ceil(total.doubleValue() / size);

        return new PageResponseDto<>(
                list,
                total.longValue(),
                totalPages,
                page,
                size
        );
    }

    private Long getOrCreateCart(Long customerId) {

        try {
            return ((Number) em.createNativeQuery("""
            SELECT id FROM cart WHERE customer_id = :cid
        """)
                    .setParameter("cid", customerId)
                    .getSingleResult()).longValue();

        } catch (NoResultException e) {

            return ((Number) em.createNativeQuery("""
            INSERT INTO cart (customer_id)
            VALUES (:cid)
            RETURNING id
        """)
                    .setParameter("cid", customerId)
                    .getSingleResult()).longValue();
        }
    }

    @Transactional
    public void addToCart(String email, AddToCartRequestDto dto) {

        Long customerId = ((Number) em.createNativeQuery("""
        SELECT id FROM users WHERE email = :email
    """)
                .setParameter("email", email)
                .getSingleResult()).longValue();

        Long cartId = getOrCreateCart(customerId);

        Double price = ((Number) em.createNativeQuery("""
        SELECT price FROM cakes WHERE id = :cakeId
    """)
                .setParameter("cakeId", dto.getCakeId())
                .getSingleResult()).doubleValue();

        em.createNativeQuery("""
        INSERT INTO cart_items (cart_id, cake_id, quantity, price)
        VALUES (:cartId, :cakeId, :qty, :price)
        ON CONFLICT (cart_id, cake_id)
        DO UPDATE SET quantity = cart_items.quantity + :qty
    """)
                .setParameter("cartId", cartId)
                .setParameter("cakeId", dto.getCakeId())
                .setParameter("qty", dto.getQuantity())
                .setParameter("price", price)
                .executeUpdate();
    }

    @Transactional(readOnly = true)
    public CartResponseDto getMyCart(String email) {

        Long customerId = ((Number) em.createNativeQuery("""
        SELECT id FROM users WHERE email = :email
    """)
                .setParameter("email", email)
                .getSingleResult()).longValue();

        Long cartId = getOrCreateCart(customerId);

        List<Object[]> rows = em.createNativeQuery("""
        SELECT
          ci.id,           -- 0 cartItemId
          c.id,            -- 1 cakeId
          c.cake_type,     -- 2 cakeType
          c.image_url,     -- 3 ✅ imageUrl
          ci.price,        -- 4 price
          ci.quantity      -- 5 quantity
        FROM cart_items ci
        JOIN cakes c ON c.id = ci.cake_id
        WHERE ci.cart_id = :cartId
        ORDER BY ci.id DESC
    """)
                .setParameter("cartId", cartId)
                .getResultList();

        List<CartItemResponseDto> items = new ArrayList<>();
        double grandTotal = 0;

        for (Object[] r : rows) {

            double price = ((Number) r[4]).doubleValue();
            int quantity = ((Number) r[5]).intValue();
            double total = price * quantity;
            grandTotal += total;

            items.add(new CartItemResponseDto(
                    ((Number) r[0]).longValue(), // cartItemId
                    ((Number) r[1]).longValue(), // cakeId
                    (String) r[2],               // cakeType
                    (String) r[3],               // ✅ imageUrl
                    price,
                    quantity,
                    total
            ));
        }

        return new CartResponseDto(cartId, items, grandTotal);
    }


    @Transactional
    public void updateCartQuantity(
            Long cartItemId,
            UpdateCartQuantityRequestDto dto
    ) {
        if (dto.getQuantity() <= 0) {
            removeCartItem(cartItemId);
            return;
        }

        em.createNativeQuery("""
        UPDATE cart_items
        SET quantity = :qty
        WHERE id = :id
    """)
                .setParameter("qty", dto.getQuantity())
                .setParameter("id", cartItemId)
                .executeUpdate();
    }

    @Transactional
    public void removeCartItem(Long cartItemId) {
        em.createNativeQuery("""
        DELETE FROM cart_items WHERE id = :id
    """)
                .setParameter("id", cartItemId)
                .executeUpdate();
    }

    @Transactional
    public void clearMyCart(String email) {

        Long customerId = ((Number) em.createNativeQuery("""
        SELECT id FROM users WHERE email = :email
    """)
                .setParameter("email", email)
                .getSingleResult()).longValue();

        em.createNativeQuery("""
        DELETE FROM cart_items
        WHERE cart_id = (
            SELECT id FROM cart WHERE customer_id = :cid
        )
    """)
                .setParameter("cid", customerId)
                .executeUpdate();
    }

}

