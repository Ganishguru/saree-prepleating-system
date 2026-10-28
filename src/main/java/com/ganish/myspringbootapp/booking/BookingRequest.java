package com.ganish.myspringbootapp.booking;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingRequest {
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String customerHeight;
    private String packageName;
    private FabricType fabricType;
    private int sareeCount = 1;
    private String pleatStyle;
    private String sareeDescription;
    private LocalDate eventDate;
    private LocalDate pickupDate;
    private String deliveryMode;
    private String specialInstructions;
    private BigDecimal totalAmount;

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
}
