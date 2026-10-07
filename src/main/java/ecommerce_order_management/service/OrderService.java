
package ecommerce_order_management.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ecommerce_order_management.entity.Customer;
import ecommerce_order_management.entity.Order;
import ecommerce_order_management.entity.OrderItem;
import ecommerce_order_management.entity.OrderStatus;
import ecommerce_order_management.entity.Product;
import ecommerce_order_management.exception.ResourceNotFoundException;
import ecommerce_order_management.repository.CustomerRepository;
import ecommerce_order_management.repository.OrderRepository;
import ecommerce_order_management.repository.OrderItemRepository;
import ecommerce_order_management.repository.ProductRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            CustomerRepository customerRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public Order createOrder(
            Long customerId,
            Long productId,
            Integer quantity,
            Order order) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than zero");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException(
                    "Insufficient stock. Available stock: "
                            + product.getStockQuantity());
        }

        order.setCustomer(customer);

        if (order.getOrderStatus() == null) {
            order.setOrderStatus(OrderStatus.PLACED);
        }

        double totalAmount =
                product.getPrice() * quantity;

        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        OrderItem orderItem = new OrderItem();

        orderItem.setOrder(savedOrder);
        orderItem.setProduct(product);
        orderItem.setQuantity(quantity);

        // Store the product price at the time of purchase
        orderItem.setPrice(product.getPrice());

        orderItemRepository.save(orderItem);

        // Reduce product stock
        product.setStockQuantity(
                product.getStockQuantity() - quantity
        );

        productRepository.save(product);

        return savedOrder;
    }

    public Order updateOrderStatus(
            Long orderId,
            OrderStatus newStatus) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"));

        OrderStatus currentStatus =
                order.getOrderStatus();

        if (currentStatus == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cancelled order cannot be updated");
        }

        if (currentStatus == OrderStatus.DELIVERED) {
            throw new RuntimeException(
                    "Delivered order cannot be updated");
        }

        order.setOrderStatus(newStatus);

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"));

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Order is already cancelled");
        }

        if (order.getOrderStatus() == OrderStatus.DELIVERED) {
            throw new RuntimeException(
                    "Delivered order cannot be cancelled");
        }

        List<OrderItem> orderItems =
                orderItemRepository.findByOrder(order);

        for (OrderItem item : orderItems) {

            Product product = item.getProduct();

            product.setStockQuantity(
                    product.getStockQuantity()
                            + item.getQuantity()
            );

            productRepository.save(product);
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"));
    }
}
