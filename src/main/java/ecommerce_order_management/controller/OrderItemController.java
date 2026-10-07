package ecommerce_order_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ecommerce_order_management.entity.OrderItem;
import ecommerce_order_management.service.OrderItemService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    // CREATE
    @PostMapping
    public OrderItem createOrderItem(
            @RequestParam Long orderId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        return orderItemService.createOrderItem(
                orderId,
                productId,
                quantity
        );
    }

    // GET ALL
    @GetMapping
    public List<OrderItem> getAllOrderItems() {

        return orderItemService.getAllOrderItems();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public OrderItem getOrderItemById(
            @PathVariable Long id) {

        return orderItemService.getOrderItemById(id);
    }


@GetMapping("/order/{orderId}")
public List<OrderItem> getOrderItemsByOrderId(
        @PathVariable Long orderId) {

    return orderItemService.getOrderItemsByOrderId(orderId);
}

    // UPDATE
    @PutMapping("/{id}")
    public OrderItem updateOrderItem(
            @PathVariable Long id,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        return orderItemService.updateOrderItem(
                id,
                productId,
                quantity
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(
            @PathVariable Long id) {

        orderItemService.deleteOrderItem(id);

        return ResponseEntity.noContent().build();
    }
}