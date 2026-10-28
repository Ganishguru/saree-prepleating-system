package com.ganish.myspringbootapp.booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingOrder {
    private String orderNumber;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String customerHeight;
    private String packageName;
    private FabricType fabricType;
    private int sareeCount;
    private String pleatStyle;
    private String sareeDescription;
    private LocalDate eventDate;
    private LocalDate pickupDate;
    private String deliveryMode;
    private String specialInstructions;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;

    public BookingOrder() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.CONFIRMED;
    }

    public BookingOrder(String orderNumber, String customerName, String customerPhone, String customerEmail,
                        String customerHeight, String packageName, FabricType fabricType, int sareeCount,
                        String pleatStyle, String sareeDescription, LocalDate eventDate, LocalDate pickupDate,
                        String deliveryMode, String specialInstructions, BigDecimal totalAmount, OrderStatus status) {
        this.orderNumber = orderNumber;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.customerHeight = customerHeight;
        this.packageName = packageName;
        this.fabricType = fabricType;
        this.sareeCount = sareeCount;
        this.pleatStyle = pleatStyle;
        this.sareeDescription = sareeDescription;
        this.eventDate = eventDate;
        this.pickupDate = pickupDate;
        this.deliveryMode = deliveryMode;
        this.specialInstructions = specialInstructions;
        this.totalAmount = totalAmount;
        this.status = status != null ? status : OrderStatus.CONFIRMED;
        this.createdAt = LocalDateTime.now();
    }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerHeight() { return customerHeight; }
    public void setCustomerHeight(String customerHeight) { this.customerHeight = customerHeight; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public FabricType getFabricType() { return fabricType; }
    public void setFabricType(FabricType fabricType) { this.fabricType = fabricType; }

    public int getSareeCount() { return sareeCount; }
    public void setSareeCount(int sareeCount) { this.sareeCount = sareeCount; }

    public String getPleatStyle() { return pleatStyle; }
    public void setPleatStyle(String pleatStyle) { this.pleatStyle = pleatStyle; }

    public String getSareeDescription() { return sareeDescription; }
    public void setSareeDescription(String sareeDescription) { this.sareeDescription = sareeDescription; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalDate getPickupDate() { return pickupDate; }
    public void setPickupDate(LocalDate pickupDate) { this.pickupDate = pickupDate; }

    public String getDeliveryMode() { return deliveryMode; }
    public void setDeliveryMode(String deliveryMode) { this.deliveryMode = deliveryMode; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
