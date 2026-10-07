package ecommerce_order_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ecommerce_order_management.entity.Order;
import ecommerce_order_management.entity.OrderItem;
import ecommerce_order_management.entity.OrderStatus;
import ecommerce_order_management.entity.Product;
import ecommerce_order_management.exception.ResourceNotFoundException;
import ecommerce_order_management.repository.OrderItemRepository;
import ecommerce_order_management.repository.OrderRepository;
import ecommerce_order_management.repository.ProductRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderItemService(
            OrderItemRepository orderItemRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository) {

        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // CREATE ORDER ITEM
    @Transactional
    public OrderItem createOrderItem(
        Long orderId,
        Long productId,
        Integer quantity) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    if (order.getOrderStatus() == OrderStatus.CANCELLED) {
    throw new RuntimeException(
            "Cannot add items to a cancelled order");
}

if (order.getOrderStatus() == OrderStatus.DELIVERED) {
    throw new RuntimeException(
            "Cannot add items to a delivered order");
}
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

    // Validate quantity
    if (quantity == null || quantity <= 0) {
        throw new RuntimeException("Quantity must be greater than zero");
    }

    // Check stock
    if (product.getStockQuantity() < quantity) {
        throw new RuntimeException("Insufficient stock");
    }

    // Create order item
    OrderItem orderItem = new OrderItem();

    orderItem.setOrder(order);
    orderItem.setProduct(product);
    orderItem.setQuantity(quantity);

    // Calculate item price
    Double itemPrice = product.getPrice() * quantity;
    orderItem.setPrice(itemPrice);

    // Reduce product stock
    product.setStockQuantity(
            product.getStockQuantity() - quantity
    );

    // Save updated product
    productRepository.save(product);

    // Save order item
    OrderItem savedOrderItem = orderItemRepository.save(orderItem);

    // Recalculate order total
    recalculateOrderTotal(order);

    return savedOrderItem;
}
    // GET ALL ORDER ITEMS
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    // GET ORDER ITEM BY ID
    public OrderItem getOrderItemById(Long id) {

        return orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));
    }

    // UPDATE ORDER ITEM
    @Transactional
    public OrderItem updateOrderItem(
        Long id,
        Long productId,
        Integer quantity) {

    OrderItem orderItem = orderItemRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Order item not found"));
Order order = orderItem.getOrder();

    if (order.getOrderStatus() == OrderStatus.CANCELLED) {
        throw new RuntimeException(
                "Cannot update items of a cancelled order");
    }

    if (order.getOrderStatus() == OrderStatus.DELIVERED) {
        throw new RuntimeException(
                "Cannot update items of a delivered order");
    }
    Product oldProduct = orderItem.getProduct();

    Product newProduct = productRepository.findById(productId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Product not found"));

    if (quantity == null || quantity <= 0) {
        throw new RuntimeException(
                "Quantity must be greater than zero");
    }

    Integer oldQuantity = orderItem.getQuantity();

    // Case 1: Same product
    if (oldProduct.getId().equals(newProduct.getId())) {

        int difference = quantity - oldQuantity;

        if (difference > 0) {

            if (newProduct.getStockQuantity() < difference) {
                throw new RuntimeException("Insufficient stock");
            }

            newProduct.setStockQuantity(
                    newProduct.getStockQuantity() - difference
            );

        } else if (difference < 0) {

            newProduct.setStockQuantity(
                    newProduct.getStockQuantity() - difference
            );
        }

    } else {

        // Return old quantity to old product
        oldProduct.setStockQuantity(
                oldProduct.getStockQuantity() + oldQuantity
        );

        productRepository.save(oldProduct);

        // Check stock for new product
        if (newProduct.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        // Reduce stock from new product
        newProduct.setStockQuantity(
                newProduct.getStockQuantity() - quantity
        );
    }

    productRepository.save(newProduct);

    orderItem.setProduct(newProduct);
    orderItem.setQuantity(quantity);

    Double itemPrice =
            newProduct.getPrice() * quantity;

    orderItem.setPrice(itemPrice);

    OrderItem updatedItem =
            orderItemRepository.save(orderItem);

    recalculateOrderTotal(orderItem.getOrder());

    return updatedItem;
}
    // DELETE ORDER ITEM
    @Transactional
    public void deleteOrderItem(Long id) {

    OrderItem orderItem = orderItemRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Order item not found"));

    Order order = orderItem.getOrder();

    if (order.getOrderStatus() == OrderStatus.CANCELLED) {
    throw new RuntimeException(
            "Cannot delete items from a cancelled order");
}

if (order.getOrderStatus() == OrderStatus.DELIVERED) {
    throw new RuntimeException(
            "Cannot delete items from a delivered order");
}

    Product product = orderItem.getProduct();

    // Restore product stock
    product.setStockQuantity(
            product.getStockQuantity() + orderItem.getQuantity()
    );

    productRepository.save(product);

    // Delete order item
    orderItemRepository.delete(orderItem);

    // Recalculate order total
    recalculateOrderTotal(order);
}


// GET ORDER ITEMS BY ORDER ID
public List<OrderItem> getOrderItemsByOrderId(Long orderId) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Order not found"));

    return orderItemRepository.findByOrder(order);
}


    // RECALCULATE ORDER TOTAL
    private void recalculateOrderTotal(Order order) {

        List<OrderItem> orderItems =
                orderItemRepository.findByOrder(order);

        double total = 0.0;

        for (OrderItem item : orderItems) {

            total += item.getPrice();
        }

        order.setTotalAmount(total);

        orderRepository.save(order);
    }
}