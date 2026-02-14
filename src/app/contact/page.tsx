import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Us | ATZ RFID',
  description: 'Get in touch with ATZ RFID for quotes, inquiries, and support. Leading RFID manufacturer providing premium products worldwide.',
  keywords: ['contact', 'ATZ RFID', 'RFID supplier', 'support', 'quote request'],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section - Premium Design */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            We'd Love to Hear From You
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Whether you have questions about our RFID products, need a custom solution,
            or want to discuss bulk orders, our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information - Premium Cards */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-xl">Get in Touch</CardTitle>
                <CardDescription className="text-slate-600">
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Email Us</p>
                    <a href="mailto:info@atzrfid.com" className="text-slate-600 text-sm hover:text-blue-600">info@atzrfid.com</a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Call Us</p>
                    <a href="tel:+8617688964979" className="text-slate-600 text-sm hover:text-blue-600">+86 176 8896 4979</a>
                    <br />
                    <a href="https://wa.me/8617688964979" className="text-slate-600 text-xs text-slate-500 hover:text-green-600">WhatsApp Available</a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Visit Us</p>
                    <p className="text-slate-600 text-sm">
                      441F, Building 522<br />
                      Bagualing Industrial Zone<br />
                      Shenzhen, Guangdong, China
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Business Hours</p>
                    <p className="text-slate-600 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM (GMT+8)<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 shadow-lg shadow-blue-500/30">
              <CardContent className="pt-6">
                <h3 className="font-bold text-white mb-2 text-lg">
                  Quick Response Guaranteed
                </h3>
                <p className="text-sm text-blue-50">
                  We respond to all inquiries within 24 hours. For urgent matters,
                  call us directly or use WhatsApp for immediate assistance.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">What information should I include in my inquiry?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Please include your product requirements, quantity needed, intended use case,
                  and any specific technical specifications you have. This helps us provide
                  the most accurate recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Do you offer custom RFID solutions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Yes! We specialize in custom RFID solutions. Whether you need custom encoding,
                  unique form factors, or specialized materials, our team can design a solution
                  tailored to your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">What are your minimum order quantities?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We offer flexible ordering options. Standard products have lower minimums,
                  while custom solutions may require larger quantities. Contact us for specific
                  details about your project.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Do you ship internationally?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Yes, we ship RFID products worldwide. We work with reliable shipping partners
                  to ensure your order arrives safely and on time, regardless of your location.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
