
package ecommerce_order_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce_order_management.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}

