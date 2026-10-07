package ecommerce_order_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce_order_management.entity.Order;
import ecommerce_order_management.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);
}