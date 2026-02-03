package CakeApp.com.example.CakeApp.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomApiException extends RuntimeException {

    private final HttpStatus status;

    public CustomApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}
