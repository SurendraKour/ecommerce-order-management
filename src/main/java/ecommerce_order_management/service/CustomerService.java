package ecommerce_order_management.service;

import ecommerce_order_management.entity.Customer;
import ecommerce_order_management.exception.ResourceNotFoundException;
import ecommerce_order_management.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // Create customer
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    // Update customer
    public Customer updateCustomer(Long id, Customer customerDetails) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        customer.setName(customerDetails.getName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());
        customer.setCity(customerDetails.getCity());

        return customerRepository.save(customer);
    }

    // Delete customer
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}