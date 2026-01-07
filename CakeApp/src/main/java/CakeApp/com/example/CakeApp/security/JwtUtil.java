package CakeApp.com.example.CakeApp.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    /* ================= GENERATE TOKEN ================= */
    // 🔥 SUBJECT = EMAIL
    public String generateToken(String email, String role) {

        return Jwts.builder()
                .setSubject(email)                 // ✅ EMAIL
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + expiration)
                )
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    /* ================= EXTRACT EMAIL ================= */
    public String extractEmail(String token) {
        return getClaims(token).getSubject();      // ✅ EMAIL
    }

    /* ================= EXTRACT ROLE ================= */
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    /* ================= VALIDATE ================= */
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /* ================= CLAIMS ================= */
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }
}
