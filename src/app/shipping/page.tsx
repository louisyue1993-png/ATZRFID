import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Globe, Clock, Package, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Shipping Policy | ATZ RFID',
  description: 'Learn about our shipping policies, delivery times, and international shipping options.',
  keywords: ['shipping policy', 'delivery', 'international shipping'],
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shipping Policy
            </h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about our shipping and delivery
            </p>
          </div>
        </section>

        {/* Shipping Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="prose prose-lg max-w-none space-y-8">
                    <p className="text-lg text-gray-600">
                      We offer fast and reliable shipping to over 100 countries worldwide.
                      Below you will find detailed information about our shipping options,
                      delivery times, and policies.
                    </p>

                    {/* Shipping Options */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Truck className="h-6 w-6 text-blue-600" />
                        Shipping Options
                      </h2>
                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <ShippingOption
                          title="Standard Shipping"
                          price="FREE (orders over $100)"
                          deliveryTime="5-7 business days"
                          features={[
                            'Free on orders over $100',
                            'Tracking included',
                            'Insurance included',
                            'Available worldwide',
                          ]}
                        />
                        <ShippingOption
                          title="Express Shipping"
                          price="$25.00"
                          deliveryTime="2-3 business days"
                          features={[
                            'Priority handling',
                            'Real-time tracking',
                            'Full insurance coverage',
                            'Available worldwide',
                          ]}
                          recommended
                        />
                      </div>
                    </section>

                    {/* International Shipping */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="h-6 w-6 text-blue-600" />
                        International Shipping
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          We ship to over 100 countries worldwide. International orders may
                          be subject to customs duties, taxes, and other fees imposed by
                          the destination country. These charges are the responsibility of
                          the recipient.
                        </p>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Important Notes for International Orders:
                          </h3>
                          <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>Customs processing may add 1-3 additional business days</li>
                            <li>Some products may require special export documentation</li>
                            <li>Delivery times may vary by country</li>
                            <li>We provide all necessary documentation for customs clearance</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Order Processing */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-blue-600" />
                        Order Processing Time
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Orders are processed within 1-2 business days. Custom orders may
                          require additional processing time depending on the complexity of
                          the customization.
                        </p>
                        <div className="bg-blue-50 p-6 rounded-lg">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Processing Times by Order Type:
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              <span className="text-gray-700">
                                <strong>Standard Orders:</strong> 1-2 business days
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              <span className="text-gray-700">
                                <strong>Custom Printed Cards:</strong> 3-5 business days
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              <span className="text-gray-700">
                                <strong>Bulk Orders (1000+ units):</strong> 5-7 business days
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              <span className="text-gray-700">
                                <strong>Custom Manufacturing:</strong> 10-14 business days
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    {/* Packaging */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="h-6 w-6 text-blue-600" />
                        Packaging
                      </h2>
                      <p className="text-gray-600">
                        All products are carefully packaged to ensure they arrive in perfect
                        condition. We use eco-friendly packaging materials whenever possible.
                        RFID products are individually wrapped and packed in protective
                        materials to prevent damage during transit.
                      </p>
                    </section>

                    {/* Tracking */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Order Tracking
                      </h2>
                      <p className="text-gray-600">
                        Once your order ships, you will receive a confirmation email with a
                        tracking number. You can track your order using this number on our
                        website or through the shipping carrier&apos;s website. Tracking
                        information is typically updated within 24-48 hours of shipment.
                      </p>
                    </section>

                    {/* Shipping Address */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Shipping Address
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Please ensure your shipping address is accurate and complete. We are
                          not responsible for orders shipped to incorrect addresses provided
                          by the customer. Address changes must be requested within 24 hours
                          of placing your order.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> For security reasons, we can only ship
                            orders to the billing address on file or other verified addresses.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Delivery Issues */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Delivery Issues
                      </h2>
                      <p className="text-gray-600 mb-3">
                        If you experience any delivery issues, please contact us immediately:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-600">
                        <li>Lost or missing packages</li>
                        <li>Damaged or incorrect items</li>
                        <li>Delayed shipments</li>
                        <li>Delivery confirmation errors</li>
                      </ul>
                      <p className="text-gray-600 mt-3">
                        We will work with the shipping carrier to resolve any issues and
                        ensure your order is delivered as soon as possible.
                      </p>
                    </section>

                    {/* Contact */}
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Questions About Shipping?
                      </h2>
                      <p className="text-gray-600">
                        If you have any questions about our shipping policy or need help
                        with your order, please contact our customer service team:
                      </p>
                      <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 font-medium">Email: info@atzrfid.com</p>
                        <p className="text-gray-900 font-medium">Phone: +86 176 8896 4979</p>
                        <p className="text-gray-900 font-medium">WhatsApp: +86 176 8896 4979</p>
                        <p className="text-gray-900 font-medium">Hours: Monday - Friday, 9:00 AM - 6:00 PM (GMT+8)</p>
                      </div>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ShippingOption({
  title,
  price,
  deliveryTime,
  features,
  recommended = false,
}: {
  title: string;
  price: string;
  deliveryTime: string;
  features: string[];
  recommended?: boolean;
}) {
  return (
    <Card className={`border-2 ${recommended ? 'border-blue-600' : 'border-gray-200'}`}>
      <CardContent className="p-6">
        {recommended && (
          <Badge className="mb-4">Recommended</Badge>
        )}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-2xl font-bold text-blue-600 mb-2">{price}</p>
        <p className="text-gray-600 mb-4">{deliveryTime}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
