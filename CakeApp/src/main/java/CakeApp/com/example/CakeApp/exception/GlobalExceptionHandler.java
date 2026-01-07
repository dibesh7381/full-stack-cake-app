package CakeApp.com.example.CakeApp.exception;

import CakeApp.com.example.CakeApp.dto.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomApiException.class)
    public ResponseEntity<ApiResponseDto<?>> handleCustomApiException(CustomApiException ex) {
        ApiResponseDto<?> response = new ApiResponseDto<>(false, ex.getMessage(), null);
        return ResponseEntity.status(ex.getStatus()).body(response);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponseDto<?>> handleNotFound(NoHandlerFoundException ex) {
        ApiResponseDto<?> response = new ApiResponseDto<>(false, "URL not found: " + ex.getRequestURL(), null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto<?>> handleException(Exception ex) {
        ApiResponseDto<?> response = new ApiResponseDto<>(false, "Something went wrong: " + ex.getMessage(), null);
        return ResponseEntity.internalServerError().body(response);
    }
}

