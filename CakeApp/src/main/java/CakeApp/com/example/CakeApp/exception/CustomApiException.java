package CakeApp.com.example.CakeApp.exception;
import org.springframework.http.HttpStatus;

public class CustomApiException extends RuntimeException {
    private final HttpStatus status;
    private final String message;

    public CustomApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    @Override
    public String getMessage() {
        return message;
    }
}

