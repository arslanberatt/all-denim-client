import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  TrendingUp,
  DollarSign,
  Package,
  Percent,
  Banknote,
} from "lucide-react";

const QuickInfo = ({
  exchangeRates = {},
  totalCalculations,
  selectedPackage = "PACKAGE_050",
}) => {
  // Paket tipine göre oranları belirle
  const getPackageRates = (packageType) => {
    switch (packageType) {
      case "PACKAGE_050":
        return { overhead: 12.5, profit: 30 };
      case "PACKAGE_51100":
        return { overhead: 12.5, profit: 25 };
      case "PACKAGE_101200":
        return { overhead: 10, profit: 15 };
      default:
        return { overhead: 12.5, profit: 30 };
    }
  };

  const rates = getPackageRates(selectedPackage);

  const infoItems = [
    {
      value: `₺${exchangeRates.eurRate || "Yükleniyor..."}`,
      label: "EUR/TRY",
      color: "text-blue-600",
    },
    {
      value: `₺${exchangeRates.usdRate || "Yükleniyor..."}`,
      label: "USD/TRY",
      color: "text-green-600",
    },
    {
      value: `₺${exchangeRates.gbpRate || "Yükleniyor..."}`,
      label: "GBP/TRY",
      color: "text-purple-600",
    },

    {
      value: `${rates.overhead}%`,
      label: "Genel Gider Oranı",
      color: "text-red-600",
    },
    {
      value: `${rates.profit}%`,
      label: "Kar Oranı",
      color: "text-green-600",
    },
    {
      value: "20%",
      label: "KDV Oranı",
      color: "text-orange-600",
    },
    {
      value: "5%",
      label: "Komisyon Oranı",
      color: "text-indigo-600",
    },
    {
      value: totalCalculations,
      label: "Toplam Hesap",
      color: "text-slate-900",
    },
  ];

  return (
    <Card className="shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md order-1 lg:order-2">
      <CardHeader className="border-b border-slate-200 bg-white pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-4 w-4 text-slate-600" />
          Özet Bilgiler
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-4 gap-3">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200 transition-all duration-200 hover:bg-slate-100"
            >
              <div
                className={`text-lg font-bold ${item.color} flex items-center justify-center gap-1 mb-1`}
              >
                {item.value}
              </div>
              <div className="text-xs text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickInfo;
