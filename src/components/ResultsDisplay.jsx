import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  FileSpreadsheet,
  Calculator,
  Euro,
  TrendingUp,
  DollarSign,
  PoundSterling,
} from "lucide-react";
import toast from "react-hot-toast";

const ResultsDisplay = ({
  results,
  onBackToCalculator,
  exchangeRates = {},
}) => {
  if (!results) {
    return (
      <Card className="shadow-sm border border-slate-200 text-center py-12">
        <CardContent>
          <TrendingUp className="h-16 w-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-slate-700">
            Henüz Hesaplama Yapılmadı
          </h3>
          <p className="text-slate-500 mb-4">
            Maliyet hesaplamak için hesaplama sekmesine gidin
          </p>
          <Button
            onClick={onBackToCalculator}
            className="transition-all border border-black duration-200 hover:scale-105"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Hesaplamaya Başla
          </Button>
        </CardContent>
      </Card>
    );
  }

  const exportResults = () => {
    const csvContent = `
Company,${results.company?.name || results.company || "Bilinmeyen Firma"}
Package Type,${results.packageType}
Date,${results.date || new Date(results.createdAt).toLocaleDateString("tr-TR")}
EUR Rate,${results.eurRate?.toFixed(2) || "0.00"}
USD Rate,${exchangeRates.usdRate || "0.00"}
GBP Rate,${exchangeRates.gbpRate || "0.00"}

Cost Breakdown (EUR):
Fabric Unit Price,${(results.fabricUnitPrice || 0).toFixed(2)}
Labor Cost (TL),${(results.laborCost || 0).toFixed(2)}
Labor Cost (EUR),${(results.laborCostInEUR || 0).toFixed(2)}
Material Cost,${(results.materialCost || 0).toFixed(2)}
Overhead Cost,${(results.overheadCost || 0).toFixed(2)}
Profit Margin,${(results.profitMargin || 0).toFixed(2)}
Subtotal,${(results.subtotal || 0).toFixed(2)}
Commission,${(results.commission || 0).toFixed(2)}
Tax (VAT),${(results.tax || 0).toFixed(2)}

Total EUR,${(results.totalPrice || 0).toFixed(2)}
Total TRY,${
      results.totalPrice
        ? (results.totalPrice * results.eurRate).toFixed(2)
        : "0.00"
    }
Total USD,${
      results.totalPrice
        ? (
            results.totalPrice *
            (results.eurRate / exchangeRates.usdRate)
          ).toFixed(2)
        : "0.00"
    }
Total GBP,${
      results.totalPrice
        ? (
            results.totalPrice *
            (results.eurRate / exchangeRates.gbpRate)
          ).toFixed(2)
        : "0.00"
    }
    `.trim();

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `denim-calculation-${(
      results.date || new Date(results.createdAt).toLocaleDateString("tr-TR")
    ).replace(/\//g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Sonuçlar başarıyla export edildi");
  };

  const costItems = [
    { label: "Kumaş Birim Fiyatı", value: results.fabricUnitPrice || 0 },
    { label: "Kesim İşlemi", value: results.cutProcess || 0 },
    { label: "Dikiş İşlemi", value: results.sationProcess || 0 },
    { label: "Yıkama İşlemi", value: results.washProcess || 0 },
    { label: "Baskı İşlemi", value: results.printProcess || 0 },
    { label: "Giydirme İşlemi", value: results.wearProcess || 0 },
    { label: "Aksesuar İşlemi", value: results.accessoryProcess || 0 },
    { label: "Düğme İşlemi", value: results.buttonProcess || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="gap-6">
          <div className="grid grid-cols-2 mb-4 gap-4">
            <Card className="shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md flex-1">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="sm:text-3xl md:text-2xl font-bold text-slate-900">
                    €{results.totalPrice?.toFixed(2) || "0.00"}
                  </div>
                </div>
                <div className="text-sm text-slate-600">Toplam (EUR)</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4 text-center">
                <div className="sm:text-3xl md:text-2xl font-bold text-slate-900">
                  ₺
                  {results.totalPrice
                    ? (results.totalPrice * results.eurRate).toFixed(2)
                    : "0.00"}
                </div>
                <div className="text-sm text-slate-600">Toplam (TRY)</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Hesap Detayları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Firma:</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {results.company?.name ||
                      results.company ||
                      "Bilinmeyen Firma"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Paket Tipi:</span>
                  <Badge variant="outline" className="border-slate-300">
                    {results.packageType === "PACKAGE_050"
                      ? "0-50 Adet"
                      : results.packageType === "PACKAGE_51100"
                      ? "51-100 Adet"
                      : results.packageType === "PACKAGE_101200"
                      ? "101-200 Adet"
                      : results.packageType}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Paket Aralığı:</span>
                  <span className="font-semibold text-slate-900">
                    {results.packageType === "PACKAGE_050"
                      ? "0-50"
                      : results.packageType === "PACKAGE_51100"
                      ? "51-100"
                      : results.packageType === "PACKAGE_101200"
                      ? "101-200"
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Tarih:</span>
                  <span className="text-slate-700">
                    {results.date ||
                      new Date(results.createdAt).toLocaleDateString(
                        "tr-TR"
                      )}{" "}
                    -{" "}
                    {results.time ||
                      new Date(results.createdAt).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">EUR Kuru:</span>
                  <span className="font-semibold text-slate-900">
                    ₺{results.eurRate?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Maliyet Dağılımı
              </span>
              <Button
                onClick={exportResults}
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:scale-105"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold min-w-[120px]">
                      Maliyet Kalemi
                    </TableHead>
                    <TableHead className="text-right font-semibold min-w-[100px]">
                      Toplam (EUR)
                    </TableHead>
                    <TableHead className="text-right font-semibold min-w-[100px]">
                      Toplam (TRY)
                    </TableHead>
                    <TableHead className="text-right font-semibold min-w-[100px]">
                      Toplam (USD)
                    </TableHead>
                    <TableHead className="text-right font-semibold min-w-[100px]">
                      Toplam (GBP)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costItems.map((item) => {
                    // Tüm değerler EUR cinsinden
                    const eurValue = item.value;
                    const tryValue = item.value * results.eurRate;

                    return (
                      <TableRow
                        key={item.label}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <TableCell className="font-medium min-w-[120px]">
                          {item.label}
                        </TableCell>
                        <TableCell className="text-right min-w-[100px]">
                          €{eurValue.toFixed(4)}
                        </TableCell>
                        <TableCell className="text-right min-w-[100px]">
                          ₺{tryValue.toFixed(4)}
                        </TableCell>
                        <TableCell className="text-right min-w-[100px]">
                          $
                          {(
                            eurValue *
                            (results.eurRate / exchangeRates.usdRate)
                          ).toFixed(4)}
                        </TableCell>
                        <TableCell className="text-right min-w-[100px]">
                          £
                          {(
                            eurValue *
                            (results.eurRate / exchangeRates.gbpRate)
                          ).toFixed(4)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="border-t-2 font-semibold bg-slate-50">
                    <TableCell className="font-bold min-w-[120px]">
                      TOPLAM
                    </TableCell>
                    <TableCell className="text-right text-slate-900 font-bold min-w-[100px]">
                      €{results.totalPrice?.toFixed(4) || "0.0000"}
                    </TableCell>
                    <TableCell className="text-right text-slate-900 font-bold min-w-[100px]">
                      ₺
                      {results.totalPrice
                        ? (results.totalPrice * results.eurRate).toFixed(4)
                        : "0.0000"}
                    </TableCell>
                    <TableCell className="text-right text-slate-900 font-bold min-w-[100px]">
                      $
                      {results.totalPrice
                        ? (
                            results.totalPrice *
                            (results.eurRate / exchangeRates.usdRate)
                          ).toFixed(4)
                        : "0.0000"}
                    </TableCell>
                    <TableCell className="text-right text-slate-900 font-bold min-w-[100px]">
                      £
                      {results.totalPrice
                        ? (
                            results.totalPrice *
                            (results.eurRate / exchangeRates.gbpRate)
                          ).toFixed(4)
                        : "0.0000"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsDisplay;
