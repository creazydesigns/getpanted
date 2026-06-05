"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminFetch } from "@/components/admin/admin-fetch";
import { useAdminToast } from "@/components/admin/admin-toast";
import { formatNaira, sumStock } from "@/lib/admin/format";

type Product = {
  id: string;
  name: string;
  price: number;
  total_stock: number;
  stock_by_size: Record<string, number>;
  category: string;
  status: string;
  created_at: string;
  image: string;
  images: string[];
};

export default function AdminProductsPage() {
  const { toast } = useAdminToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockVal, setStockVal] = useState("");

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (q) params.set("q", q);
    adminFetch<{ products: Product[] }>(`/api/admin/products?${params}`).then(({ data }) => {
      setProducts(data?.products ?? []);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, [status]);

  const toggleStatus = async (p: Product) => {
    const next = p.status === "active" ? "draft" : "active";
    const { error } = await adminFetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    if (error) toast(error, "error");
    else {
      toast(`Marked as ${next}`);
      load();
    }
  };

  const saveStock = async (id: string) => {
    const total = Number(stockVal);
    if (Number.isNaN(total)) return;
    const { error } = await adminFetch(`/api/admin/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ total_stock: total }),
    });
    setEditingStock(null);
    if (error) toast(error, "error");
    else {
      toast("Stock updated");
      load();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="admin-page-title">Products</h1>
        <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
          Add New Product
        </Link>
      </div>
      <div className="admin-toolbar">
        <input
          className="admin-input"
          style={{ maxWidth: 220 }}
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button type="button" className="admin-btn" onClick={load}>
          Search
        </button>
        <select className="admin-select" style={{ width: 140 }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Status</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const stock = p.total_stock ?? sumStock(p.stock_by_size);
                const rowClass =
                  stock === 0 ? "stock-out" : stock <= 3 ? "stock-low" : "";
                const img = p.images?.[0] ?? p.image;
                return (
                  <tr key={p.id} className={rowClass}>
                    <td>
                      {img ? (
                        <Image src={img} alt="" width={40} height={48} className="admin-thumb" unoptimized />
                      ) : (
                        <div className="admin-thumb" />
                      )}
                    </td>
                    <td>
                      <Link href={`/admin/products/${p.id}`}>{p.name}</Link>
                    </td>
                    <td>{formatNaira(Number(p.price))}</td>
                    <td>
                      {editingStock === p.id ? (
                        <input
                          className="admin-input"
                          style={{ width: 64 }}
                          value={stockVal}
                          onChange={(e) => setStockVal(e.target.value)}
                          onBlur={() => saveStock(p.id)}
                          onKeyDown={(e) => e.key === "Enter" && saveStock(p.id)}
                          autoFocus
                        />
                      ) : (
                        <button
                          type="button"
                          className="admin-btn"
                          style={{ padding: "2px 8px" }}
                          onClick={() => {
                            setEditingStock(p.id);
                            setStockVal(String(stock));
                          }}
                        >
                          {stock}
                        </button>
                      )}
                    </td>
                    <td>{p.category}</td>
                    <td>
                      <button type="button" className="admin-btn" onClick={() => toggleStatus(p)}>
                        {p.status === "active" ? "Active" : "Draft"}
                      </button>
                    </td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td>
                      <Link href={`/admin/products/${p.id}`} className="admin-btn">
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
