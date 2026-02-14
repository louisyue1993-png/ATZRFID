'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Truck, MapPin, Lock, CheckCircle2, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');

  const subtotal = 230.0;
  const shipping = shippingMethod === 'express' ? 25 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Checkout
            </h1>
            <p className="text-lg text-gray-600">
              Complete your order securely
            </p>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  <StepIndicator step={1} current={step} label="Shipping" />
                  <div className="flex-1 h-1 bg-gray-200 mx-4" />
                  <StepIndicator step={2} current={step} label="Payment" />
                  <div className="flex-1 h-1 bg-gray-200 mx-4" />
                  <StepIndicator step={3} current={step} label="Confirmation" />
                </div>

                {/* Step 1: Shipping */}
                {step === 1 && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Shipping Information</CardTitle>
                      <CardDescription>
                        Enter your shipping details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium">
                            First Name
                          </label>
                          <Input id="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                          </label>
                          <Input id="lastName" placeholder="Doe" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (234) 567-890"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium">
                          Street Address
                        </label>
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="city" className="text-sm font-medium">
                            City
                          </label>
                          <Input id="city" placeholder="City" required />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="state" className="text-sm font-medium">
                            State/Province
                          </label>
                          <Input id="state" placeholder="State" required />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="zip" className="text-sm font-medium">
                            ZIP/Postal Code
                          </label>
                          <Input id="zip" placeholder="12345" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="country" className="text-sm font-medium">
                          Country
                        </label>
                        <select
                          id="country"
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="DE">Germany</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>

                      {/* Shipping Methods */}
                      <div className="space-y-3 pt-4">
                        <p className="font-medium text-gray-900">Shipping Method</p>
                        <ShippingMethodCard
                          method="standard"
                          selected={shippingMethod}
                          onSelect={setShippingMethod}
                          title="Standard Shipping"
                          description="5-7 business days"
                          price={0}
                        />
                        <ShippingMethodCard
                          method="express"
                          selected={shippingMethod}
                          onSelect={setShippingMethod}
                          title="Express Shipping"
                          description="2-3 business days"
                          price={25}
                        />
                      </div>

                      <Button className="w-full" onClick={() => setStep(2)}>
                        Continue to Payment
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Payment Information</CardTitle>
                      <CardDescription>
                        Enter your payment details securely
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Tabs defaultValue="card" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="card">Credit Card</TabsTrigger>
                          <TabsTrigger value="paypal">PayPal</TabsTrigger>
                          <TabsTrigger value="wire">Bank Transfer</TabsTrigger>
                        </TabsList>

                        <TabsContent value="card" className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="cardNumber" className="text-sm font-medium">
                              Card Number
                            </label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="cardName" className="text-sm font-medium">
                              Cardholder Name
                            </label>
                            <Input
                              id="cardName"
                              placeholder="John Doe"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="expiry" className="text-sm font-medium">
                                Expiry Date
                              </label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                maxLength={5}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="cvv" className="text-sm font-medium">
                                CVV
                              </label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Lock className="h-4 w-4" />
                            <span>Your payment information is encrypted and secure</span>
                          </div>
                        </TabsContent>

                        <TabsContent value="paypal" className="space-y-4">
                          <div className="text-center py-8">
                            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                              You will be redirected to PayPal to complete your payment
                            </p>
                          </div>
                        </TabsContent>

                        <TabsContent value="wire" className="space-y-4">
                          <div className="text-center py-8">
                            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                              Bank transfer instructions will be provided after order
                              confirmation
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="flex gap-4 pt-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button className="flex-1" onClick={() => setStep(3)}>
                          Place Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="py-12">
                      <div className="text-center">
                        <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          Order Confirmed!
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Thank you for your order. A confirmation email has been sent to
                          your email address.
                        </p>
                        <div className="space-y-2 text-sm text-gray-600 mb-8">
                          <p>Order Number: #RFID-2025-001234</p>
                          <p>Estimated Delivery: {shippingMethod === 'express' ? '2-3' : '5-7'} business days</p>
                        </div>
                        <div className="flex gap-4 justify-center">
                          <Link href="/products">
                            <Button variant="outline">Continue Shopping</Button>
                          </Link>
                          <Link href="/contact">
                            <Button>Track Order</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-sm sticky top-20">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      <OrderItem
                        name="MIFARE Classic 1K RFID Card"
                        quantity="1000"
                        price="$150.00"
                      />
                      <OrderItem
                        name="UHF RFID Sticker Tag"
                        quantity="500"
                        price="$80.00"
                      />
                    </div>

                    <hr className="my-4" />

                    {/* Totals */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
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
                        <span className="font-semibold">${tax.toFixed(2)}</span>
                      </div>
                      <hr className="my-4" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Contact Support */}
                    <div className="pt-4 border-t text-sm">
                      <p className="font-medium text-gray-900 mb-2">
                        Need help?
                      </p>
                      <p className="text-gray-600">
                        Contact our support team for assistance with your order
                      </p>
                      <Link href="/contact" className="text-blue-600 hover:underline">
                        Get in touch
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StepIndicator({
  step,
  current,
  label,
}: {
  step: number;
  current: number;
  label: string;
}) {
  const isCompleted = current > step;
  const isCurrent = current === step;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
          isCompleted
            ? 'bg-green-600 text-white'
            : isCurrent
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function ShippingMethodCard({
  method,
  selected,
  onSelect,
  title,
  description,
  price,
}: {
  method: string;
  selected: string;
  onSelect: (method: string) => void;
  title: string;
  description: string;
  price: number;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        selected === method ? 'border-blue-600 bg-blue-50' : ''
      }`}
      onClick={() => onSelect(method)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                selected === method
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
              }`}
            >
              {selected === method && (
                <div className="w-2.5 h-2.5 bg-white rounded-full m-0.5" />
              )}
            </div>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <p className="font-semibold">
            {price === 0 ? 'FREE' : `$${price.toFixed(2)}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderItem({
  name,
  quantity,
  price,
}: {
  name: string;
  quantity: string;
  price: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{name}</p>
        <p className="text-gray-600">Qty: {quantity}</p>
      </div>
      <span className="font-semibold">{price}</span>
    </div>
  );
}
