package ecommerce_order_management.controller;

import ecommerce_order_management.entity.Customer;
import ecommerce_order_management.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Create customer
    @PostMapping
    public ResponseEntity<Customer> createCustomer(
            @RequestBody Customer customer) {

        Customer savedCustomer = customerService.createCustomer(customer);

        return ResponseEntity.ok(savedCustomer);
    }

    // Get all customers
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {

        List<Customer> customers = customerService.getAllCustomers();

        return ResponseEntity.ok(customers);
    }

    // Get customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(
            @PathVariable Long id) {

        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update customer
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer customer) {

        Customer updatedCustomer =
                customerService.updateCustomer(id, customer);

        return ResponseEntity.ok(updatedCustomer);
    }

    // Delete customer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable Long id) {

        customerService.deleteCustomer(id);

        return ResponseEntity.noContent().build();
    }
}