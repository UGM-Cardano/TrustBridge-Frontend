import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";

interface DemoModeIndicatorProps {
  isDemo?: boolean;
  className?: string;
}

export function DemoModeIndicator({ isDemo = false, className = "" }: DemoModeIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Show indicator after a brief delay to avoid flash
    const timer = setTimeout(() => setShowIndicator(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!showIndicator) return null;

  if (isDemo) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 border flex items-center space-x-2 px-3 py-1">
          <WifiOff className="w-3 h-3" />
          <span className="text-xs font-medium">Demo Mode</span>
        </Badge>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge className="bg-green-500/20 text-green-300 border-green-400/30 border flex items-center space-x-2 px-3 py-1">
        <Wifi className="w-3 h-3" />
        <span className="text-xs font-medium">Live Data</span>
      </Badge>
    </div>
  );
}

interface DemoModeBannerProps {
  isDemo?: boolean;
  onDismiss?: () => void;
}

export function DemoModeBanner({ isDemo = false, onDismiss }: DemoModeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!isDemo || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-amber-300 font-medium text-sm mb-1">Demo Mode Active</h4>
          <p className="text-amber-200/80 text-sm">
            Unable to connect to backend services. Displaying demo data for preview purposes.
            Some features may not work as expected.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-400 hover:text-amber-300 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}