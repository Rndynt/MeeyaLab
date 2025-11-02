import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail, MapPin } from "lucide-react";

export default function ContactSection() {
  const whatsappNumber = "6281234567890";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="section-contact">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Chat with us for quick support
                </p>
                <Button
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
                  onClick={() => window.open(whatsappLink, "_blank")}
                  data-testid="button-whatsapp"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <Mail className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-slate-600 mb-2">hello@skinlite.co</p>
                <p className="text-sm text-slate-600">
                  We'll respond within 24 hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <MapPin className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Address</h3>
              <p className="text-sm text-slate-600">
                Jl. Sudirman No. 123<br />
                Jakarta Selatan 12190<br />
                Indonesia
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8 bg-slate-50 border-slate-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Business Hours</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Monday - Friday</span>
              <span className="font-medium">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span className="font-medium">10:00 AM - 4:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span className="font-medium">Closed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
