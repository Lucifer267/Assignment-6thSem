/// <reference types="vite/client" />
import React, { useEffect, useMemo, useState } from 'react';
import { Package, Plus, Trash2, Edit2, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    quantity: 0,
    category: ''
  });

  const [editingProduct, setEditingProduct] = useState({
    name: '',
    price: 0,
    quantity: 0,
    category: ''
  });

  const getAuthHeader = () => {
    return 'Basic ' + btoa(`${username}:${password}`);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: { 'Authorization': getAuthHeader() }
      });
      if (!response.ok) throw new Error('Failed to fetch products. Check credentials or MongoDB connection.');
      const data = await response.json();
      setProducts(data);
      setIsLoggedIn(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      if (!response.ok) throw new Error('Failed to create product');
      await fetchProducts();
      setNewProduct({ name: '', price: 0, quantity: 0, category: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditingProduct({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditingProduct({ name: '', price: 0, quantity: 0, category: '' });
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingProduct)
      });
      if (!response.ok) throw new Error('Failed to update product');
      await fetchProducts();
      cancelEdit();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': getAuthHeader() }
      });
      if (response.status === 403) throw new Error('Only ADMIN can delete products');
      if (!response.ok) throw new Error('Failed to delete product');
      await fetchProducts();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
    }
  };

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + product.quantity, 0),
    [products]
  );

  const totalValue = useMemo(
    () => products.reduce((sum, product) => sum + product.price * product.quantity, 0),
    [products]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefaf3] via-[#f6f8f7] to-[#f1f4f9] text-[#1f2937]">
      <header className="border-b border-[#d7deea] bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#0f766e] rounded-xl flex items-center justify-center text-white shadow-sm">
              <Package size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Product Inventory Management</h1>
              <p className="text-sm text-slate-500">Spring Boot + MongoDB secured inventory workspace</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="px-3 py-2 border border-[#d7deea] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="px-3 py-2 border border-[#d7deea] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            <button
              onClick={fetchProducts}
              className="bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0d665f] transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Reload
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-7">
        <section className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl border border-[#d7deea] p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus size={18} /> Add Product
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                required
                type="text"
                placeholder="Product name"
                value={newProduct.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#d7deea] rounded-lg text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  min={0}
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-[#d7deea] rounded-lg text-sm"
                />
                <input
                  required
                  min={0}
                  type="number"
                  placeholder="Qty"
                  value={newProduct.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewProduct({ ...newProduct, quantity: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full px-3 py-2 border border-[#d7deea] rounded-lg text-sm"
                />
              </div>
              <input
                required
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#d7deea] rounded-lg text-sm"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#0f766e] text-white text-sm font-semibold hover:bg-[#0d665f]"
              >
                Create Product
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-[#d7deea] p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Inventory Snapshot</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Items</span>
                <span className="font-semibold">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Units In Stock</span>
                <span className="font-semibold">{totalStock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stock Value</span>
                <span className="font-semibold">₹{totalValue.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck size={14} className="mt-0.5" />
              <span>Basic authentication required. Delete operation is restricted to ADMIN.</span>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[#d7deea] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e7edf6] flex items-center justify-between">
              <h2 className="text-lg font-semibold">Products</h2>
              {loading && <Loader2 className="animate-spin text-[#0f766e]" size={18} />}
            </div>

            {error && (
              <div className="mx-5 my-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f7f9fc] border-b border-[#e7edf6]">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs uppercase text-slate-500">Product</th>
                    <th className="text-left px-5 py-3 text-xs uppercase text-slate-500">Category</th>
                    <th className="text-left px-5 py-3 text-xs uppercase text-slate-500">Price</th>
                    <th className="text-left px-5 py-3 text-xs uppercase text-slate-500">Qty</th>
                    <th className="text-right px-5 py-3 text-xs uppercase text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const isEditing = editingProductId === product.id;
                      return (
                        <tr key={product.id} className="border-b border-[#f0f3f8]">
                          <td className="px-5 py-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingProduct.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setEditingProduct({ ...editingProduct, name: e.target.value })
                                }
                                className="w-full px-2 py-1 border border-[#d7deea] rounded"
                              />
                            ) : (
                              <span className="font-medium">{product.name}</span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingProduct.category}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setEditingProduct({ ...editingProduct, category: e.target.value })
                                }
                                className="w-full px-2 py-1 border border-[#d7deea] rounded"
                              />
                            ) : (
                              product.category
                            )}
                          </td>
                          <td className="px-5 py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                min={0}
                                value={editingProduct.price}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                                }
                                className="w-24 px-2 py-1 border border-[#d7deea] rounded"
                              />
                            ) : (
                              `₹${product.price.toFixed(2)}`
                            )}
                          </td>
                          <td className="px-5 py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                min={0}
                                value={editingProduct.quantity}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value, 10) || 0 })
                                }
                                className="w-20 px-2 py-1 border border-[#d7deea] rounded"
                              />
                            ) : (
                              product.quantity
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleUpdate(product.id)}
                                    className="px-3 py-1.5 text-xs rounded bg-[#0f766e] text-white"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="px-3 py-1.5 text-xs rounded border border-[#d7deea]"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(product)}
                                    className="p-2 rounded hover:bg-[#eef3fb] text-slate-600"
                                    title="Edit"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 rounded hover:bg-red-50 text-slate-600 hover:text-red-700"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      {!isLoggedIn && (
        <div className="max-w-7xl mx-auto px-6 pb-6 text-sm text-amber-700">
          Authentication failed or server unavailable. Use valid credentials and ensure Spring Boot backend is running.
        </div>
      )}
    </div>
  );
}
