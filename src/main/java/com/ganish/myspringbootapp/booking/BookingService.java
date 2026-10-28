package com.ganish.myspringbootapp.booking;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final Map<String, BookingOrder> orderStore = new ConcurrentHashMap<>();

    @PostConstruct
    public void initDemoData() {
        BookingOrder order1 = new BookingOrder(
                "SPP-1001",
                "Ananya Ramachandran",
                "9840123456",
                "ananya.r@example.com",
                "Height 5'4\", Waist 30\"",
                "Bridal Box Fold & Pleat",
                FabricType.KANJIVARAM_SILK,
                1,
                "CLASSIC",
                "Red & Gold Wedding Kanjivaram",
                LocalDate.now().plusDays(1),
                LocalDate.now(),
                "STUDIO_DROP_PICKUP",
                "Muhurtham is tomorrow at 6:30 AM; needs extra crisp pallu alignment.",
                new BigDecimal("500"),
                OrderStatus.IN_PROGRESS
        );

        BookingOrder order2 = new BookingOrder(
                "SPP-1002",
                "Deepa Venkat",
                "9789012345",
                "deepa.v@example.com",
                "Height 5'6\", Waist 32\"",
                "Classic Pre-Pleating",
                FabricType.ORGANZA,
                2,
                "SLEEK",
                "Powder Blue Floral Organza",
                LocalDate.now().plusDays(4),
                LocalDate.now().plusDays(3),
                "DOORSTEP_COURIER",
                "Delicate fabric - pinless folding requested.",
                new BigDecimal("680"),
                OrderStatus.SAREE_RECEIVED
        );

        orderStore.put(order1.getOrderNumber(), order1);
        orderStore.put(order2.getOrderNumber(), order2);
    }

    public BookingOrder createBooking(BookingRequest request) {
        if (request.getCustomerName() == null || request.getCustomerName().isBlank()) {
            throw new IllegalArgumentException("Customer name cannot be empty");
        }
        if (request.getCustomerPhone() == null || request.getCustomerPhone().isBlank()) {
            throw new IllegalArgumentException("Customer phone number cannot be empty");
        }
        if (request.getEventDate() != null && request.getPickupDate() != null) {
            if (request.getPickupDate().isAfter(request.getEventDate())) {
                throw new IllegalArgumentException("Pickup date cannot be after the Event date");
            }
        }

        String orderNumber = generateUniqueOrderNumber();
        BookingOrder order = new BookingOrder(
                orderNumber,
                request.getCustomerName().trim(),
                request.getCustomerPhone().trim(),
                request.getCustomerEmail() != null ? request.getCustomerEmail().trim() : "",
                request.getCustomerHeight() != null ? request.getCustomerHeight().trim() : "",
                request.getPackageName() != null ? request.getPackageName() : "Classic Pre-Pleating",
                request.getFabricType() != null ? request.getFabricType() : FabricType.KANJIVARAM_SILK,
                request.getSareeCount() > 0 ? request.getSareeCount() : 1,
                request.getPleatStyle() != null ? request.getPleatStyle() : "CLASSIC",
                request.getSareeDescription() != null ? request.getSareeDescription().trim() : "Traditional Saree",
                request.getEventDate() != null ? request.getEventDate() : LocalDate.now().plusDays(2),
                request.getPickupDate() != null ? request.getPickupDate() : LocalDate.now().plusDays(1),
                request.getDeliveryMode() != null ? request.getDeliveryMode() : "STUDIO_DROP_PICKUP",
                request.getSpecialInstructions() != null ? request.getSpecialInstructions().trim() : "",
                request.getTotalAmount() != null ? request.getTotalAmount() : new BigDecimal("250"),
                OrderStatus.CONFIRMED
        );

        orderStore.put(order.getOrderNumber(), order);
        return order;
    }

    public Optional<BookingOrder> getOrderByNumber(String orderNumber) {
        if (orderNumber == null) return Optional.empty();
        return Optional.ofNullable(orderStore.get(orderNumber.toUpperCase().trim()));
    }

    public List<BookingOrder> getAllOrders() {
        return orderStore.values().stream()
                .sorted(Comparator.comparing(BookingOrder::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public Optional<BookingOrder> updateStatus(String orderNumber, OrderStatus newStatus) {
        Optional<BookingOrder> optional = getOrderByNumber(orderNumber);
        if (optional.isPresent()) {
            BookingOrder order = optional.get();
            order.setStatus(newStatus);
            return Optional.of(order);
        }
        return Optional.empty();
    }

    private String generateUniqueOrderNumber() {
        int year = LocalDate.now().getYear();
        String candidate;
        do {
            int randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
            candidate = String.format("SPP-%d-%04d", year, randomNum);
        } while (orderStore.containsKey(candidate));
        return candidate;
    }
}
