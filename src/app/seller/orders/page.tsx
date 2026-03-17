"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { ShoppingBag, Clock, CheckCircle, Truck, XCircle, RotateCcw, ChevronDown, ChevronUp, Package, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Order } from "@/lib/store";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock, next: "confirmed" as const },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle, next: "shipped" as const },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Truck, next: "delivered" as const },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle, next: null },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, next: null },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-600 border-gray-200", icon: RotateCcw, next: null },
};

const NEXT_LABELS: Record<string, string> = {
  confirmed: "Confirm Order",
  shipped: "Mark as Shipped",
  delivered: "Mark as Delivered",
};

export default function SellerOrdersPage() {
  const { currentUser, getSellerOrders, updateOrderStatus } = useApp();
  const orders = getSellerOrders(currentUser?.id || "");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const toggleExpand = (id: string) => {
    setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const handleAdvanceStatus = (order: Order) => {
    const conf = STATUS_CONFIG[order.status];
    if (conf.next) {
      updateOrderStatus(order.id, conf.next);
      toast.success(`Order marked as ${conf.next}!`);
    }
  };

  const handleCancel = (orderId: string) => {
    if (window.confirm("Cancel this order?")) {
      updateOrderStatus(orderId, "cancelled");
      toast.success("Order cancelled");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
        {counts.pending > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700 text-sm font-semibold">{counts.pending} pending</span>
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <button onClick={() => setFilter("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === "all" ? "bg-purple-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"}`}>
          All ({orders.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([status, conf]) => counts[status] > 0 && (
          <button key={status} onClick={() => setFilter(status)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === status ? "bg-purple-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"}`}>
            {conf.label} ({counts[status]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">Orders will appear here when buyers purchase your products</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const conf = STATUS_CONFIG[order.status];
            const StatusIcon = conf.icon;
            const isExpanded = expanded.has(order.id);

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${conf.color} border flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <span className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</span>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold border ${conf.color}`}>{conf.label}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 flex-shrink-0">${order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{order.buyerName}</span>
                        <span>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>{order.items.reduce((s, i) => s + i.quantity, 0)} items · {order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Item Thumbnails */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 4).map((item, i) => (
                        <img key={i} src={item.product.images[0]} alt={item.product.title} className="w-9 h-9 rounded-lg object-cover border-2 border-white" />
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-9 h-9 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-500">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      {/* Message Buyer */}
                      <Link href={`/seller/messages?buyer=${order.buyerId}&buyerName=${order.buyerName}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Message Buyer">
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                      {/* Expand */}
                      <button onClick={() => toggleExpand(order.id)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isExpanded ? "Less" : "Details"}
                      </button>
                      {/* Advance Status */}
                      {conf.next && (
                        <button onClick={() => handleAdvanceStatus(order)}
                          className="px-3 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition-colors">
                          {NEXT_LABELS[conf.next]}
                        </button>
                      )}
                      {order.status === "pending" && (
                        <button onClick={() => handleCancel(order.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <img src={item.product.images[0]} alt={item.product.title} className="w-10 h-10 rounded-xl object-cover bg-white" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.title}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Shipping Address</h4>
                        <div className="text-sm text-gray-600 leading-relaxed bg-white rounded-xl p-3">
                          <p className="font-medium">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                        {order.trackingNumber && (
                          <div className="mt-3 p-3 bg-indigo-50 rounded-xl">
                            <p className="text-xs text-indigo-600 font-medium">Tracking Number</p>
                            <p className="text-sm font-bold text-indigo-700">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
