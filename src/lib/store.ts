"use client";

// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = "buyer" | "seller";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  joinedAt: string;
  bio?: string;
  location?: string;
  phone?: string;
  rating?: number;
  totalSales?: number;
  totalPurchases?: number;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  status: "active" | "inactive" | "out_of_stock";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  items: { product: Product; quantity: number; price: number }[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded";
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  paymentMethod: string;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Review {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "order" | "message" | "review" | "promo" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const CATEGORIES = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys", "Beauty", "Automotive"];

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p1", sellerId: "s1", sellerName: "TechZone Store",
    title: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound. Perfect for travel, work, and everyday listening.",
    price: 89.99, originalPrice: 149.99,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"],
    stock: 45, rating: 4.7, reviewCount: 234,
    tags: ["headphones", "wireless", "noise-cancelling"],
    createdAt: "2025-01-15", status: "active"
  },
  {
    id: "p2", sellerId: "s1", sellerName: "TechZone Store",
    title: "Smart Watch Pro X",
    description: "Feature-rich smartwatch with health monitoring, GPS, 5-day battery, and 100+ workout modes. Water-resistant up to 50m.",
    price: 199.99, originalPrice: 279.99,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500"],
    stock: 28, rating: 4.5, reviewCount: 189,
    tags: ["smartwatch", "fitness", "GPS"],
    createdAt: "2025-02-01", status: "active"
  },
  {
    id: "p3", sellerId: "s2", sellerName: "Fashion Hub",
    title: "Premium Leather Jacket",
    description: "Genuine leather jacket with quilted lining, multiple pockets, and a classic biker style. Available in black and brown.",
    price: 159.99, originalPrice: 220.00,
    category: "Clothing",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500"],
    stock: 15, rating: 4.8, reviewCount: 92,
    tags: ["leather", "jacket", "fashion"],
    createdAt: "2025-01-20", status: "active"
  },
  {
    id: "p4", sellerId: "s2", sellerName: "Fashion Hub",
    title: "Running Shoes Ultra Boost",
    description: "Lightweight, responsive running shoes with energy-return foam, breathable mesh upper, and durable rubber outsole.",
    price: 79.99, originalPrice: 120.00,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500"],
    stock: 60, rating: 4.6, reviewCount: 315,
    tags: ["shoes", "running", "sports"],
    createdAt: "2025-02-10", status: "active"
  },
  {
    id: "p5", sellerId: "s3", sellerName: "HomeStyle",
    title: "Aromatherapy Diffuser",
    description: "Ultrasonic essential oil diffuser with 7 color LED lights, auto shut-off, and quiet operation. Covers up to 300 sq ft.",
    price: 34.99, originalPrice: 59.99,
    category: "Home & Garden",
    images: ["https://images.unsplash.com/photo-1600612253971-61f2c3c5a0c0?w=500", "https://images.unsplash.com/photo-1610552490285-abb09b38f7da?w=500"],
    stock: 80, rating: 4.4, reviewCount: 127,
    tags: ["diffuser", "aromatherapy", "home"],
    createdAt: "2025-01-10", status: "active"
  },
  {
    id: "p6", sellerId: "s3", sellerName: "HomeStyle",
    title: "Ceramic Plant Pot Set",
    description: "Set of 3 minimalist ceramic plant pots with drainage holes and saucers. Perfect for succulents and small houseplants.",
    price: 28.99,
    category: "Home & Garden",
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500"],
    stock: 35, rating: 4.3, reviewCount: 68,
    tags: ["pots", "plants", "ceramic", "decor"],
    createdAt: "2025-03-01", status: "active"
  },
  {
    id: "p7", sellerId: "s1", sellerName: "TechZone Store",
    title: "USB-C Hub 7-in-1",
    description: "Compact USB-C hub with HDMI 4K, 3x USB-A 3.0, SD/TF card reader, and 100W PD charging. Compatible with all USB-C laptops.",
    price: 39.99, originalPrice: 59.99,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500"],
    stock: 100, rating: 4.6, reviewCount: 445,
    tags: ["USB-C", "hub", "adapter"],
    createdAt: "2025-02-20", status: "active"
  },
  {
    id: "p8", sellerId: "s4", sellerName: "BookWorld",
    title: "The Art of Design Thinking",
    description: "A comprehensive guide to design thinking methodology with real-world case studies and practical exercises for innovators.",
    price: 24.99, originalPrice: 35.00,
    category: "Books",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"],
    stock: 200, rating: 4.9, reviewCount: 78,
    tags: ["design", "book", "thinking", "creativity"],
    createdAt: "2025-01-05", status: "active"
  },
  {
    id: "p9", sellerId: "s4", sellerName: "BookWorld",
    title: "Yoga Mat Premium",
    description: "6mm thick eco-friendly TPE yoga mat with alignment lines, non-slip surface, and carrying strap. Ideal for all yoga styles.",
    price: 49.99, originalPrice: 79.99,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"],
    stock: 55, rating: 4.7, reviewCount: 203,
    tags: ["yoga", "mat", "fitness", "sports"],
    createdAt: "2025-02-15", status: "active"
  },
  {
    id: "p10", sellerId: "s2", sellerName: "Fashion Hub",
    title: "Minimalist Watch",
    description: "Elegant stainless steel watch with sapphire crystal glass, Japanese movement, and genuine leather strap. Water-resistant 30m.",
    price: 129.99, originalPrice: 189.00,
    category: "Clothing",
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500"],
    stock: 22, rating: 4.8, reviewCount: 156,
    tags: ["watch", "minimalist", "fashion", "accessory"],
    createdAt: "2025-03-05", status: "active"
  },
  {
    id: "p11", sellerId: "s1", sellerName: "TechZone Store",
    title: "Mechanical Gaming Keyboard",
    description: "TKL mechanical keyboard with Cherry MX switches, RGB backlight, N-key rollover, and aluminum case. Perfect for gaming and typing.",
    price: 119.99, originalPrice: 159.99,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1601445638532-1d23e7b3e08d?w=500"],
    stock: 33, rating: 4.6, reviewCount: 289,
    tags: ["keyboard", "mechanical", "gaming", "RGB"],
    createdAt: "2025-01-25", status: "active"
  },
  {
    id: "p12", sellerId: "s3", sellerName: "HomeStyle",
    title: "Scented Candle Collection",
    description: "Set of 4 luxury soy wax candles in vanilla, lavender, sandalwood, and citrus. 40+ hour burn time each.",
    price: 44.99, originalPrice: 64.99,
    category: "Beauty",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"],
    stock: 70, rating: 4.5, reviewCount: 112,
    tags: ["candles", "scented", "home", "luxury"],
    createdAt: "2025-02-28", status: "active"
  }
];

export const SEED_REVIEWS: Review[] = [
  { id: "r1", productId: "p1", buyerId: "b1", buyerName: "Alice Johnson", rating: 5, comment: "Absolutely love these headphones! The noise cancellation is incredible and the sound quality is top-notch. Perfect for my daily commute.", createdAt: "2025-03-01", helpful: 12 },
  { id: "r2", productId: "p1", buyerId: "b2", buyerName: "Bob Smith", rating: 4, comment: "Great headphones overall. Battery life is excellent. Only minor complaint is they get a bit warm after long sessions.", createdAt: "2025-02-20", helpful: 8 },
  { id: "r3", productId: "p2", buyerId: "b1", buyerName: "Alice Johnson", rating: 5, comment: "This smartwatch is a game changer. The health monitoring is accurate and the GPS works flawlessly.", createdAt: "2025-03-05", helpful: 15 },
  { id: "r4", productId: "p3", buyerId: "b3", buyerName: "Carol White", rating: 5, comment: "The quality is amazing! Real leather, great stitching, fits perfectly. Definitely worth the price.", createdAt: "2025-02-15", helpful: 20 },
];

export const SEED_ORDERS: Order[] = [
  {
    id: "ord1", buyerId: "b1", buyerName: "Alice Johnson",
    sellerId: "s1", sellerName: "TechZone Store",
    items: [{ product: SEED_PRODUCTS[0], quantity: 1, price: 89.99 }],
    total: 89.99, status: "delivered",
    shippingAddress: { fullName: "Alice Johnson", street: "123 Main St", city: "New York", state: "NY", zip: "10001", country: "US" },
    createdAt: "2025-02-10", updatedAt: "2025-02-15",
    trackingNumber: "TRK123456789", paymentMethod: "Credit Card"
  },
  {
    id: "ord2", buyerId: "b1", buyerName: "Alice Johnson",
    sellerId: "s2", sellerName: "Fashion Hub",
    items: [{ product: SEED_PRODUCTS[2], quantity: 1, price: 159.99 }, { product: SEED_PRODUCTS[3], quantity: 2, price: 79.99 }],
    total: 319.97, status: "shipped",
    shippingAddress: { fullName: "Alice Johnson", street: "123 Main St", city: "New York", state: "NY", zip: "10001", country: "US" },
    createdAt: "2025-03-01", updatedAt: "2025-03-05",
    trackingNumber: "TRK987654321", paymentMethod: "PayPal"
  },
];

export const SEED_MESSAGES: Message[] = [
  { id: "m1", fromId: "b1", fromName: "Alice Johnson", toId: "s1", toName: "TechZone Store", content: "Hi, do you have the headphones in white color?", createdAt: "2025-03-10T10:00:00", read: true },
  { id: "m2", fromId: "s1", fromName: "TechZone Store", toId: "b1", toName: "Alice Johnson", content: "Hello Alice! Yes, we have them in white, black, and blue. The white version is available and ready to ship.", createdAt: "2025-03-10T10:15:00", read: true },
  { id: "m3", fromId: "b1", fromName: "Alice Johnson", toId: "s1", toName: "TechZone Store", content: "Great! I'll order the white one. Thanks!", createdAt: "2025-03-10T10:20:00", read: false },
];

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "b1", type: "order", title: "Order Delivered!", message: "Your order #ord1 has been delivered successfully.", read: false, createdAt: "2025-02-15T14:00:00", link: "/buyer/orders" },
  { id: "n2", userId: "b1", type: "promo", title: "Flash Sale! 50% Off Electronics", message: "Limited time offer on all electronics. Shop now!", read: false, createdAt: "2025-03-10T09:00:00", link: "/buyer/browse" },
  { id: "n3", userId: "s1", type: "order", title: "New Order Received!", message: "You have a new order from Alice Johnson for Wireless Headphones.", read: false, createdAt: "2025-03-01T11:00:00", link: "/seller/orders" },
  { id: "n4", userId: "s1", type: "review", title: "New 5-Star Review!", message: "Alice Johnson left a 5-star review on Wireless Noise-Cancelling Headphones.", read: true, createdAt: "2025-03-01T12:00:00", link: "/seller/products" },
];

// ─── Demo Users ───────────────────────────────────────────────────────────────

export const DEMO_BUYER: User = {
  id: "b1", name: "Alice Johnson", email: "buyer@demo.com",
  role: "buyer", avatar: "https://i.pravatar.cc/150?img=47",
  joinedAt: "2024-06-01", bio: "Love shopping for quality products!",
  location: "New York, USA", phone: "+1 (555) 234-5678",
  rating: 4.9, totalPurchases: 23
};

export const DEMO_SELLER: User = {
  id: "s1", name: "TechZone Store", email: "seller@demo.com",
  role: "seller", avatar: "https://i.pravatar.cc/150?img=12",
  joinedAt: "2023-01-15", bio: "Your go-to store for premium electronics and tech accessories.",
  location: "San Francisco, CA", phone: "+1 (555) 123-4567",
  rating: 4.8, totalSales: 1243
};
