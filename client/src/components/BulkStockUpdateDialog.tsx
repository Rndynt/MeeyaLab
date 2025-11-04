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
import { Download, Upload, FileSpreadsheet, CheckCircle2, XCircle, FileText, Eye, CheckCheck, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

  const steps = [
    { id: "upload", label: "Upload File", icon: FileText },
    { id: "preview", label: "Review Changes", icon: Eye },
    { id: "result", label: "Complete", icon: CheckCheck },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="flex flex-col max-w-5xl max-h-[90vh]" 
        data-testid="dialog-bulk-update"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-cyan-600" />
            Bulk Stock Update
          </DialogTitle>
          <DialogDescription>
            Update multiple product stock levels using CSV file import
          </DialogDescription>
          
          {/* Step Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={stepItem.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div 
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                          ${isCompleted ? 'bg-cyan-500 border-cyan-500 shadow-lg shadow-cyan-200' : ''}
                          ${isActive ? 'bg-cyan-50 border-cyan-500 shadow-md' : ''}
                          ${!isActive && !isCompleted ? 'bg-slate-100 border-slate-300' : ''}
                        `}
                        data-testid={`step-indicator-${stepItem.id}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        ) : (
                          <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                        )}
                      </div>
                      <span 
                        className={`
                          text-xs mt-2 font-medium transition-colors duration-200
                          ${isActive ? 'text-cyan-700' : ''}
                          ${isCompleted ? 'text-cyan-600' : ''}
                          ${!isActive && !isCompleted ? 'text-slate-500' : ''}
                        `}
                      >
                        {stepItem.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-0.5 mx-2 mb-6">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            index < currentStepIndex ? 'bg-cyan-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </DialogHeader>

        <DialogBody>
          {step === "upload" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 border-2 border-cyan-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-cyan-900 mb-3 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  How to use Bulk Update
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-cyan-800">
                  <li className="pl-2">Download the CSV template below</li>
                  <li className="pl-2">Fill in the new stock quantities in the template</li>
                  <li className="pl-2">Upload the completed CSV file</li>
                  <li className="pl-2">Review the changes and confirm</li>
                </ol>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center space-y-5 bg-slate-50/50 hover:bg-slate-50 hover:border-cyan-300 transition-all duration-300 group">
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full p-5 group-hover:from-cyan-100 group-hover:to-cyan-200 transition-all duration-300 shadow-md">
                    <Upload className="h-10 w-10 text-slate-500 group-hover:text-cyan-600 transition-colors duration-300" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-800">Upload CSV File</h3>
                  <p className="text-sm text-slate-600">
                    Drag and drop or select a CSV file to update product stock
                  </p>
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    data-testid="button-download-template"
                    className="transition-all duration-200 hover:bg-slate-100 hover:border-slate-400 shadow-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <Button 
                    className="bg-cyan-500 hover:bg-cyan-600 shadow-md hover:shadow-lg transition-all duration-200"
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

              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-slate-700">
                  <FileText className="h-4 w-4" />
                  CSV Format Example:
                </h4>
                <pre className="text-xs bg-white border border-slate-200 rounded-lg p-4 overflow-x-auto font-mono shadow-inner">
{`Product ID,Product Name,Current Stock,New Stock
1,Hydrating Serum,50,75
2,Daily Moisturizer,15,50
3,Gentle Cleanser,0,30`}
                </pre>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl p-5 shadow-sm">
                <div>
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-cyan-600" />
                    Review Changes
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
                      {validUpdates}
                    </span>
                    products will be updated
                    {errorUpdates > 0 && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span className="text-red-600 font-medium">{errorUpdates} errors found</span>
                      </>
                    )}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  data-testid="button-reset"
                  className="transition-all duration-200 hover:bg-slate-100 hover:border-slate-400 shadow-sm"
                >
                  <Upload className="h-3.5 w-3.5 mr-2" />
                  Upload Different File
                </Button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[50vh]">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700">Product Name</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">Current Stock</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">New Stock</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">Change</TableHead>
                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row) => (
                        <TableRow 
                          key={row.productId} 
                          data-testid={`row-preview-${row.productId}`}
                          className="hover:bg-slate-50/70 transition-colors duration-150 group"
                        >
                          <TableCell className="font-medium text-slate-900">{row.productName}</TableCell>
                          <TableCell className="text-right text-slate-600 font-medium tabular-nums">
                            {row.currentStock}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-slate-900 tabular-nums">
                            {row.newStock}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            <span
                              className={`
                                font-bold px-2.5 py-1 rounded-md
                                ${row.difference > 0 ? 'text-green-700 bg-green-100' : ''}
                                ${row.difference < 0 ? 'text-red-700 bg-red-100' : ''}
                                ${row.difference === 0 ? 'text-slate-600' : ''}
                              `}
                            >
                              {row.difference > 0 && "+"}
                              {row.difference}
                            </span>
                          </TableCell>
                          <TableCell>
                            {row.status === "error" ? (
                              <Badge variant="destructive" className="shadow-sm">
                                <XCircle className="h-3 w-3 mr-1.5" />
                                Error
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 border shadow-sm">
                                <CheckCircle2 className="h-3 w-3 mr-1.5" />
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
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-xl p-5 shadow-sm animate-in fade-in duration-200">
                  <h4 className="font-semibold text-red-900 text-sm mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    {errorUpdates} errors found
                  </h4>
                  <p className="text-sm text-red-800">
                    Please fix the errors in your CSV file before proceeding.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "result" && (
            <div className="space-y-6 text-center py-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full p-6 shadow-lg animate-in zoom-in duration-700">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Stock Updated Successfully!</h3>
                <p className="text-slate-600 text-lg">
                  {validUpdates} product{validUpdates !== 1 ? 's have' : ' has'} been updated with new stock levels.
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl p-6 max-w-lg mx-auto shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                    <p className="text-sm text-slate-600 mb-2 font-medium">Products Updated</p>
                    <p className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-7 w-7" />
                      {validUpdates}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-cyan-100">
                    <p className="text-sm text-slate-600 mb-2 font-medium">Total Changes</p>
                    <p className="text-3xl font-bold text-cyan-600 flex items-center justify-center gap-2">
                      <TrendingUp className="h-7 w-7" />
                      {previewData.reduce((sum, row) => sum + Math.abs(row.difference), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="border-t pt-4">
          {step === "upload" && (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
              className="transition-all duration-200 hover:bg-slate-100 hover:border-slate-400 shadow-sm"
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
                className="transition-all duration-200 hover:bg-slate-100 hover:border-slate-400 shadow-sm"
              >
                Back
              </Button>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmUpdate}
                disabled={errorUpdates > 0}
                data-testid="button-confirm-update"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Update ({validUpdates} products)
              </Button>
            </>
          )}
          {step === "result" && (
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => {
                handleReset();
                onOpenChange(false);
              }}
              data-testid="button-done"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
