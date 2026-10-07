
import { useEffect, useState } from 'react'
import axios from 'axios'

function CreateOrder() {
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])

  const [customerId, setCustomerId] = useState('')
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [orderStatus, setOrderStatus] = useState('PLACED')

  useEffect(() => {
    fetchCustomers()
    fetchProducts()
  }, [])

  const fetchCustomers = () => {
    axios
      .get('http://localhost:8080/api/customers')
      .then((response) => {
        setCustomers(response.data)
      })
      .catch((error) => {
        console.error('Error fetching customers:', error)
      })
  }

  const fetchProducts = () => {
    axios
      .get('http://localhost:8080/api/products')
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!customerId) {
      alert('Please select a customer')
      return
    }

    if (!productId) {
      alert('Please select a product')
      return
    }

    if (!quantity || Number(quantity) <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    const selectedProduct = products.find(
      (product) => product.id === Number(productId)
    )

    if (!selectedProduct) {
      alert('Product not found')
      return
    }

    if (Number(quantity) > selectedProduct.stockQuantity) {
      alert(
        `Insufficient stock. Available stock: ${selectedProduct.stockQuantity}`
      )
      return
    }

    const order = {
      orderStatus: orderStatus,
    }

    axios
      .post(
        `http://localhost:8080/api/orders?customerId=${customerId}&productId=${productId}&quantity=${quantity}`,
        order
      )
      .then((response) => {
        console.log('Order created:', response.data)

        alert('Order created successfully')

        setCustomerId('')
        setProductId('')
        setQuantity('')
        setOrderStatus('PLACED')

        fetchProducts()
      })
      .catch((error) => {
        console.error('Error creating order:', error)

        if (error.response && error.response.data) {
          alert(error.response.data.message || 'Error creating order')
        } else {
          alert('Error creating order')
        }
      })
  }

  return (
    <main className="dashboard">
      <h2>Create Order</h2>
      <p>Create a new order for a customer</p>

      <form onSubmit={handleSubmit} className="customer-form">

        <select
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          required
        >
          <option value="">Select Customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.email}
            </option>
          ))}
        </select>

        <select
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          required
        >
          <option value="">Select Product</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ₹{product.price} - Stock: {product.stockQuantity}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          min="1"
          onChange={(event) => setQuantity(event.target.value)}
          required
        />

        <select
          value={orderStatus}
          onChange={(event) => setOrderStatus(event.target.value)}
        >
          <option value="PLACED">PLACED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="DELIVERED">DELIVERED</option>
        </select>

        <button type="submit">
          Create Order
        </button>

      </form>
    </main>
  )
}

export default CreateOrder
