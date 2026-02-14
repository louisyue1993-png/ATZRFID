'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Send, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface ProductCTAProps {
  productName: string;
  productSku: string;
  className?: string;
}

export default function ProductCTA({
  productName,
  productSku,
  className = '',
}: ProductCTAProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create email content
    const subject = encodeURIComponent(`Inquiry about ${productName}`);
    const body = encodeURIComponent(
      `Product: ${productName}\nSKU: ${productSku}\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCompany: ${formData.company}\nQuantity: ${formData.quantity}\n\nMessage:\n${formData.message}`
    );

    // Open email client
    window.location.href = `mailto:info@atzrfid.com?subject=${subject}&body=${body}`;

    // Close dialog
    setIsDialogOpen(false);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in ${productName} (SKU: ${productSku}). Could you provide more information?`
    );
    window.open(`https://wa.me/8617688964979?text=${message}`, '_blank');
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Quick Contact Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleWhatsApp}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium">
              <Mail className="h-4 w-4 mr-2" />
              Send Inquiry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Request a Quote</DialogTitle>
              <DialogDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="1000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please tell us about your requirements..."
                  rows={3}
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p className="font-medium">Product:</p>
                <p className="text-gray-600">{productName}</p>
                <p className="text-gray-500">SKU: {productSku}</p>
              </div>
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Inquiry
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Additional Info */}
      <div className="text-xs text-gray-600 space-y-1">
        <p>📧 We respond within 24 hours</p>
        <p>💬 WhatsApp: +86 176 8896 4979</p>
        <p>📞 Phone: +86 176 8896 4979</p>
      </div>
    </div>
  );
}
