package com.ganish.myspringbootapp.booking;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            BookingOrder created = bookingService.createBooking(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping
    public List<BookingOrder> getAllBookings() {
        return bookingService.getAllOrders();
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<BookingOrder> getBooking(@PathVariable String orderNumber) {
        return bookingService.getOrderByNumber(orderNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{orderNumber}/status")
    public ResponseEntity<BookingOrder> updateStatus(
            @PathVariable String orderNumber,
            @RequestBody StatusUpdateRequest request) {
        return bookingService.updateStatus(orderNumber, request.getStatus())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
