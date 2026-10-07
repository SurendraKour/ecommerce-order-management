
package ecommerce_order_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ecommerce_order_management.entity.Order;
import ecommerce_order_management.entity.OrderStatus;
import ecommerce_order_management.service.OrderService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order createOrder(
            @RequestParam Long customerId,
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestBody Order order) {

        return orderService.createOrder(
                customerId,
                productId,
                quantity,
                order
        );
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PutMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {

        return orderService.updateOrderStatus(id, status);
    }

    @PutMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable Long id) {

        return orderService.cancelOrder(id);
    }
}