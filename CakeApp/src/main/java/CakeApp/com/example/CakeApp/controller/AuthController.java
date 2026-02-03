package CakeApp.com.example.CakeApp.controller;

import CakeApp.com.example.CakeApp.dto.*;
import CakeApp.com.example.CakeApp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    // ================= SIGNUP =================
    @PostMapping("/signup")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDto<SignupResponseDto>> signup(
            @RequestBody SignupRequestDto request
    ) {

        SignupResponseDto response = authService.signup(request);

        return new ResponseEntity<>(
                new ApiResponseDto<>(true, "Signup successful", response),
                HttpStatus.CREATED
        );
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDto<LoginResponseDto>> login(
            @RequestBody LoginRequestDto request
    ) {

        LoginResponseDto response = authService.login(request);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Login successful", response)
        );
    }

    // ================= HOME =================
    @GetMapping("/homepage")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDto<HomeResponseDto>> home() {

        HomeResponseDto response = authService.home();

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Home loaded successfully", response)
        );
    }

    // ================= PROFILE =================
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<ProfileResponseDto>> profile(
            Authentication authentication
    ) {

        String userId = authentication.getPrincipal().toString();

        ProfileResponseDto response = authService.profile(userId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Profile fetched successfully", response)
        );
    }

    // ================= BECOME SELLER =================
    @PutMapping("/become-seller")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDto<BecomeSellerResponseDto>> becomeSeller(
            Authentication authentication
    ) {

        String userId = authentication.getPrincipal().toString();

        BecomeSellerResponseDto response = authService.becomeSeller(userId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Role updated successfully", response)
        );
    }

    // ================= SHOP =================
    @PostMapping("/shop")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<ShopResponseDto>> createShop(
            Authentication authentication,
            ShopRequestDto request,
            MultipartFile image
    ) throws Exception {

        String sellerId = authentication.getPrincipal().toString();

        ShopResponseDto response =
                authService.createShop(sellerId, request, image);

        return new ResponseEntity<>(
                new ApiResponseDto<>(true, "Shop created successfully", response),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/shop")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<ShopResponseDto>> getMyShop(
            Authentication authentication
    ) {

        String sellerId = authentication.getPrincipal().toString();

        ShopResponseDto response = authService.getMyShop(sellerId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Shop fetched successfully", response)
        );
    }

    @PutMapping("/shop")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<ShopResponseDto>> updateShop(
            Authentication authentication,
            ShopRequestDto request,
            MultipartFile image
    ) throws Exception {

        String sellerId = authentication.getPrincipal().toString();

        ShopResponseDto response =
                authService.updateShop(sellerId, request, image);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Shop updated successfully", response)
        );
    }

    @DeleteMapping("/shop")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<String>> deleteShop(
            Authentication authentication
    ) {

        String sellerId = authentication.getPrincipal().toString();

        String response = authService.deleteShop(sellerId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Shop deleted successfully", response)
        );
    }

    // ================= CAKES =================
    @PostMapping("/cakes")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<CakeResponseDto>> addCake(
            Authentication authentication,
            CakeRequestDto request,
            MultipartFile image
    ) throws Exception {

        String sellerId = authentication.getPrincipal().toString();

        CakeResponseDto response =
                authService.addCake(sellerId, request, image);

        return new ResponseEntity<>(
                new ApiResponseDto<>(true, "Cake added successfully", response),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/cakes")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<List<CakeResponseDto>>> getMyCakes(
            Authentication authentication
    ) {

        String sellerId = authentication.getPrincipal().toString();

        List<CakeResponseDto> response =
                authService.getMyCakes(sellerId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Cakes fetched successfully", response)
        );
    }

    @GetMapping("/cakes/all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<List<PublicCakeResponseDto>>> getAllCakes() {

        List<PublicCakeResponseDto> response =
                authService.getAllCakes();

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "All cakes fetched successfully", response)
        );
    }

    @PutMapping("/cakes/{cakeId}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<CakeResponseDto>> updateCake(
            Authentication authentication,
            @PathVariable String cakeId,
            CakeRequestDto request,
            MultipartFile image
    ) throws Exception {

        String sellerId = authentication.getPrincipal().toString();

        CakeResponseDto response =
                authService.updateCake(sellerId, cakeId, request, image);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Cake updated successfully", response)
        );
    }

    @DeleteMapping("/cakes/{cakeId}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<String>> deleteCake(
            Authentication authentication,
            @PathVariable String cakeId
    ) {

        String sellerId = authentication.getPrincipal().toString();

        String response =
                authService.deleteCake(sellerId, cakeId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Cake deleted successfully", response)
        );
    }

    // ================= CART =================

    // ➕ ADD TO CART
    @PostMapping("/cart/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<CartResponseDto>> addToCart(
            Authentication authentication,
            @RequestBody AddToCartRequestDto request
    ) {

        String userId = authentication.getPrincipal().toString();

        CartResponseDto response =
                authService.addToCart(userId, request);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Item added to cart", response)
        );
    }

    // ➕➖ UPDATE QUANTITY
    @PutMapping("/cart/quantity")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<CartResponseDto>> updateCartQuantity(
            Authentication authentication,
            @RequestBody UpdateCartQuantityRequestDto request
    ) {

        String userId = authentication.getPrincipal().toString();

        CartResponseDto response =
                authService.updateCartQuantity(userId, request);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Cart updated", response)
        );
    }

    // 🛒 GET MY CART
    @GetMapping("/cart")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<List<CartResponseDto>>> getMyCart(
            Authentication authentication
    ) {

        String userId = authentication.getPrincipal().toString();

        List<CartResponseDto> response =
                authService.getMyCart(userId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Cart fetched successfully", response)
        );
    }

    // ❌ REMOVE SINGLE ITEM
    @DeleteMapping("/cart/item/{cakeId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<String>> removeCartItem(
            Authentication authentication,
            @PathVariable String cakeId
    ) {

        String userId = authentication.getPrincipal().toString();

        String response =
                authService.removeCartItem(userId, cakeId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Item removed from cart", response)
        );
    }

    // 🧹 CLEAR CART
    @DeleteMapping("/cart/clear")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<String>> clearCart(
            Authentication authentication
    ) {

        String userId = authentication.getPrincipal().toString();

        String response =
                authService.clearCart(userId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Cart cleared", response)
        );
    }
}




