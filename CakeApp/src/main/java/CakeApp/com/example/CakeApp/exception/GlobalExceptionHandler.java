package CakeApp.com.example.CakeApp.exception;

import CakeApp.com.example.CakeApp.dto.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // ================= Custom API Exception =================
    @ExceptionHandler(CustomApiException.class)
    public ResponseEntity<ApiResponseDto<Object>> handleCustomApiException(
            CustomApiException ex
    ) {

        ApiResponseDto<Object> response =
                new ApiResponseDto<>(false, ex.getMessage(), null);

        return new ResponseEntity<>(response, ex.getStatus());
    }

    // ================= Runtime Exception =================
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponseDto<Object>> handleRuntimeException(
            RuntimeException ex
    ) {

        ApiResponseDto<Object> response =
                new ApiResponseDto<>(false, ex.getMessage(), null);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // ================= Generic Exception =================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto<Object>> handleException(
            Exception ex
    ) {

        ApiResponseDto<Object> response =
                new ApiResponseDto<>(false, "Something went wrong", null);

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
