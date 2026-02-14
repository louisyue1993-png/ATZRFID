'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(getCartItems());

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price.replace('From $', '')) * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shopping Cart
            </h1>
            <p className="text-lg text-gray-600">
              Review your selected RFID products
            </p>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {cartItems.length === 0 ? (
              <div className="max-w-2xl mx-auto text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your cart is empty
                </h2>
                <p className="text-gray-600 mb-6">
                  Browse our collection of RFID products and add items to your cart
                </p>
                <Link href="/products">
                  <Button size="lg">
                    Browse Products
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="min-w-0">
                                <Link
                                  href={`/products/${item.id}`}
                                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.chip} • {item.frequency}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  readOnly
                                  className="w-16 h-8 text-center"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  ${(
                                    parseFloat(item.price.replace('From $', '')) * item.quantity
                                  ).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.price} each
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-sm sticky top-20">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold">
                          {shipping === 0 ? (
                            <Badge variant="secondary">FREE</Badge>
                          ) : (
                            `$${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold">${(subtotal * 0.1).toFixed(2)}</span>
                      </div>
                      <hr className="my-4" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${(total + subtotal * 0.1).toFixed(2)}</span>
                      </div>

                      <div className="pt-4 space-y-3">
                        <Button className="w-full" size="lg">
                          Proceed to Checkout
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                        <Link href="/products">
                          <Button variant="outline" className="w-full">
                            Continue Shopping
                          </Button>
                        </Link>
                      </div>

                      {/* Coupon Code */}
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Have a coupon code?
                        </p>
                        <div className="flex gap-2">
                          <Input placeholder="Enter code" />
                          <Button variant="outline">Apply</Button>
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="pt-4 border-t text-sm text-gray-600">
                        <p className="font-medium text-gray-900 mb-2">
                          Free shipping on orders over $100
                        </p>
                        <p>
                          {shipping === 0
                            ? 'Your order qualifies for free shipping!'
                            : `Add $${(100 - subtotal).toFixed(2)} more for free shipping`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function getCartItems(): CartItem[] {
  return [
    {
      id: 1,
      name: 'MIFARE Classic 1K RFID Card',
      price: 'From $0.15',
      chip: 'NXP MIFARE Classic 1K',
      frequency: '13.56 MHz',
      quantity: 1000,
    },
    {
      id: 2,
      name: 'UHF RFID Sticker Tag',
      price: 'From $0.20',
      chip: 'Alien H3',
      frequency: 'UHF 860-960MHz',
      quantity: 500,
    },
  ];
}

type CartItem = {
  id: number;
  name: string;
  price: string;
  chip: string;
  frequency: string;
  quantity: number;
};
