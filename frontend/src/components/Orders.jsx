import { useEffect, useState } from 'react'
import axios from 'axios'

function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = () => {
    axios
      .get('http://localhost:8080/api/orders')
      .then((response) => {
        setOrders(response.data)
      })
      .catch((error) => {
        console.error('Error fetching orders:', error)
      })
  }

  const updateStatus = (orderId, status) => {
    axios
      .put(
        `http://localhost:8080/api/orders/${orderId}/status?status=${status}`
      )
      .then((response) => {
        console.log('Order status updated:', response.data)
        fetchOrders()
        alert(`Order status updated to ${status}`)
      })
      .catch((error) => {
        console.error('Error updating order status:', error)

        if (error.response && error.response.data) {
          alert(
            error.response.data.message ||
              'Unable to update order status'
          )
        } else {
          alert('Unable to update order status')
        }
      })
  }

  const cancelOrder = (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    axios
      .put(`http://localhost:8080/api/orders/${orderId}/cancel`)
      .then((response) => {
        console.log('Order cancelled:', response.data)
        fetchOrders()
        alert('Order cancelled successfully')
      })
      .catch((error) => {
        console.error('Error cancelling order:', error)

        if (error.response && error.response.data) {
          alert(
            error.response.data.message ||
              'Unable to cancel order'
          )
        } else {
          alert('Unable to cancel order')
        }
      })
  }

  return (
    <main className="dashboard">
      <h2>Orders</h2>
      <p>Manage customer orders</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>

              <td>
                {order.customer
                  ? order.customer.name
                  : 'N/A'}
              </td>

              <td>
                ₹
                {order.totalAmount
                  ? order.totalAmount.toLocaleString('en-IN')
                  : '0'}
              </td>

              <td>
                <span
                  className={`status ${order.orderStatus.toLowerCase()}`}
                >
                  {order.orderStatus}
                </span>
              </td>

              <td>
                <button onClick={() => { window.location.href = `/orders/${order.id}` }} > View Details </button>
                {order.orderStatus === 'PLACED' && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(order.id, 'DELIVERED')
                      }
                    >
                      Mark Delivered
                    </button>

                    <button
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {order.orderStatus === 'DELIVERED' && (
                  <span>Completed</span>
                )}

                {order.orderStatus === 'CANCELLED' && (
                  <span>Cancelled</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default Orders