package com.ganish.myspringbootapp.booking;

public class StatusUpdateRequest {
    private OrderStatus status;

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
