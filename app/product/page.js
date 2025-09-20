"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function Home() {
  const API_BASE = '/app/stock/api';
  console.debug("API_BASE", API_BASE);
  
  const columns = [
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'price', headerName: 'Price', width: 100 },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 120,
      renderCell: (params) => {
        return params.row.category?.name || 'N/A';
      }
    },
    {
      field: 'Action', 
      headerName: 'Action', 
      width: 150,
      renderCell: (params) => {
        return (
          <div className="flex gap-2">
            <Link 
              href={`/product/${params.row._id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              View
            </Link>
            <button 
              onClick={() => deleteById(params.row._id)()}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )
      }
    },
  ];

  const { register, handleSubmit } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  async function fetchProducts() {
    const data = await fetch(`${API_BASE}/product`);
    const p = await data.json();
    const productsWithId = p.map((product) => {
      return {
        ...product,
        id: product._id
      }
    });
    setProducts(productsWithId);
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  const createProduct = (data) => {
    fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchProducts());
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;
    
    await fetch(`${API_BASE}/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  }

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Product Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit(createProduct)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  name="code"
                  type="text"
                  {...register("code", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product Code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  {...register("description", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Product Description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  {...register("price", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  {...register("category", { required: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {category.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>

        {/* Products DataGrid */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={products}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      </div>
    </div>
  );
}
