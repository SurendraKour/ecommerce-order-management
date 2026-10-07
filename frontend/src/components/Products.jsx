
import { useEffect, useState } from 'react'
import axios from 'axios'

function Products() {
  const [products, setProducts] = useState([])

  const [editingProduct, setEditingProduct] = useState(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

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

    const productData = {
      name: name,
      description: description,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
    }

    if (editingProduct) {
      axios
        .put(
          `http://localhost:8080/api/products/${editingProduct.id}`,
          productData
        )
        .then((response) => {
          console.log('Product updated:', response.data)

          fetchProducts()

          setEditingProduct(null)
          clearForm()
        })
        .catch((error) => {
          console.error('Error updating product:', error)
        })
    } else {
      axios
        .post('http://localhost:8080/api/products', productData)
        .then((response) => {
          console.log('Product added:', response.data)

          fetchProducts()

          clearForm()
        })
        .catch((error) => {
          console.error('Error adding product:', error)
        })
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)

    setName(product.name)
    setDescription(product.description)
    setPrice(product.price)
    setStockQuantity(product.stockQuantity)
  }

  const handleDelete = (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    axios
      .delete(`http://localhost:8080/api/products/${productId}`)
      .then(() => {
        console.log('Product deleted')

        fetchProducts()

        if (editingProduct && editingProduct.id === productId) {
          setEditingProduct(null)
          clearForm()
        }
      })
      .catch((error) => {
        console.error('Error deleting product:', error)
      })
  }

  const clearForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setStockQuantity('')
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    clearForm()
  }

  return (
    <main className="dashboard">
      <h2>Products</h2>

      <p>Manage your products</p>

      <form onSubmit={handleSubmit} className="customer-form">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Stock Quantity"
          value={stockQuantity}
          onChange={(event) => setStockQuantity(event.target.value)}
          required
        />

        <button type="submit">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>

        {editingProduct && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>

              <td>{product.name}</td>

              <td>{product.description}</td>

              <td>
                ₹{product.price.toLocaleString('en-IN')}
              </td>

              <td>{product.stockQuantity}</td>

              <td>
                <button onClick={() => handleEdit(product)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default Products
