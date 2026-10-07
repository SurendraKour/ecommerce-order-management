
import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [orderItems, setOrderItems] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [
        customersResponse,
        productsResponse,
        ordersResponse,
        orderItemsResponse
      ] = await Promise.all([
        axios.get('http://localhost:8080/api/customers'),
        axios.get('http://localhost:8080/api/products'),
        axios.get('http://localhost:8080/api/orders'),
        axios.get('http://localhost:8080/api/order-items')
      ])

      setCustomers(customersResponse.data)
      setProducts(productsResponse.data)
      setOrders(ordersResponse.data)
      setOrderItems(orderItemsResponse.data)

    } catch (error) {
      console.error(
        'Error loading dashboard data:',
        error
      )
    }
  }

  // --------------------------------
  // MAIN SALES
  // --------------------------------

  const totalSales = orders
    .filter(
      (order) => order.orderStatus !== 'CANCELLED'
    )
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    )

  // --------------------------------
  // ORDER STATISTICS
  // --------------------------------

  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === 'CANCELLED'
  ).length

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === 'DELIVERED'
  ).length

  const placedOrders = orders.filter(
    (order) => order.orderStatus === 'PLACED'
  ).length

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stockQuantity) <= 5
  ).length

  // --------------------------------
  // SALES BY ORDER
  // --------------------------------

  const salesData = orders
    .filter(
      (order) => order.orderStatus !== 'CANCELLED'
    )
    .map((order) => ({
      name: `Order #${order.id}`,
      sales: Number(order.totalAmount || 0)
    }))

  // --------------------------------
  // SALES BY PRODUCT
  // --------------------------------

  const productSalesMap = {}

  orderItems
    .filter(
      (item) =>
        item.order?.orderStatus !== 'CANCELLED'
    )
    .forEach((item) => {

      const productName =
        item.product?.name || 'Unknown Product'

      const itemPrice =
        Number(item.price || 0)

      if (!productSalesMap[productName]) {
        productSalesMap[productName] = 0
      }

      productSalesMap[productName] += itemPrice
    })

  const productSalesData = Object.entries(
    productSalesMap
  ).map(([name, sales]) => ({
    name,
    sales
  }))
  const orderStatusData = [
  {
    name: 'Placed',
    value: placedOrders
  },
  {
    name: 'Delivered',
    value: deliveredOrders
  },
  {
    name: 'Cancelled',
    value: cancelledOrders
  }
]
const averageOrderValue =
  orders.filter((order) => order.orderStatus !== 'CANCELLED').length > 0
    ? totalSales /
      orders.filter((order) => order.orderStatus !== 'CANCELLED').length
    : 0

const topSellingProduct =
  productSalesData.length > 0
    ? [...productSalesData].sort((a, b) => b.sales - a.sales)[0]
    : null
  return (
    <main className="dashboard">

      <h1>Sales Dashboard</h1>

      <p>
        Overview of your e-commerce business
      </p>

      {/* MAIN STATISTICS */}

      <div className="stats-grid">

  <div className="stat-card">
    <div className="stat-icon">👥</div>
    <h3>Total Customers</h3>
    <p>{customers.length}</p>
  </div>

  <div className="stat-card">
    <div className="stat-icon">📦</div>
    <h3>Total Products</h3>
    <p>{products.length}</p>
  </div>

  <div className="stat-card">
    <div className="stat-icon">🛒</div>
    <h3>Total Orders</h3>
    <p>{orders.length}</p>
  </div>

  <div className="stat-card">
    <div className="stat-icon">💰</div>
    <h3>Total Sales</h3>
    <p>
      ₹{totalSales.toLocaleString('en-IN')}
    </p>
  </div>

</div>
<h2>Sales Summary</h2>

<div className="stats-grid">

  <div className="stat-card">
    <div className="stat-icon">💰</div>
    <h3>Total Sales</h3>
    <p>
      ₹{totalSales.toLocaleString('en-IN')}
    </p>
  </div>

  <div className="stat-card">
    <div className="stat-icon">📊</div>
    <h3>Average Order Value</h3>
    <p>
      ₹{averageOrderValue.toLocaleString('en-IN', {
        maximumFractionDigits: 0
      })}
    </p>
  </div>

  <div className="stat-card">
    <div className="stat-icon">🏆</div>
    <h3>Top-Selling Product</h3>
    <p>
      {topSellingProduct
        ? topSellingProduct.name
        : 'N/A'}
    </p>
  </div>

</div>
      {/* ORDER STATISTICS */}

      <h2>Order Statistics</h2>

      <div className="stats-grid">

  <div className="stat-card">
    <div className="stat-icon">🕐</div>
    <h3>Placed Orders</h3>
    <p>{placedOrders}</p>
  </div>

  <div className="stat-card">
    <div className="stat-icon">✅</div>
    <h3>Delivered Orders</h3>
    <p>{deliveredOrders}</p>
  </div>

  <div className="stat-card">
    <div className="stat-icon">❌</div>
    <h3>Cancelled Orders</h3>
    <p>{cancelledOrders}</p>
  </div>

  <div className="stat-card">
    <div className="stat-icon">⚠️</div>
    <h3>Low Stock Products</h3>
    <p>{lowStockProducts}</p>
  </div>

</div>
      {/* SALES BY ORDER */}

      <section className="chart-card">

        <h2>Sales by Order</h2>

        {salesData.length === 0 ? (

          <p>No sales data available.</p>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart data={salesData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString('en-IN')}`
                }
              />

              <Bar dataKey="sales" />

            </BarChart>

          </ResponsiveContainer>

        )}

      </section>

      {/* SALES BY PRODUCT */}

      <section className="chart-card">

        <h2>Sales by Product</h2>

        {productSalesData.length === 0 ? (

          <p>No product sales data available.</p>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart data={productSalesData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString('en-IN')}`
                }
              />

              <Bar dataKey="sales" />

            </BarChart>

          </ResponsiveContainer>

        )}

      </section>
      <section className="chart-card">

  <h2>Order Status Distribution</h2>

  <ResponsiveContainer
    width="100%"
    height={350}
  >
    <PieChart>

      <Pie
        data={orderStatusData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        label
      >
        {orderStatusData.map((entry, index) => (
          <Cell key={`cell-${index}`} />
        ))}
      </Pie>

      <Tooltip />

    </PieChart>

  </ResponsiveContainer>

</section>

    </main>
  )
}

export default Dashboard

