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
import { History, Eye, Calculator } from "lucide-react";
import toast from "react-hot-toast";

const HistoryTable = ({ history, onViewCalculation }) => {
  if (history.length === 0) {
    return (
      <Card className="shadow-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-600" />
            Hesaplama Geçmişi
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              0 hesap
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <History className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-slate-600">
              Henüz Geçmiş Bulunmuyor
            </h3>
            <p className="text-slate-500">
              İlk hesaplamalarınız burada görünecek
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-600" />
          Hesap Geçmişi
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {history.length} hesap
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold hidden sm:table-cell">
                  Tarih/Saat
                </TableHead>
                <TableHead className="font-semibold">Firma</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">
                  Paket
                </TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">
                  Paket Aralığı
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Toplam (EUR)
                </TableHead>
                <TableHead className="text-right font-semibold hidden sm:table-cell">
                  Toplam (TRY)
                </TableHead>
                <TableHead className="text-right font-semibold">
                  İşlemler
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((calc) => (
                <TableRow
                  key={calc.id}
                  className="transition-all duration-200 hover:bg-slate-50"
                >
                  <TableCell className="hidden sm:table-cell">
                    <div className="font-medium text-slate-900">
                      {calc.date ||
                        new Date(calc.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                    <div className="text-xs text-slate-500">
                      {calc.time ||
                        new Date(calc.createdAt).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-800"
                    >
                      {calc.company?.name || calc.company || "Bilinmeyen Firma"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-700"
                    >
                      {calc.packageType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 hidden lg:table-cell">
                    {calc.packageType === "PACKAGE_050"
                      ? "0-50"
                      : calc.packageType === "PACKAGE_51100"
                      ? "51-100"
                      : calc.packageType === "PACKAGE_101200"
                      ? "101-200"
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    €{calc.totalPrice?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 hidden sm:table-cell">
                    ₺
                    {calc.totalPrice
                      ? (calc.totalPrice * calc.eurRate).toLocaleString()
                      : "0"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewCalculation(calc)}
                      className="transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:border-blue-300"
                      title="Görüntüle"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTable;
