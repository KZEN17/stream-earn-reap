import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Clock, Activity } from 'lucide-react';

interface QAStatusBadgeProps {
  status: 'idle' | 'testing' | 'passed' | 'failed' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
}

export const QAStatusBadge: React.FC<QAStatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true, 
  showText = true 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'passed':
        return {
          icon: CheckCircle,
          text: 'Passed',
          className: 'bg-green-500 hover:bg-green-600',
          iconColor: 'text-white'
        };
      case 'failed':
        return {
          icon: XCircle,
          text: 'Failed',
          className: 'bg-red-500 hover:bg-red-600',
          iconColor: 'text-white'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          text: 'Warning',
          className: 'bg-yellow-500 hover:bg-yellow-600',
          iconColor: 'text-white'
        };
      case 'testing':
        return {
          icon: Activity,
          text: 'Testing',
          className: 'bg-blue-500 hover:bg-blue-600 animate-pulse',
          iconColor: 'text-white'
        };
      default:
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-gray-500 hover:bg-gray-600',
          iconColor: 'text-white'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <Badge className={config.className}>
      <div className="flex items-center gap-1">
        {showIcon && <Icon className={`${iconSize} ${config.iconColor}`} />}
        {showText && <span>{config.text}</span>}
      </div>
    </Badge>
  );
};