
import { useEffect, useState } from 'react'
import axios from 'axios'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [editingCustomer, setEditingCustomer] = useState(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    fetchCustomers()
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

  const handleEdit = (customer) => {
  setEditingCustomer(customer)
  setName(customer.name)
  setEmail(customer.email)
  setPhone(customer.phone)
  setCity(customer.city || '')
}


const handleDelete = (customerId) => {
  if (!window.confirm('Are you sure you want to delete this customer?')) {
    return
  }

  axios
    .delete(`http://localhost:8080/api/customers/${customerId}`)
    .then(() => {
      console.log('Customer deleted')

      fetchCustomers()
    })
    .catch((error) => {
      console.error('Error deleting customer:', error)
    })
}


const handleSubmit = (event) => {
  event.preventDefault()

  const customerData = {
    name: name,
    email: email,
    phone: phone,
    city: city,
  }

  if (editingCustomer) {
    axios
      .put(
        `http://localhost:8080/api/customers/${editingCustomer.id}`,
        customerData
      )
      .then((response) => {
        console.log('Customer updated:', response.data)

        fetchCustomers()

        setEditingCustomer(null)
        setName('')
        setEmail('')
        setPhone('')
        setCity('')
      })
      .catch((error) => {
        console.error('Error updating customer:', error)
      })
  } else {
    axios
      .post('http://localhost:8080/api/customers', customerData)
      .then((response) => {
        console.log('Customer added:', response.data)

        fetchCustomers()

        setName('')
        setEmail('')
        setPhone('')
        setCity('')
      })
      .catch((error) => {
        console.error('Error adding customer:', error)
      })
  }
}





  return (
    <main className="dashboard">
      <h2>Customers</h2>
      <p>Manage your customers</p>

      <form onSubmit={handleSubmit} className="customer-form">
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />

        <button type="submit">
  {editingCustomer ? 'Update Customer' : 'Add Customer'}
</button>
      </form>

      <table>
        <thead>
          <tr>
  <th>ID</th>
  <th>Name</th>
  <th>Email</th>
  <th>Phone</th>
  <th>City</th>
  <th>Actions</th>
</tr>


        </thead>

        <tbody>
          {customers.map((customer) => (
         
<tr key={customer.id}>
  <td>{customer.id}</td>
  <td>{customer.name}</td>
  <td>{customer.email}</td>
  <td>{customer.phone}</td>
  <td>{customer.city || 'N/A'}</td>

  <td>
    <td>
  <button onClick={() => handleEdit(customer)}>Edit</button>

  <button onClick={() => handleDelete(customer.id)}>
    Delete
  </button>
</td>
  </td>
</tr>


          ))}
        </tbody>
      </table>
    </main>
  )
}

export default Customers

