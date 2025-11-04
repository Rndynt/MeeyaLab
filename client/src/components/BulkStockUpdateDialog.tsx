import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Upload, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BulkUpdateRow {
  productId: string;
  productName: string;
  currentStock: number;
  newStock: number;
  difference: number;
  status: "pending" | "success" | "error";
  error?: string;
}

interface BulkStockUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (updates: BulkUpdateRow[]) => void;
}

const mockPreviewData: BulkUpdateRow[] = [
  {
    productId: "1",
    productName: "Hydrating Serum",
    currentStock: 50,
    newStock: 75,
    difference: 25,
    status: "pending",
  },
  {
    productId: "2",
    productName: "Daily Moisturizer",
    currentStock: 15,
    newStock: 50,
    difference: 35,
    status: "pending",
  },
  {
    productId: "3",
    productName: "Gentle Cleanser",
    currentStock: 0,
    newStock: 30,
    difference: 30,
    status: "pending",
  },
  {
    productId: "4",
    productName: "Night Cream",
    currentStock: 75,
    newStock: 60,
    difference: -15,
    status: "pending",
  },
];

export default function BulkStockUpdateDialog({
  open,
  onOpenChange,
  onSubmit,
}: BulkStockUpdateDialogProps) {
  const [step, setStep] = useState<"upload" | "preview" | "result">("upload");
  const [previewData, setPreviewData] = useState<BulkUpdateRow[]>([]);
  const [csvData, setCsvData] = useState("");

  const handleDownloadTemplate = () => {
    const csvContent = [
      ["Product ID", "Product Name", "Current Stock", "New Stock"],
      ["1", "Hydrating Serum", "50", "75"],
      ["2", "Daily Moisturizer", "15", "50"],
      ["3", "Gentle Cleanser", "0", "30"],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk-stock-update-template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvData(content);
        setPreviewData(mockPreviewData);
        setStep("preview");
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmUpdate = () => {
    console.log("Updating stock for", previewData.length, "products");
    onSubmit?.(previewData);
    setStep("result");
  };

  const handleReset = () => {
    setStep("upload");
    setPreviewData([]);
    setCsvData("");
  };

  const validUpdates = previewData.filter((row) => row.status !== "error").length;
  const errorUpdates = previewData.filter((row) => row.status === "error").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="flex flex-col max-w-5xl max-h-[90vh]" 
        data-testid="dialog-bulk-update"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Bulk Stock Update
          </DialogTitle>
          <DialogDescription>
            Update multiple product stock levels using CSV file import
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {step === "upload" && (
            <div className="space-y-6">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <h3 className="font-semibold text-cyan-900 mb-2">How to use Bulk Update</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-cyan-800">
                  <li>Download the CSV template below</li>
                  <li>Fill in the new stock quantities in the template</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review the changes and confirm</li>
                </ol>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-slate-100 rounded-full p-4">
                    <Upload className="h-8 w-8 text-slate-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Upload CSV File</h3>
                  <p className="text-sm text-slate-600">
                    Select a CSV file to update product stock
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    data-testid="button-download-template"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <Button 
                    className="bg-cyan-500 hover:bg-cyan-600"
                    onClick={() => document.getElementById('csv-upload')?.click()}
                    data-testid="button-upload-csv"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </Button>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                    data-testid="input-file-upload"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">CSV Format Example:</h4>
                <pre className="text-xs bg-white border border-slate-200 rounded p-3 overflow-x-auto">
{`Product ID,Product Name,Current Stock,New Stock
1,Hydrating Serum,50,75
2,Daily Moisturizer,15,50
3,Gentle Cleanser,0,30`}
                </pre>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div>
                  <h3 className="font-semibold">Review Changes</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {validUpdates} products will be updated
                    {errorUpdates > 0 && ` • ${errorUpdates} errors found`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  data-testid="button-reset"
                >
                  Upload Different File
                </Button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[50vh]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead className="text-right">Current Stock</TableHead>
                        <TableHead className="text-right">New Stock</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row) => (
                        <TableRow key={row.productId} data-testid={`row-preview-${row.productId}`}>
                          <TableCell className="font-medium">{row.productName}</TableCell>
                          <TableCell className="text-right text-slate-600">
                            {row.currentStock}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {row.newStock}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                row.difference > 0
                                  ? "text-green-600 font-medium"
                                  : row.difference < 0
                                  ? "text-red-600 font-medium"
                                  : "text-slate-600"
                              }
                            >
                              {row.difference > 0 && "+"}
                              {row.difference}
                            </span>
                          </TableCell>
                          <TableCell>
                            {row.status === "error" ? (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Error
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Ready
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {errorUpdates > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 text-sm mb-2">
                    ⚠️ {errorUpdates} errors found
                  </h4>
                  <p className="text-sm text-red-800">
                    Please fix the errors in your CSV file before proceeding.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "result" && (
            <div className="space-y-4 text-center py-8">
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Stock Updated Successfully!</h3>
                <p className="text-slate-600">
                  {validUpdates} products have been updated with new stock levels.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Products Updated</p>
                    <p className="text-2xl font-bold text-green-600">{validUpdates}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Total Changes</p>
                    <p className="text-2xl font-bold text-cyan-600">
                      {previewData.reduce((sum, row) => sum + Math.abs(row.difference), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          {step === "upload" && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          )}
          {step === "preview" && (
            <>
              <Button
                variant="outline"
                onClick={handleReset}
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600"
                onClick={handleConfirmUpdate}
                disabled={errorUpdates > 0}
                data-testid="button-confirm-update"
              >
                Confirm Update ({validUpdates} products)
              </Button>
            </>
          )}
          {step === "result" && (
            <Button
              className="bg-cyan-500 hover:bg-cyan-600"
              onClick={() => {
                handleReset();
                onOpenChange(false);
              }}
              data-testid="button-done"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
