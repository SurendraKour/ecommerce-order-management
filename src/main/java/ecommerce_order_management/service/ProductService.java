
package ecommerce_order_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ecommerce_order_management.entity.Product;
import ecommerce_order_management.exception.ResourceNotFoundException;
import ecommerce_order_management.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    public Product updateProduct(Long id, Product updatedProduct) {

    Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

    existingProduct.setName(updatedProduct.getName());
    existingProduct.setDescription(updatedProduct.getDescription());
    existingProduct.setPrice(updatedProduct.getPrice());
    existingProduct.setStockQuantity(updatedProduct.getStockQuantity());

    return productRepository.save(existingProduct);
}

public void deleteProduct(Long id) {

    if (!productRepository.existsById(id)) {
        throw new RuntimeException("Product not found");
    }

    productRepository.deleteById(id);
}
}

