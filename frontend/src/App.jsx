
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Customers from './components/Customers'
import Products from './components/Products'
import Orders from './components/Orders'
import CreateOrder from './components/CreateOrder'
import OrderDetails from './components/OrderDetails'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/create-order" element={<CreateOrder />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
