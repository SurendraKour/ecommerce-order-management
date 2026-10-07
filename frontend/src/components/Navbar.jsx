
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header>
      <h1>E-Commerce Management System</h1>

      <nav>
        <Link to="/">
          <button>Dashboard</button>
        </Link>

        <Link to="/customers">
          <button>Customers</button>
        </Link>

        <Link to="/products">
          <button>Products</button>
        </Link>

        <Link to="/orders">
          <button>Orders</button>
        </Link>

        <Link to="/create-order">
  <button>Create Order</button>
</Link>
      </nav>
    </header>
  )
}

export default Navbar

