import { useState } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  productRecommendations: boolean;
  newsletter: boolean;
}

export default function Notifications() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    promotions: true,
    productRecommendations: false,
    newsletter: true,
  });

  const { toast } = useToast();

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  return (
    <ProfileLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2" data-testid="text-page-title">
            Notification Preferences
          </h1>
          <p className="text-slate-600">
            Manage how you receive updates from us
          </p>
        </div>

        <Card className="border border-slate-200/60 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="h-4 w-4 text-slate-700" />
                    <Label htmlFor="order-updates" className="text-base font-semibold text-slate-900 cursor-pointer">
                      Order Updates
                    </Label>
                  </div>
                  <CardDescription className="text-sm">
                    Get notified about order confirmations, shipping updates, and delivery status
                  </CardDescription>
                </div>
                <Switch
                  id="order-updates"
                  checked={preferences.orderUpdates}
                  onCheckedChange={() => handleToggle("orderUpdates")}
                  data-testid="switch-order-updates"
                />
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="promotions" className="text-base font-semibold text-slate-900 cursor-pointer">
                      Promotions & Discounts
                    </Label>
                    <CardDescription className="text-sm mt-1">
                      Receive exclusive offers, sales announcements, and special discount codes
                    </CardDescription>
                  </div>
                  <Switch
                    id="promotions"
                    checked={preferences.promotions}
                    onCheckedChange={() => handleToggle("promotions")}
                    data-testid="switch-promotions"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="recommendations" className="text-base font-semibold text-slate-900 cursor-pointer">
                      Product Recommendations
                    </Label>
                    <CardDescription className="text-sm mt-1">
                      Get personalized product suggestions based on your preferences and purchase history
                    </CardDescription>
                  </div>
                  <Switch
                    id="recommendations"
                    checked={preferences.productRecommendations}
                    onCheckedChange={() => handleToggle("productRecommendations")}
                    data-testid="switch-recommendations"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Label htmlFor="newsletter" className="text-base font-semibold text-slate-900 cursor-pointer">
                      Newsletter
                    </Label>
                    <CardDescription className="text-sm mt-1">
                      Stay updated with skincare tips, product launches, and brand news
                    </CardDescription>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={preferences.newsletter}
                    onCheckedChange={() => handleToggle("newsletter")}
                    data-testid="switch-newsletter"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 mt-6 pt-6">
              <Button
                onClick={handleSave}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                data-testid="button-save-preferences"
              >
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProfileLayout>
  );
}
