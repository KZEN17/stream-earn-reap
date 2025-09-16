import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, Users, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  const lastUpdated = "December 2024";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-6">
          {/* Quick Summary */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• CLIP is a creator economy platform connecting streamers and clip creators</li>
                <li>• Users must be 18+ and provide accurate information</li>
                <li>• All content must comply with platform and community guidelines</li>
                <li>• Payouts require verified wallets and may be subject to tax reporting</li>
                <li>• We reserve rights to suspend accounts for violations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Main Terms */}
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                By accessing or using CLIP ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p>
                We reserve the right to update these Terms at any time. Continued use of the Service constitutes 
                acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. User Accounts & Eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Age Requirement:</strong> You must be at least 18 years old to use CLIP.</p>
              <p><strong>Account Security:</strong> You are responsible for maintaining the security of your account credentials.</p>
              <p><strong>Accurate Information:</strong> All information provided must be accurate and up-to-date.</p>
              <p><strong>Wallet Verification:</strong> Payout features require verified wallet ownership through digital signatures.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Platform Usage & Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Content Guidelines:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• No illegal, harmful, or offensive content</li>
                <li>• Respect intellectual property rights</li>
                <li>• No spam, misleading, or fraudulent content</li>
                <li>• Comply with all applicable social media platform terms</li>
              </ul>
              <p><strong>Content Ownership:</strong> You retain ownership of your content but grant CLIP necessary licenses to operate the platform.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Financial Terms & Payouts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Earning Structure:</strong> Earnings are calculated based on verified views and campaign parameters.</p>
              <p><strong>Payout Processing:</strong> Payouts are processed to verified wallets on supported blockchain networks.</p>
              <p><strong>Tax Responsibility:</strong> Users are responsible for all applicable taxes on earnings.</p>
              <p><strong>Fee Structure:</strong> Platform fees are clearly disclosed and may change with notice.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Platform Moderation & Enforcement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p><strong>Suspension & Termination:</strong></p>
                  <ul className="ml-4 space-y-1 mt-2">
                    <li>• We may suspend accounts for terms violations</li>
                    <li>• Repeat violations may result in permanent termination</li>
                    <li>• Appeals process available for disputed actions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                CLIP is provided "as is" without warranties. We are not liable for any indirect, 
                incidental, or consequential damages arising from platform use.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact & Disputes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Contact:</strong> support@clip.app</p>
              <p><strong>Disputes:</strong> All disputes will be resolved through binding arbitration.</p>
              <p><strong>Governing Law:</strong> These terms are governed by [Jurisdiction] law.</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Questions about these terms? Contact us at{' '}
            <a href="mailto:legal@clip.app" className="text-primary hover:underline">
              legal@clip.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;