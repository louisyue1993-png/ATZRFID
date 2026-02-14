import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Award, Target, Zap, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Us | ATZ RFID',
  description: 'Learn about ATZ RFID - your trusted partner for premium RFID products and solutions worldwide. ISO 9001 certified manufacturer.',
  keywords: ['RFID company', 'ATZ RFID', 'RFID supplier', 'RFID manufacturer', 'about us'],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Premium Dark Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-24">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyNGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMTIgMjRjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')]"></div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-6 bg-amber-500/20 text-amber-300 border-amber-500/30">
                About Us
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                About ATZ RFID
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                Your trusted global partner for premium RFID products and innovative
                identification solutions since 2010
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                  Our Story
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Building Trust Through Excellence
                </h2>
              </div>
              <div className="prose prose-lg max-w-none text-slate-600">
                <p className="text-lg mb-6 leading-relaxed">
                  ATZ RFID has grown from a small local supplier to become a leading global provider of RFID products and solutions. With years of experience in the industry, we have established ourselves as a trusted partner for businesses worldwide.
                </p>
                <p className="text-lg mb-6 leading-relaxed">
                  Our mission is to provide high-quality RFID products at competitive wholesale prices while maintaining exceptional customer service. Today, we serve customers in over 100 countries, offering a comprehensive range of RFID cards, tags, wristbands, and accessories.
                </p>
                <p className="text-lg leading-relaxed">
                  We are proud to be ISO 9001 certified, demonstrating our commitment to quality management and continuous improvement. Our state-of-the-art manufacturing facilities in Shenzhen, China, and rigorous quality control processes ensure that every product meets the highest standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
                <CardHeader>
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="text-lg text-slate-600 leading-relaxed">
                  To empower businesses worldwide with innovative RFID solutions that enhance efficiency, security, and connectivity. We strive to deliver exceptional products and services that exceed customer expectations while fostering long-term partnerships built on trust and reliability.
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
                <CardHeader>
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="text-lg text-slate-600 leading-relaxed">
                  To be the world's most trusted and innovative RFID manufacturer, recognized for excellence in product quality, customer service, and technological advancement. We aim to drive the future of identification technology and help businesses unlock new possibilities.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
                Core Values
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <ValueCard
                icon={<Shield className="h-8 w-8 text-blue-600" />}
                title="Quality First"
                description="We never compromise on quality. Every product undergoes rigorous testing to ensure it meets the highest standards."
              />
              <ValueCard
                icon={<Users className="h-8 w-8 text-blue-600" />}
                title="Customer Focus"
                description="Our customers are at the heart of everything we do. We listen, respond, and continuously improve based on their needs."
              />
              <ValueCard
                icon={<Award className="h-8 w-8 text-blue-600" />}
                title="Innovation"
                description="We embrace innovation and stay at the forefront of RFID technology to provide cutting-edge solutions."
              />
              <ValueCard
                icon={<Globe className="h-8 w-8 text-blue-600" />}
                title="Global Reach"
                description="With customers in over 100 countries, we understand diverse market needs and provide tailored solutions."
              />
              <ValueCard
                icon={<Zap className="h-8 w-8 text-blue-600" />}
                title="Efficiency"
                description="We optimize our processes to deliver products quickly and efficiently without compromising quality."
              />
              <ValueCard
                icon={<Shield className="h-8 w-8 text-blue-600" />}
                title="Integrity"
                description="We conduct business with honesty, transparency, and ethical practices in all our dealings."
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-white text-center">
              <StatItem number="14+" label="Years Experience" />
              <StatItem number="100+" label="Countries Served" />
              <StatItem number="5000+" label="Happy Customers" />
              <StatItem number="100M+" label="Products Delivered" />
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                Certifications
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Certifications & Standards
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We adhere to international quality and safety standards
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              <Badge className="text-lg py-3 px-6 bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 transition-all">ISO 9001:2015</Badge>
              <Badge className="text-lg py-3 px-6 bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 transition-all">ISO 14001:2015</Badge>
              <Badge className="text-lg py-3 px-6 bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 transition-all">CE Certified</Badge>
              <Badge className="text-lg py-3 px-6 bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 transition-all">RoHS Compliant</Badge>
              <Badge className="text-lg py-3 px-6 bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 transition-all">FCC Approved</Badge>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 transition-all duration-300 group">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="text-base text-slate-600">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold mb-2">{number}</div>
      <div className="text-lg opacity-90">{label}</div>
    </div>
  );
}
