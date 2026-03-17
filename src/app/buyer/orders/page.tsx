"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { Package, ChevronDown, ChevronUp, Truck, CheckCircle, Clock, XCircle, RotateCcw, Star } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-700", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-600", icon: RotateCcw },
};

export default function OrdersPage() {
  const { currentUser, getBuyerOrders } = useApp();
  const orders = getBuyerOrders(currentUser?.id || "");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("all");

  const toggleOrder = (id: string) => {
    setExpandedOrders(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const statusCounts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">{orders.length}</span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        <button onClick={() => setFilter("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"}`}>
          All ({orders.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([status, config]) => statusCounts[status] > 0 && (
          <button key={status} onClick={() => setFilter(status)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === status ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"}`}>
            {config.label} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">When you place orders, they'll appear here</p>
          <Link href="/buyer/browse" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const statusConf = STATUS_CONFIG[order.status];
            const StatusIcon = statusConf.icon;
            const isExpanded = expandedOrders.has(order.id);
            const steps = ["pending", "confirmed", "shipped", "delivered"];
            const currentStep = steps.indexOf(order.status);

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${statusConf.color} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-sm">Order #{order.id.slice(0, 8)}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConf.color}`}>{statusConf.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          {" · "}{order.sellerName}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-xs text-indigo-600 mt-1 font-medium">Tracking: {order.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-900">${order.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">{order.items.reduce((s, i) => s + i.quantity, 0)} items</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {!["cancelled", "refunded"].includes(order.status) && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        {steps.map((step, i) => (
                          <div key={step} className="flex flex-col items-center flex-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentStep ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                              {i < currentStep ? "✓" : i + 1}
                            </div>
                            <span className={`text-xs mt-1 capitalize hidden sm:block ${i <= currentStep ? "text-indigo-600 font-medium" : "text-gray-400"}`}>{step}</span>
                          </div>
                        ))}
                        {i => i < steps.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 ${currentStep > 0 ? "bg-indigo-600" : "bg-gray-200"}`} />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items Preview */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <img key={i} src={item.product.images[0]} alt={item.product.title}
                          className="w-10 h-10 rounded-lg object-cover border-2 border-white" />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <button onClick={() => toggleOrder(order.id)} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium ml-auto">
                      {isExpanded ? "Hide" : "Details"} {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <img src={item.product.images[0]} alt={item.product.title} className="w-12 h-12 rounded-xl object-cover bg-white" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.title}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h4>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Payment</h4>
                          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                          <p className="text-base font-bold text-gray-900 mt-1">Total: ${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {order.status === "delivered" && (
                      <div className="flex gap-3 pt-3 border-t border-gray-200">
                        <Link href={`/buyer/product/${order.items[0].product.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl text-sm font-medium hover:bg-yellow-100 transition-colors">
                          <Star className="w-4 h-4" /> Leave Review
                        </Link>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                          <RotateCcw className="w-4 h-4" /> Request Return
                        </button>
                      </div>
                    )}
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
