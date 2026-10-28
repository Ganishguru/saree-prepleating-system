package com.ganish.myspringbootapp.booking;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class BookingServiceTest {

    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        bookingService = new BookingService();
        bookingService.initDemoData();
    }

    @Test
    void testDemoDataInitialized() {
        List<BookingOrder> allOrders = bookingService.getAllOrders();
        assertEquals(2, allOrders.size());
        assertTrue(bookingService.getOrderByNumber("SPP-1001").isPresent());
        assertTrue(bookingService.getOrderByNumber("SPP-1002").isPresent());
    }

    @Test
    void testCreateBookingSuccess() {
        BookingRequest request = new BookingRequest();
        request.setCustomerName("Meenakshi Sundaram");
        request.setCustomerPhone("9123456789");
        request.setCustomerEmail("meena@example.com");
        request.setPackageName("Bridal Box Fold & Pleat");
        request.setFabricType(FabricType.KANJIVARAM_SILK);
        request.setSareeCount(1);
        request.setEventDate(LocalDate.now().plusDays(5));
        request.setPickupDate(LocalDate.now().plusDays(4));
        request.setTotalAmount(new BigDecimal("500"));

        BookingOrder created = bookingService.createBooking(request);

        assertNotNull(created);
        assertNotNull(created.getOrderNumber());
        assertTrue(created.getOrderNumber().startsWith("SPP-"));
        assertEquals("Meenakshi Sundaram", created.getCustomerName());
        assertEquals(OrderStatus.CONFIRMED, created.getStatus());

        Optional<BookingOrder> retrieved = bookingService.getOrderByNumber(created.getOrderNumber());
        assertTrue(retrieved.isPresent());
        assertEquals("Meenakshi Sundaram", retrieved.get().getCustomerName());
    }

    @Test
    void testCreateBookingInvalidDatesThrowsException() {
        BookingRequest request = new BookingRequest();
        request.setCustomerName("Priya");
        request.setCustomerPhone("9123456789");
        // Pickup date AFTER event date is invalid
        request.setEventDate(LocalDate.now().plusDays(2));
        request.setPickupDate(LocalDate.now().plusDays(4));

        assertThrows(IllegalArgumentException.class, () -> bookingService.createBooking(request));
    }

    @Test
    void testUpdateStatusSuccess() {
        Optional<BookingOrder> updated = bookingService.updateStatus("SPP-1001", OrderStatus.COMPLETED);
        assertTrue(updated.isPresent());
        assertEquals(OrderStatus.COMPLETED, updated.get().getStatus());
    }
}
