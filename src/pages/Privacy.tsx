import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Database, Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const Privacy = () => {
  const [loading, setLoading] = useState(false);
  const lastUpdated = "December 2024";

  const handleDataExport = async () => {
    setLoading(true);
    try {
      // Simulate data export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Data export initiated. You'll receive an email with your data within 24 hours.");
    } catch (error) {
      toast.error("Failed to initiate data export. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    setLoading(true);
    try {
      // Simulate data deletion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Data deletion request submitted. Processing may take up to 30 days.");
    } catch (error) {
      toast.error("Failed to submit deletion request. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

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
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-6">
          {/* GDPR/CCPA Controls */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-primary" />
                Your Data Rights (GDPR/CCPA)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm mb-4">
                You have the right to access, export, or delete your personal data at any time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleDataExport}
                  disabled={loading}
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDataDeletion}
                  disabled={loading}
                  className="flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete My Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Information:</h4>
                <ul className="ml-4 space-y-1 text-sm">
                  <li>• Email address and authentication credentials</li>
                  <li>• Profile information (username, bio, avatar)</li>
                  <li>• Social media account connections</li>
                  <li>• Wallet addresses (public only, never private keys)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage Data:</h4>
                <ul className="ml-4 space-y-1 text-sm">
                  <li>• Platform interactions and engagement metrics</li>
                  <li>• Content submissions and campaign participation</li>
                  <li>• Transaction history and payout records</li>
                  <li>• Device information and IP addresses</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li>• <strong>Platform Operation:</strong> Facilitate campaigns, payouts, and user interactions</li>
                <li>• <strong>Safety & Security:</strong> Detect fraud, prevent abuse, ensure platform integrity</li>
                <li>• <strong>Communication:</strong> Send notifications, updates, and support messages</li>
                <li>• <strong>Analytics:</strong> Improve platform performance and user experience</li>
                <li>• <strong>Legal Compliance:</strong> Meet regulatory requirements and tax reporting</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>3. Data Sharing & Third Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>We do NOT sell your personal data.</strong></p>
              <div>
                <h4 className="font-semibold mb-2">Limited sharing occurs for:</h4>
                <ul className="ml-4 space-y-1 text-sm">
                  <li>• <strong>Service Providers:</strong> Payment processing, email delivery, analytics</li>
                  <li>• <strong>Legal Requirements:</strong> Court orders, regulatory compliance</li>
                  <li>• <strong>Business Transfers:</strong> In case of merger or acquisition</li>
                  <li>• <strong>Public Information:</strong> Content you choose to make public</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <Database className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p><strong>Security Measures:</strong></p>
                  <ul className="ml-4 space-y-1 mt-2 text-sm">
                    <li>• End-to-end encryption for sensitive data</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Access controls and employee training</li>
                    <li>• Incident response and breach notification procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>5. Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">GDPR Rights (EU):</h4>
                  <ul className="ml-4 space-y-1 text-sm">
                    <li>• Right to access your data</li>
                    <li>• Right to rectification</li>
                    <li>• Right to erasure ("right to be forgotten")</li>
                    <li>• Right to data portability</li>
                    <li>• Right to object to processing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">CCPA Rights (California):</h4>
                  <ul className="ml-4 space-y-1 text-sm">
                    <li>• Right to know what data is collected</li>
                    <li>• Right to delete personal information</li>
                    <li>• Right to opt-out of sale (we don't sell)</li>
                    <li>• Right to non-discrimination</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies & Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>6. Cookies & Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We use cookies and similar technologies for:</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• <strong>Essential:</strong> Authentication, security, basic functionality</li>
                <li>• <strong>Analytics:</strong> Usage statistics and performance monitoring</li>
                <li>• <strong>Preferences:</strong> Remember your settings and choices</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                You can control cookie preferences through your browser settings.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>7. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                For privacy questions or to exercise your rights, contact our Data Protection Officer:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Email: privacy@clip.app</li>
                <li>• Address: [Company Address]</li>
                <li>• Response time: Within 30 days</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Questions about privacy? Contact us at{' '}
            <a href="mailto:privacy@clip.app" className="text-primary hover:underline">
              privacy@clip.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;