import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CTA_AUDIT_REGISTRY, 
  TRANSACTION_RISK_MATRIX, 
  PAYMENT_SOURCE_LOGIC,
  getCTAsByRiskLevel,
  getTransactionRisksByMovement,
  getPaymentSource,
  type CTAElement,
  type TransactionRiskPoint,
  type PaymentSourceLogic
} from '@/lib/qa-audit';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Link as LinkIcon,
  MousePointer,
  Shield,
  DollarSign,
  CreditCard,
  Wallet,
  Activity
} from 'lucide-react';

interface CTATestResult {
  id: string;
  status: 'pass' | 'fail' | 'warning' | 'untested';
  tests: {
    visibleState: boolean;
    hoverState: boolean;
    disabledState: boolean;
    onClickBound: boolean;
    loadingGuard: boolean;
    networkFailureHandled: boolean;
    analyticsEvent: boolean;
  };
}

export const CTAAuditDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<CTATestResult[]>([]);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');

  const getRiskBadgeColor = (risk: CTAElement['riskLevel']) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: CTATestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredCTAs = selectedRiskLevel === 'all' 
    ? CTA_AUDIT_REGISTRY 
    : getCTAsByRiskLevel(selectedRiskLevel);

  const simulateTest = (ctaId: string) => {
    // Simulate testing a CTA - in real implementation this would run actual tests
    const mockResult: CTATestResult = {
      id: ctaId,
      status: Math.random() > 0.3 ? 'pass' : 'fail',
      tests: {
        visibleState: Math.random() > 0.1,
        hoverState: Math.random() > 0.1,
        disabledState: Math.random() > 0.2,
        onClickBound: Math.random() > 0.1,
        loadingGuard: Math.random() > 0.3,
        networkFailureHandled: Math.random() > 0.4,
        analyticsEvent: Math.random() > 0.2
      }
    };

    setTestResults(prev => [
      ...prev.filter(r => r.id !== ctaId),
      mockResult
    ]);
  };

  const getTestResult = (ctaId: string) => {
    return testResults.find(r => r.id === ctaId);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">QA Audit Dashboard</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {CTA_AUDIT_REGISTRY.length} CTAs • {TRANSACTION_RISK_MATRIX.length} Risk Points
        </Badge>
      </div>

      <Tabs defaultValue="cta-sweep" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cta-sweep">1. CTA Sweep</TabsTrigger>
          <TabsTrigger value="risk-matrix">2. Risk Matrix</TabsTrigger>
          <TabsTrigger value="payment-logic">3. Payment Logic</TabsTrigger>
        </TabsList>

        <TabsContent value="cta-sweep" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="w-5 h-5" />
                Link/CTA Sweep
              </CardTitle>
              <div className="flex gap-2">
                {(['all', 'low', 'medium', 'high', 'critical'] as const).map(level => (
                  <Button
                    key={level}
                    variant={selectedRiskLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRiskLevel(level)}
                    className="capitalize"
                  >
                    {level} {level !== 'all' && `(${getCTAsByRiskLevel(level).length})`}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {filteredCTAs.map((cta) => {
                  const testResult = getTestResult(cta.id);
                  return (
                    <Card key={cta.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getRiskBadgeColor(cta.riskLevel)}>
                                {cta.riskLevel}
                              </Badge>
                              <span className="font-medium">{cta.text}</span>
                              {testResult && getStatusIcon(testResult.status)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <div>{cta.component} • {cta.file}</div>
                              {cta.route && <div>Route: {cta.route}</div>}
                              {cta.action && <div>Action: {cta.action}</div>}
                            </div>
                            
                            {testResult && (
                              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                                <div className={`flex items-center gap-1 ${testResult.tests.visibleState ? 'text-green-600' : 'text-red-600'}`}>
                                  {testResult.tests.visibleState ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  Visible State
                                </div>
                                <div className={`flex items-center gap-1 ${testResult.tests.hoverState ? 'text-green-600' : 'text-red-600'}`}>
                                  {testResult.tests.hoverState ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  Hover State
                                </div>
                                <div className={`flex items-center gap-1 ${testResult.tests.disabledState ? 'text-green-600' : 'text-red-600'}`}>
                                  {testResult.tests.disabledState ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  Disabled State
                                </div>
                                <div className={`flex items-center gap-1 ${testResult.tests.onClickBound ? 'text-green-600' : 'text-red-600'}`}>
                                  {testResult.tests.onClickBound ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  onClick Bound
                                </div>
                                <div className={`flex items-center gap-1 ${testResult.tests.loadingGuard ? 'text-green-600' : 'text-red-600'}`}>
                                  {testResult.tests.loadingGuard ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  Loading Guard
                                </div>
                                <div className={`flex items-center gap-1 ${testResult.tests.networkFailureHandled ? 'text-green-600' : 'text-red-600'}`}>
                                  {testResult.tests.networkFailureHandled ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  Network Handling
                                </div>
                                <div className={`flex items-center gap-1 ${testResult.tests.analyticsEvent ? 'text-green-600' : 'text-red-600'}`}>
                                  {testResult.tests.analyticsEvent ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  Analytics Event
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => simulateTest(cta.id)}
                            disabled={!!testResult}
                          >
                            {testResult ? 'Tested' : 'Test CTA'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Transaction Risk Points Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(['user_wallet', 'campaign_budget', 'card_topup'] as const).map(movement => (
                  <div key={movement} className="space-y-3">
                    <div className="flex items-center gap-2">
                      {movement === 'user_wallet' && <Wallet className="w-5 h-5" />}
                      {movement === 'campaign_budget' && <DollarSign className="w-5 h-5" />}
                      {movement === 'card_topup' && <CreditCard className="w-5 h-5" />}
                      <h3 className="text-lg font-semibold capitalize">
                        {movement.replace('_', ' ')} ({getTransactionRisksByMovement(movement).length})
                      </h3>
                    </div>
                    
                    <div className="grid gap-3">
                      {getTransactionRisksByMovement(movement).map((risk) => (
                        <Card key={risk.id} className="bg-muted/20">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="font-medium">{risk.element} → {risk.action}</div>
                                <div className="text-sm text-muted-foreground">
                                  Method: {risk.method} | Chain: {risk.chain} | Env: {risk.environment}
                                </div>
                                {risk.contract && (
                                  <div className="text-xs text-muted-foreground">
                                    Contract: {risk.contract}
                                  </div>
                                )}
                                {risk.spender && (
                                  <div className="text-xs text-muted-foreground">
                                    Spender: {risk.spender}
                                  </div>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {risk.valueMovement}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-logic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Payment Source Logic ("Logic X")
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PAYMENT_SOURCE_LOGIC.map((logic) => (
                  <Card key={logic.action} className="relative">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold capitalize">{logic.action}</h3>
                          <Badge className={logic.source === 'user_wallet' ? 'bg-blue-500' : 'bg-green-500'}>
                            {logic.source.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Guardrails:</h4>
                            <div className="flex flex-wrap gap-1">
                              {logic.guardrails.map((guardrail, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {guardrail.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Test Cases:</h4>
                            <div className="flex flex-wrap gap-1">
                              {logic.testCases.map((testCase, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {testCase.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Implementation Status:</strong> Payment logic framework is defined but wallet connectivity and transaction features need to be implemented. 
              This framework provides the structure for when those features are added.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};