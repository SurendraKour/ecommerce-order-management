
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
    fetchOrderItems()
  }, [id])

  const fetchOrder = () => {
    axios
      .get(`http://localhost:8080/api/orders/${id}`)
      .then((response) => {
        setOrder(response.data)
      })
      .catch((error) => {
        console.error('Error fetching order:', error)
      })
  }

  const fetchOrderItems = () => {
    axios
      .get(`http://localhost:8080/api/order-items/order/${id}`)
      .then((response) => {
        console.log('Order items:', response.data)
        setOrderItems(response.data)
      })
      .catch((error) => {
        console.error('Error fetching order items:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <main className="dashboard">
        <p>Loading order details...</p>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="dashboard">
        <p>Order not found.</p>

        <button onClick={() => navigate('/orders')}>
          ← Back to Orders
        </button>
      </main>
    )
  }

  return (
    <main className="dashboard">

      <button onClick={() => navigate('/orders')}>
        ← Back to Orders
      </button>

      <h2>Order Details</h2>

      {/* Order Information */}
      <section className="details-card">

        <h3>Order #{order.id}</h3>

        <p>
          <strong>Status:</strong>{' '}
          {order.orderStatus}
        </p>

        <p>
          <strong>Total Amount:</strong>{' '}
          ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
        </p>

      </section>

      {/* Customer Information */}
      <section className="details-card">

        <h3>Customer Information</h3>

        <p>
          <strong>Name:</strong>{' '}
          {order.customer?.name || 'N/A'}
        </p>

        <p>
          <strong>Email:</strong>{' '}
          {order.customer?.email || 'N/A'}
        </p>

        <p>
          <strong>Phone:</strong>{' '}
          {order.customer?.phone || 'N/A'}
        </p>

        <p>
          <strong>City:</strong>{' '}
          {order.customer?.city || 'N/A'}
        </p>

      </section>

      {/* Order Items */}
      <section className="details-card">

        <h3>Order Items</h3>

        {orderItems.length === 0 ? (

          <p>No items found for this order.</p>

        ) : (

          <table>

            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              {orderItems.map((item) => (

                <tr key={item.id}>

                  <td>
                    {item.product?.name || 'N/A'}
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    ₹
                    {Number(
                      item.product?.price || 0
                    ).toLocaleString('en-IN')}
                  </td>

                  <td>
                    ₹
                    {Number(
                      item.price || 0
                    ).toLocaleString('en-IN')}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </section>

      {/* Order Total */}
      <section className="details-card">

        <h3>
          Order Total: ₹
          {Number(
            order.totalAmount || 0
          ).toLocaleString('en-IN')}
        </h3>

      </section>

    </main>
  )
}

export default OrderDetails
