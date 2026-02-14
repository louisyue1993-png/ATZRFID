import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Globe, Mail, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | ATZ RFID',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
  keywords: ['privacy policy', 'data protection', 'GDPR', 'privacy'],
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 2025
            </p>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="prose prose-lg max-w-none space-y-8">
                    <p className="text-lg text-gray-600">
                      RFID Solutions (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
                      committed to protecting your privacy. This Privacy Policy explains
                      how we collect, use, disclose, and safeguard your information when
                      you visit our website and use our services.
                    </p>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="h-6 w-6 text-blue-600" />
                        Information We Collect
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Personal Information
                          </h3>
                          <p className="text-gray-600">
                            We collect information you provide directly to us, including:
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-gray-600">
                            <li>Name and contact information (email, phone, address)</li>
                            <li>Company name and job title</li>
                            <li>Account credentials</li>
                            <li>Payment information (processed securely by third parties)</li>
                            <li>Communications with us (messages, inquiries)</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Automatically Collected Information
                          </h3>
                          <p className="text-gray-600">
                            When you visit our website, we automatically collect:
                          </p>
                          <ul className="list-disc pl-6 space-y-1 text-gray-600">
                            <li>IP address and browser type</li>
                            <li>Device information and operating system</li>
                            <li>Pages visited and time spent on pages</li>
                            <li>Referring websites</li>
                            <li>Clickstream data</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Cookies and Similar Technologies
                          </h3>
                          <p className="text-gray-600">
                            We use cookies and similar tracking technologies to enhance your
                            browsing experience, analyze usage patterns, and personalize
                            content. You can manage your cookie preferences through your
                            browser settings.
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="h-6 w-6 text-blue-600" />
                        How We Use Your Information
                      </h2>
                      <p className="text-gray-600 mb-3">We use your information to:</p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-600">
                        <li>Process and fulfill your orders</li>
                        <li>Provide customer support and respond to inquiries</li>
                        <li>Send order confirmations and shipping notifications</li>
                        <li>Communicate promotional offers and updates (with your consent)</li>
                        <li>Improve our website, products, and services</li>
                        <li>Prevent fraud and ensure security</li>
                        <li>Comply with legal obligations</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Eye className="h-6 w-6 text-blue-600" />
                        Information Sharing
                      </h2>
                      <p className="text-gray-600 mb-3">We may share your information with:</p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-600">
                        <li>
                          <strong>Service Providers:</strong> Third-party partners who help us
                          operate our business (payment processors, shipping companies, etc.)
                        </li>
                        <li>
                          <strong>Business Transfers:</strong> In connection with mergers,
                          acquisitions, or asset sales
                        </li>
                        <li>
                          <strong>Legal Requirements:</strong> When required by law or to
                          protect our rights
                        </li>
                      </ul>
                      <p className="text-gray-600 mt-3">
                        We do not sell your personal information to third parties for their
                        marketing purposes.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Lock className="h-6 w-6 text-blue-600" />
                        Data Security
                      </h2>
                      <p className="text-gray-600">
                        We implement appropriate technical and organizational measures to
                        protect your information against unauthorized access, alteration,
                        disclosure, or destruction. These measures include:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-600 mt-3">
                        <li>SSL/TLS encryption for data transmission</li>
                        <li>Secure payment processing with PCI DSS compliance</li>
                        <li>Regular security audits and updates</li>
                        <li>Restricted access to personal data</li>
                        <li>Employee training on data protection</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Mail className="h-6 w-6 text-blue-600" />
                        Your Privacy Rights
                      </h2>
                      <p className="text-gray-600 mb-3">
                        Depending on your location, you may have the following rights:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-gray-600">
                        <li>Access to your personal information</li>
                        <li>Correction of inaccurate information</li>
                        <li>Deletion of your personal information</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Data portability</li>
                        <li>Restriction of processing</li>
                        <li>Object to processing</li>
                      </ul>
                      <p className="text-gray-600 mt-3">
                        To exercise these rights, please contact us at{' '}
                        <a href="mailto:privacy@atzrfid.com" className="text-blue-600 hover:underline">
                          privacy@atzrfid.com
                        </a>
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                        International Data Transfers
                      </h2>
                      <p className="text-gray-600">
                        Your information may be transferred to and processed in countries
                        other than your country of residence. We ensure appropriate safeguards
                        are in place to protect your information in accordance with this
                        Privacy Policy and applicable data protection laws.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Children&apos;s Privacy
                      </h2>
                      <p className="text-gray-600">
                        Our website and services are not intended for children under the age
                        of 16. We do not knowingly collect personal information from
                        children. If you are a parent or guardian and believe your child has
                        provided us with personal information, please contact us immediately.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Changes to This Policy
                      </h2>
                      <p className="text-gray-600">
                        We may update this Privacy Policy from time to time. We will notify
                        you of any material changes by posting the new policy on our website
                        and updating the &quot;Last updated&quot; date.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Contact Us
                      </h2>
                      <p className="text-gray-600">
                        If you have any questions about this Privacy Policy or our data
                        practices, please contact us at:
                      </p>
                      <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 font-medium">Email: privacy@atzrfid.com</p>
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
