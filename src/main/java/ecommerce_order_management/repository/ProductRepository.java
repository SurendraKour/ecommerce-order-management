
package ecommerce_order_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ecommerce_order_management.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}

