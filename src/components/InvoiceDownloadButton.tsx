import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { transferService } from "@/lib/api/transferService";

interface InvoiceDownloadButtonProps {
  transferId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function InvoiceDownloadButton({
  transferId,
  variant = "outline",
  size = "sm",
  className = "",
}: InvoiceDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click handlers

    try {
      setIsDownloading(true);

      // Download PDF blob from backend
      const blob = await transferService.downloadInvoice(transferId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TrustBridge-Invoice-${transferId}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
      className={className}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Invoice
        </>
      )}
    </Button>
  );
}
