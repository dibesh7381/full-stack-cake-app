package CakeApp.com.example.CakeApp.controller;

import CakeApp.com.example.CakeApp.dto.*;
import CakeApp.com.example.CakeApp.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    /* ================= HOME PAGE ================= */
    @GetMapping("/homepage")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDto<HomePageDto>> home() {

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "Home page loaded",
                        authService.getHomePage()
                )
        );
    }

    /* ================= SIGNUP ================= */
    @PostMapping("/signup")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDto<SignupResponseDto>> signup(
            @RequestBody SignupRequestDto request
    ) {
        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "Signup successful",
                        authService.signup(request)
                )
        );
    }

    /* ================= LOGIN ================= */
    @PostMapping("/login")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponseDto<LoginResponseDto>> login(
            @RequestBody LoginRequestDto request
    ) {

        LoginResponseDto res = authService.login(request);

        ResponseCookie accessCookie =
                ResponseCookie.from("token", res.getToken())
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(24 * 60 * 60)
                        .sameSite("Lax")
                        .build();


        res.setToken(null);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body(new ApiResponseDto<>(true, "Login successful", res));
    }



    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<Void>> logout(
            HttpServletRequest request
    ) {

        String refreshToken = null;

        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("refresh_token".equals(c.getName())) {
                    refreshToken = c.getValue();
                }
            }
        }


        ResponseCookie deleteAccess =
                ResponseCookie.from("token", "")
                        .path("/")
                        .maxAge(0)
                        .httpOnly(true)
                        .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, deleteAccess.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body(new ApiResponseDto<>(true, "Logout successful", null));
    }


    /* ================= PROFILE ================= */
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<ProfileResponseDto>> profile(
            Authentication authentication
    ) {

        // ✅ JWT SUBJECT = EMAIL
        String email = authentication.getName();

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "Profile loaded",
                        authService.getProfile(email)
                )
        );
    }

    /* ================= UPGRADE TO SELLER ================= */
    @PostMapping("/upgrade-to-seller")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    public ResponseEntity<ApiResponseDto<Void>> upgradeToSeller(
            Authentication authentication
    ) {

        // ✅ EMAIL FROM JWT
        String email = authentication.getName();

        String newToken =
                authService.upgradeToSellerAndGenerateToken(email);

        ResponseCookie cookie =
                ResponseCookie.from("token", newToken)
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(24 * 60 * 60)
                        .sameSite("Lax")
                        .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok()
                .headers(headers)
                .body(
                        new ApiResponseDto<>(
                                true,
                                "Role upgraded to SELLER successfully",
                                null
                        )
                );
    }

    /* ================= CREATE SELLER SHOP ================= */
    @PostMapping("/seller/shop")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<SellerShopResponseDto>> createShop(
            Authentication authentication,
            @RequestPart("data") SellerShopRequestDto dto,
            @RequestPart("image") MultipartFile image
    ) {

        // ✅ EMAIL
        String email = authentication.getName();

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "Shop created",
                        authService.createSellerShop(email, dto, image)
                )
        );
    }

    /* ================= ADD CAKE ================= */
    @PostMapping("/seller/cakes")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<CakeResponseDto>> addCake(
            Authentication authentication,
            @RequestPart("data") CakeRequestDto dto,
            @RequestPart("image") MultipartFile image
    ) {

        // ✅ EMAIL
        String email = authentication.getName();

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "Cake added successfully",
                        authService.addCake(email, dto, image)
                )
        );
    }

    /* ================= GET ALL CAKES ================= */
    @GetMapping("/cakes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<List<AllCakesResponseDto>>> getAllCakes() {

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "All cakes loaded",
                        authService.getAllCakes()
                )
        );
    }

    /* ================= SELLER CAKES ================= */
    @GetMapping("/seller/cakes")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<List<CakeResponseDto>>> getSellerCakes(
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "Seller cakes loaded",
                        authService.getSellerCakes(email)
                )
        );
    }

    /* ================= UPDATE CAKE ================= */
    @PutMapping("/seller/cakes/{cakeId}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<Void>> updateCake(
            Authentication authentication,
            @PathVariable Long cakeId,
            @RequestPart("data") CakeRequestDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        String email = authentication.getName();
        authService.updateCake(email, cakeId, dto, image);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Cake updated", null)
        );
    }

    /* ================= DELETE CAKE ================= */
    @DeleteMapping("/seller/cakes/{cakeId}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<Void>> deleteCake(
            Authentication authentication,
            @PathVariable Long cakeId
    ) {
        String email = authentication.getName();
        authService.deleteCake(email, cakeId);

        return ResponseEntity.ok(
                new ApiResponseDto<>(true, "Cake deleted", null)
        );
    }

    /* ================= GET SELLER SHOP ================= */
    @GetMapping("/seller/shop")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<SellerShopResponseDto>> getSellerShop(
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "Seller shop loaded",
                        authService.getSellerShop(email)
                )
        );
    }

    /* ================= UPDATE SELLER SHOP ================= */
    @PutMapping("/seller/shop")
    @PreAuthorize("hasAuthority('SELLER')")
    public ResponseEntity<ApiResponseDto<SellerShopResponseDto>> updateShop(
            Authentication authentication,
            @RequestPart("data") SellerShopRequestDto dto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "Shop updated successfully",
                        authService.updateSellerShop(email, dto, image)
                )
        );
    }

    /* ================= GET ALL CAKES (PAGINATED) ================= */
    @GetMapping("/cakes/paged")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponseDto<PageResponseDto<AllCakesResponseDto>>> getAllCakesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                new ApiResponseDto<>(
                        true,
                        "Cakes loaded with pagination",
                        authService.getAllCakesPaginated(page, size)
                )
        );
    }


}
