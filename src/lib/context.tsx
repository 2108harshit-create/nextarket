"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  User, Product, CartItem, Order, Review, Message, Notification, WishlistItem,
  SEED_PRODUCTS, SEED_REVIEWS, SEED_ORDERS, SEED_MESSAGES, SEED_NOTIFICATIONS,
  DEMO_BUYER, DEMO_SELLER
} from "./store";

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, role: "buyer" | "seller") => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt" | "reviewCount" | "rating">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsBySeller: (sellerId: string) => Product[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: Order["shippingAddress"], paymentMethod: string) => Order | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getBuyerOrders: (buyerId: string) => Order[];
  getSellerOrders: (sellerId: string) => Order[];

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "createdAt" | "helpful">) => void;
  getProductReviews: (productId: string) => Review[];

  // Messages
  messages: Message[];
  sendMessage: (toId: string, toName: string, content: string) => void;
  markMessageRead: (messageId: string) => void;
  getConversations: (userId: string) => { userId: string; userName: string; lastMessage: Message; unreadCount: number }[];
  getConversationMessages: (userId1: string, userId2: string) => Message[];

  // Notifications
  notifications: Notification[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  getUnreadNotificationCount: (userId: string) => number;

  // UI State
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback((email: string, _password: string) => {
    if (email === "buyer@demo.com") {
      setCurrentUser(DEMO_BUYER);
      return { success: true };
    }
    if (email === "seller@demo.com") {
      setCurrentUser(DEMO_SELLER);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const register = useCallback((name: string, email: string, _password: string, role: "buyer" | "seller") => {
    const newUser: User = {
      id: `user_${Date.now()}`, name, email, role,
      joinedAt: new Date().toISOString().split("T")[0],
      rating: 5, totalPurchases: 0, totalSales: 0
    };
    setCurrentUser(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setCurrentUser(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  // ── Products ──────────────────────────────────────────────────────────────
  const addProduct = useCallback((product: Omit<Product, "id" | "createdAt" | "reviewCount" | "rating">) => {
    const newProduct: Product = {
      ...product,
      id: `p_${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      reviewCount: 0,
      rating: 0
    };
    setProducts(prev => [newProduct, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);
  const getProductsBySeller = useCallback((sellerId: string) => products.filter(p => p.sellerId === sellerId), [products]);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── Wishlist ──────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  // ── Orders ────────────────────────────────────────────────────────────────
  const placeOrder = useCallback((shippingAddress: Order["shippingAddress"], paymentMethod: string): Order | null => {
    if (!currentUser || cart.length === 0) return null;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: cart[0].product.sellerId,
      sellerName: cart[0].product.sellerName,
      items: cart.map(item => ({ product: item.product, quantity: item.quantity, price: item.product.price })),
      total: cartTotal,
      status: "pending",
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentMethod
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    const orderNotification: Notification = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      type: "order",
      title: "Order Placed Successfully!",
      message: `Your order #${newOrder.id} has been placed and is being processed.`,
      read: false,
      createdAt: new Date().toISOString(),
      link: "/buyer/orders"
    };
    setNotifications(prev => [orderNotification, ...prev]);
    return newOrder;
  }, [currentUser, cart, cartTotal, clearCart]);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
  }, []);

  const getBuyerOrders = useCallback((buyerId: string) => orders.filter(o => o.buyerId === buyerId), [orders]);
  const getSellerOrders = useCallback((sellerId: string) => orders.filter(o => o.sellerId === sellerId), [orders]);

  // ── Reviews ───────────────────────────────────────────────────────────────
  const addReview = useCallback((review: Omit<Review, "id" | "createdAt" | "helpful">) => {
    const newReview: Review = { ...review, id: `rev_${Date.now()}`, createdAt: new Date().toISOString(), helpful: 0 };
    setReviews(prev => [newReview, ...prev]);
    setProducts(prev => prev.map(p => {
      if (p.id !== review.productId) return p;
      const productReviews = [...reviews.filter(r => r.productId === review.productId), newReview];
      const avgRating = productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length;
      return { ...p, rating: Math.round(avgRating * 10) / 10, reviewCount: productReviews.length };
    }));
  }, [reviews]);

  const getProductReviews = useCallback((productId: string) => reviews.filter(r => r.productId === productId), [reviews]);

  // ── Messages ──────────────────────────────────────────────────────────────
  const sendMessage = useCallback((toId: string, toName: string, content: string) => {
    if (!currentUser) return;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      fromId: currentUser.id,
      fromName: currentUser.name,
      toId, toName, content,
      createdAt: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [...prev, newMsg]);
  }, [currentUser]);

  const markMessageRead = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, read: true } : m));
  }, []);

  const getConversations = useCallback((userId: string) => {
    const participants = new Set<string>();
    messages.forEach(m => {
      if (m.fromId === userId) participants.add(m.toId);
      if (m.toId === userId) participants.add(m.fromId);
    });
    return Array.from(participants).map(otherId => {
      const conv = messages.filter(m =>
        (m.fromId === userId && m.toId === otherId) ||
        (m.fromId === otherId && m.toId === userId)
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const lastMessage = conv[0];
      const unreadCount = conv.filter(m => m.toId === userId && !m.read).length;
      const otherName = lastMessage.fromId === userId ? lastMessage.toName : lastMessage.fromName;
      return { userId: otherId, userName: otherName, lastMessage, unreadCount };
    });
  }, [messages]);

  const getConversationMessages = useCallback((userId1: string, userId2: string) => {
    return messages
      .filter(m => (m.fromId === userId1 && m.toId === userId2) || (m.fromId === userId2 && m.toId === userId1))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [messages]);

  // ── Notifications ─────────────────────────────────────────────────────────
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const getUnreadNotificationCount = useCallback((userId: string) =>
    notifications.filter(n => n.userId === userId && !n.read).length
  , [notifications]);

  const value: AppContextType = {
    currentUser, login, register, logout, updateProfile,
    products, addProduct, updateProduct, deleteProduct, getProductById, getProductsBySeller,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
    wishlist, toggleWishlist, isInWishlist,
    orders, placeOrder, updateOrderStatus, getBuyerOrders, getSellerOrders,
    reviews, addReview, getProductReviews,
    messages, sendMessage, markMessageRead, getConversations, getConversationMessages,
    notifications, markNotificationRead, markAllNotificationsRead, getUnreadNotificationCount,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, priceRange, setPriceRange
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
