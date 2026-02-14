import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertCircle, Scale } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | ATZ RFID',
  description: 'Read our Terms of Service to understand the rules and regulations for using our website and services.',
  keywords: ['terms of service', 'terms and conditions', 'legal'],
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 2025
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="prose prose-lg max-w-none space-y-8">
                    <p className="text-lg text-gray-600">
                      Welcome to RFID Solutions. By using our website and services, you agree
                      to comply with and be bound by these Terms of Service.
                    </p>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="h-6 w-6 text-blue-600" />
                        Acceptance of Terms
                      </h2>
                      <p className="text-gray-600">
                        By accessing and using RFID Solutions website and services, you
                        accept and agree to be bound by these Terms of Service. If you do
                        not agree to these terms, please do not use our website or services.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Scale className="h-6 w-6 text-blue-600" />
                        Products and Services
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          RFID Solutions reserves the right to modify, suspend, or discontinue
                          any aspect of our website or services at any time without prior
                          notice. We also reserve the right to refuse service to anyone for
                          any reason at our sole discretion.
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-600">
                          <li>All products are subject to availability</li>
                          <li>Prices and specifications are subject to change</li>
                          <li>Custom orders may require additional processing time</li>
                          <li>We strive to provide accurate product descriptions but do not warrant accuracy</li>
                        </ul>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                        Orders and Payment
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          By placing an order through our website, you agree to:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-600">
                          <li>Provide accurate, current, and complete information</li>
                          <li>Maintain the security of your account credentials</li>
                          <li>Accept responsibility for all activities under your account</li>
                          <li>Pay all charges incurred at the prices in effect</li>
                        </ul>
                        <p className="text-gray-600">
                          Payment is due at the time of order placement. We reserve the right
                          to cancel orders that do not meet our payment requirements or
                          appear suspicious.
                        </p>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Shipping and Delivery
                      </h2>
                      <p className="text-gray-600">
                        Shipping times are estimates and are not guaranteed. RFID Solutions
                        is not liable for delays caused by shipping carriers, customs, or
                        other factors beyond our control. Risk of loss transfers to the
                        customer upon delivery to the shipping carrier.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Returns and Refunds
                      </h2>
                      <p className="text-gray-600 mb-3">
                        Our return policy is as follows:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-600">
                        <li>Returns must be requested within 30 days of delivery</li>
                        <li>Products must be unused and in original packaging</li>
                        <li>Custom orders are non-returnable unless defective</li>
                        <li>Shipping costs are non-refundable</li>
                        <li>Refunds will be processed within 5-7 business days</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Intellectual Property
                      </h2>
                      <p className="text-gray-600">
                        All content on this website, including text, graphics, logos, and
                        images, is the property of RFID Solutions or its content suppliers
                        and is protected by international copyright laws. Unauthorized use
                        of any content is strictly prohibited.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Limitation of Liability
                      </h2>
                      <p className="text-gray-600">
                        RFID Solutions shall not be liable for any indirect, incidental,
                        special, consequential, or punitive damages arising from your use
                        of our website or services. Our total liability to you shall not
                        exceed the amount you paid for the products or services in question.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Governing Law
                      </h2>
                      <p className="text-gray-600">
                        These Terms of Service shall be governed by and construed in accordance
                        with the laws of the jurisdiction in which RFID Solutions is based.
                        Any disputes arising under these terms shall be subject to the exclusive
                        jurisdiction of the courts in that jurisdiction.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Changes to Terms
                      </h2>
                      <p className="text-gray-600">
                        We reserve the right to modify these Terms of Service at any time.
                        Your continued use of our website after any changes constitutes
                        acceptance of the revised terms.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Contact Us
                      </h2>
                      <p className="text-gray-600">
                        If you have any questions about these Terms of Service, please
                        contact us at:
                      </p>
                      <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 font-medium">Email: legal@atzrfid.com</p>
                        <p className="text-gray-900 font-medium">Phone: +86 176 8896 4979</p>
                        <p className="text-gray-900 font-medium">Address: 441F, Building 522, Bagualing Industrial Zone, Shenzhen, Guangdong, China</p>
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
