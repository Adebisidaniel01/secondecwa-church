import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DonationWidgetProps {
  variant?: 'compact' | 'full';
}

const DonationWidget = ({ variant = 'full' }: DonationWidgetProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    donationType: 'tithe',
    paymentMethod: 'online',
    isAnonymous: false,
    isRecurring: false,
    recurringFrequency: '',
    dedication: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, just record the donation intent
      // In a real implementation, this would integrate with a payment processor
      const donationData = {
        ...formData,
        amount: parseFloat(formData.amount),
        status: 'pending'
      };

      const { error } = await supabase
        .from('donations')
        .insert(donationData);

      if (error) throw error;

      toast({
        title: "Thank you for your donation!",
        description: "Your generosity helps us serve our community.",
      });

      setFormData({
        amount: '',
        donorName: '',
        donorEmail: '',
        donationType: 'tithe',
        paymentMethod: 'online',
        isAnonymous: false,
        isRecurring: false,
        recurringFrequency: '',
        dedication: ''
      });
    } catch (error: any) {
      console.error('Error processing donation:', error);
      toast({
        title: "Donation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = ['25', '50', '100', '250', '500'];

  if (variant === 'compact') {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center pb-4">
          <div className="p-3 rounded-full blessing-gradient w-fit mx-auto mb-2">
            <Heart className="h-6 w-6 text-blessing-foreground" />
          </div>
          <CardTitle className="text-lg">Give Online</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.slice(0, 3).map(amount => (
              <Button 
                key={amount}
                variant="outline" 
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, amount }))}
                className="text-xs"
              >
                ${amount}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Other amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>
          <Button 
            onClick={handleSubmit}
            className="w-full blessing-gradient text-blessing-foreground hover:opacity-90"
            disabled={isSubmitting || !formData.amount}
          >
            <Heart className="h-4 w-4 mr-2" />
            Give Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="p-3 rounded-full blessing-gradient w-fit mx-auto mb-2">
          <Heart className="h-8 w-8 text-blessing-foreground" />
        </div>
        <CardTitle className="text-2xl">Support Our Ministry</CardTitle>
        <CardDescription>
          Your generosity helps us serve our community and spread God's love.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Donation Amount</Label>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map(amount => (
                <Button 
                  key={amount}
                  type="button"
                  variant={formData.amount === amount ? "default" : "outline"}
                  onClick={() => setFormData(prev => ({ ...prev, amount }))}
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Other amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="pl-10"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Donation Type */}
          <div className="space-y-2">
            <Label htmlFor="donationType">Donation Type</Label>
            <Select 
              value={formData.donationType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, donationType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select donation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tithe">Tithe</SelectItem>
                <SelectItem value="offering">General Offering</SelectItem>
                <SelectItem value="mission">Mission Support</SelectItem>
                <SelectItem value="building">Building Fund</SelectItem>
                <SelectItem value="special">Special Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recurring Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isRecurring">Make this a recurring donation</Label>
            </div>
            
            {formData.isRecurring && (
              <Select 
                value={formData.recurringFrequency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, recurringFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Donor Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isAnonymous">Make this donation anonymous</Label>
            </div>

            {!formData.isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="donorName">Full Name</Label>
                  <Input
                    id="donorName"
                    value={formData.donorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donorEmail">Email Address</Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    value={formData.donorEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorEmail: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dedication */}
          <div className="space-y-2">
            <Label htmlFor="dedication">Dedication (Optional)</Label>
            <Textarea
              id="dedication"
              value={formData.dedication}
              onChange={(e) => setFormData(prev => ({ ...prev, dedication: e.target.value }))}
              placeholder="In honor of... or In memory of..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="w-full blessing-gradient text-blessing-foreground hover:opacity-90"
            disabled={isSubmitting}
          >
            <Heart className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Processing...' : `Donate $${formData.amount || '0'}`}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Your donation is secure and helps support our ministry and community outreach programs.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationWidget;