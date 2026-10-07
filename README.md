# E-Commerce Order Management and Sales Analytics

## Project Overview

A full-stack e-commerce application for managing customers, products, orders, inventory, and sales analytics.

The project combines a Java Spring Boot backend, React frontend, MySQL database, and Python-based analytics to provide an end-to-end order management and business reporting solution.

## Technology Stack

- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- React
- JavaScript
- Axios
- Recharts
- Python
- Pandas
- NumPy
- Matplotlib
- OpenPyXL
- Maven

## Main Features

### Order Management

- Create and manage customer orders
- Add products to orders
- Calculate order totals
- Update order status
- Cancel orders
- Automatically restore inventory when orders are cancelled

### Customer Management

- Add customers
- Update customer details
- Delete customers
- View customer information

### Product & Inventory Management

- Add products
- Update product details
- Delete products
- Track product prices
- Track inventory stock

### Sales Dashboard

- Total customers
- Total products
- Total orders
- Total sales
- Placed orders
- Delivered orders
- Cancelled orders
- Low-stock products
- Average order value
- Top-selling product
- Sales by order
- Sales by product
- Order status distribution

### Python Analytics

Python connects directly to the MySQL database and performs sales analysis using:

- Pandas for data processing
- NumPy for statistical calculations
- Matplotlib for data visualization
- OpenPyXL for Excel report generation

The analytics module generates:

- Sales summary
- Product performance analysis
- Top 5 products
- Order status summary
- CSV report
- Excel report
- Sales charts

## Project Structure

```text
ecommerce-order-management
│
├── src
│   └── main
│       └── java
│
├── python-analytics
│   ├── database.py
│   ├── analytics.py
│   ├── report_generator.py
│   ├── sales_analysis.py
│   │
│   ├── data
│   │   └── orders.csv
│   │
│   └── reports
│       ├── analytics_report.csv
│       ├── analytics_report.xlsx
│       ├── sales_by_product.png
│       └── top_5_products.png
│
├── pom.xml
└── README.md

## How to Run

### 1. Start MySQL

Make sure MySQL is running and the `ecommerce_db` database is available.

### 2. Start the Spring Boot Backend

From the main project folder:

```bash
mvn spring-boot:run

## Future Enhancements

- JWT-based authentication
- Role-based access control
- Payment gateway integration
- Advanced sales forecasting
- Customer segmentation
- Product recommendation system
- Cloud deployment
- Automated scheduled analytics reports