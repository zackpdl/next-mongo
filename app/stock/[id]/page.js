"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function StockDetailPage({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset } = useForm();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjustmentForm, setAdjustmentForm] = useState(false);

  async function fetchStock() {
    try {
      const data = await fetch(`${API_BASE}/stock/${params.id}`);
      if (data.ok) {
        const s = await data.json();
        setStock(s);
      } else {
        console.error("Failed to fetch stock");
      }
    } catch (error) {
      console.error("Error fetching stock:", error);
    } finally {
      setLoading(false);
    }
  }

  const updateStock = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/stock/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await fetchStock();
        setAdjustmentForm(false);
        reset();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update stock");
      }
    } catch (error) {
      alert("Error updating stock");
    }
  };

  const adjustStock = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/stock/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stockId: params.id,
          adjustment: parseInt(data.adjustment),
          type: data.type,
          reason: data.reason
        }),
      });
      
      if (response.ok) {
        await fetchStock();
        setAdjustmentForm(false);
        reset();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to adjust stock");
      }
    } catch (error) {
      alert("Error adjusting stock");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'text-green-600 bg-green-100';
      case 'low-stock': return 'text-yellow-600 bg-yellow-100';
      case 'out-of-stock': return 'text-red-600 bg-red-100';
      case 'discontinued': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    fetchStock();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">Stock not found</div>
        <Link href="/stock" className="text-blue-600 hover:underline">
          ← Back to Stock List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/stock" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Stock List
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Stock Details - {stock.product?.name || 'Unknown Product'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Information */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Stock Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <p className="text-lg">{stock.product?.name || 'Unknown Product'}</p>
              <p className="text-sm text-gray-500">Code: {stock.product?.code || 'N/A'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Quantity</label>
                <p className="text-2xl font-bold text-blue-600">{stock.quantity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(stock.status)}`}>
                  {stock.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Quantity</label>
                <p className="text-lg">{stock.minQuantity}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Quantity</label>
                <p className="text-lg">{stock.maxQuantity}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <p className="text-lg">{stock.location}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <p className="text-lg">{new Date(stock.lastUpdated).toLocaleString()}</p>
            </div>

            {stock.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <p className="text-lg whitespace-pre-line">{stock.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          {/* Quick Adjustments */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => setAdjustmentForm(!adjustmentForm)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {adjustmentForm ? 'Cancel Adjustment' : 'Adjust Stock'}
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this stock record?')) {
                    fetch(`${API_BASE}/stock/${params.id}`, { method: 'DELETE' })
                      .then(() => window.location.href = '/stock');
                  }
                }}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete Stock Record
              </button>
            </div>
          </div>

          {/* Stock Adjustment Form */}
          {adjustmentForm && (
            <div className="bg-blue-50 shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Adjust Stock</h3>
              <form onSubmit={handleSubmit(adjustStock)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Type</label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="add">Add to Stock</option>
                    <option value="subtract">Subtract from Stock</option>
                    <option value="set">Set Exact Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    {...register("adjustment", { required: true, min: 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <input
                    type="text"
                    {...register("reason")}
                    placeholder="Reason for adjustment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Apply Adjustment
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentForm(false)}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Stock Update Form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Update Stock Settings</h3>
            <form onSubmit={handleSubmit(updateStock)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Quantity</label>
                <input
                  type="number"
                  {...register("minQuantity", { required: true, min: 0 })}
                  defaultValue={stock.minQuantity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Quantity</label>
                <input
                  type="number"
                  {...register("maxQuantity", { required: true, min: 0 })}
                  defaultValue={stock.maxQuantity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  {...register("location", { required: true })}
                  defaultValue={stock.location}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  {...register("status")}
                  defaultValue={stock.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  {...register("notes")}
                  defaultValue={stock.notes}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Update Stock Settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
