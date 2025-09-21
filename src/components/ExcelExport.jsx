import { FileSpreadsheet } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";

const ExcelExport = ({ results, exchangeRates }) => {
  const exportResults = () => {
    if (!results) {
      toast.error("Export edilecek veri bulunamadı");
      return;
    }

    // İşlem maliyetleri
    const processCosts = [
      { label: "Kesim İşlemi", value: results.cutProcess || 0 },
      { label: "Dikiş İşlemi", value: results.sationProcess || 0 },
      { label: "Yıkama tint İşlemi", value: results.washProcess || 0 },
      { label: "Baskı İşlemi", value: results.printProcess || 0 },
      { label: "Ütü-Paket İşlemi", value: results.wearProcess || 0 },
      { label: "Aksesuar İşlemi", value: results.accessoryProcess || 0 },
      { label: "İlik İşlemi", value: results.buttonProcess || 0 },
    ];

    // Maliyet kalemleri
    const costItems = [
      { label: "Kumaş Birim Fiyatı", value: results.fabricUnitPrice || 0 },
      { label: "İşçilik Maliyeti (TL)", value: results.laborCost || 0 },
      { label: "İşçilik Maliyeti (EUR)", value: results.laborCostInEUR || 0 },
      { label: "Malzeme Maliyeti", value: results.materialCost || 0 },
      { label: "Genel Gider", value: results.overheadCost || 0 },
      { label: "Kar Marjı", value: results.profitMargin || 0 },
      { label: "Ara Toplam", value: results.subtotal || 0 },
      { label: "Komisyon", value: results.commission || 0 },
      { label: "KDV", value: results.tax || 0 },
    ];

    // Genel bilgiler - Sade format
    const generalInfo = [
      ["DENIM MALIYET HESAPLAMA RAPORU"],
      [""],
      ["RAPOR BİLGİLERİ"],
      [
        "Şirket Adı",
        results.company?.name || results.company || "Bilinmeyen Firma",
        
      ],
      ["Paket Tipi", results.packageType || "Bilinmeyen", "", "", ""],
      [
        "Rapor Tarihi",
        results.date || new Date(results.createdAt).toLocaleDateString("tr-TR"),
        
      ],
      [
        "Rapor Saati",
        results.time ||
          new Date(results.createdAt).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        
      ],
      ["Hesaplama ID", results.id || "N/A", "", "", ""],
      ["",],
      ["DÖVIZ KURLARI",],
      ["EUR/TRY", `₺${results.eurRate?.toFixed(4) || "N/A"}`, "", "", ""],
      ["USD/TRY", `₺${exchangeRates.usdRate || "N/A"}`, "", "", ""],
      ["GBP/TRY", `₺${exchangeRates.gbpRate || "N/A"}`, "", "", ""],
      ["",],
      ["İŞLEM MALİYETLERİ",],
    ];

    // İşlem maliyetleri tablosu
    const processHeaders = [
      "İşlem Türü",
      "Maliyet (TRY)",
      "Maliyet (EUR)",
      "Maliyet (USD)",
      "Maliyet (GBP)",
    ];

    const processData = processCosts.map((item) => {
      const tryValue = item.value;
      const eurValue = item.value / results.eurRate;
      const usdValue = eurValue * (results.eurRate / exchangeRates.usdRate);
      const gbpValue = eurValue * (results.eurRate / exchangeRates.gbpRate);

      return [
        item.label,
        `₺${tryValue.toFixed(4)}`,
        `€${eurValue.toFixed(4)}`,
        `$${usdValue.toFixed(4)}`,
        `£${gbpValue.toFixed(4)}`,
      ];
    });

    // Maliyet dağılımı
    const costBreakdownInfo = [
      ["",],
      ["MALIYET DAĞILIMI",],
    ];

    // CSV başlıkları
    const headers = [
      "Maliyet Kalemi",
      "Toplam (EUR)",
      "Toplam (TRY)",
      "Toplam (USD)",
      "Toplam (GBP)",
    ];

    // CSV verileri
    const csvData = [
      ...generalInfo,
      processHeaders,
      ...processData,
      ...costBreakdownInfo,
      headers,
      ...costItems.map((item) => {
        const isLaborCostTL = item.label === "İşçilik Maliyeti (TL)";
        const eurValue = isLaborCostTL
          ? item.value / results.eurRate
          : item.value;
        const tryValue = isLaborCostTL
          ? item.value
          : item.value * results.eurRate;
        const usdValue = eurValue * (results.eurRate / exchangeRates.usdRate);
        const gbpValue = eurValue * (results.eurRate / exchangeRates.gbpRate);

        return [
          item.label,
          `€${eurValue.toFixed(4)}`,
          `₺${tryValue.toFixed(4)}`,
          `$${usdValue.toFixed(4)}`,
          `£${gbpValue.toFixed(4)}`,
        ];
      }),
      // Toplam satırı
      [
        "TOPLAM",
        `€${results.totalPrice?.toFixed(4) || "N/A"}`,
        `₺${
          results.totalPrice
            ? (results.totalPrice * results.eurRate).toFixed(4)
            : "N/A"
        }`,
        `$${
          results.totalPrice
            ? (
                results.totalPrice *
                (results.eurRate / exchangeRates.usdRate)
              ).toFixed(4)
            : "N/A"
        }`,
        `£${
          results.totalPrice
            ? (
                results.totalPrice *
                (results.eurRate / exchangeRates.gbpRate)
              ).toFixed(4)
            : "N/A"
        }`,
      ],
      // Boş satır
      ["",],
      // Özet bilgiler
      ["ÖZET BİLGİLER",],
      [
        "Toplam Maliyet (EUR)",
        `€${results.totalPrice?.toFixed(2) || "0.00"}`,
        
      ],
      [
        "Toplam Maliyet (TRY)",
        `₺${
          results.totalPrice
            ? (results.totalPrice * results.eurRate).toFixed(2)
            : "0.00"
        }`,
        
      ],
      [
        "Toplam Maliyet (USD)",
        `$${
          results.totalPrice
            ? (
                results.totalPrice *
                (results.eurRate / exchangeRates.usdRate)
              ).toFixed(2)
            : "0.00"
        }`,
        
      ],
      [
        "Toplam Maliyet (GBP)",
        `£${
          results.totalPrice
            ? (
                results.totalPrice *
                (results.eurRate / exchangeRates.gbpRate)
              ).toFixed(2)
            : "0.00"
        }`,
        
      ],
      ["",],
      ["RAPOR DETAYLARI",],
      [
        "Rapor Oluşturulma Tarihi",
        new Date().toLocaleString("tr-TR"),
        
      ],
      ["Sistem", "All Denims Maliyet Hesaplama Sistemi", "", "", ""],
      ["İletişim", "info@alldenims.com", "", "", ""],
    ];

    // CSV içeriğini oluştur
    const csvContent = csvData
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // BOM ekle (Türkçe karakterler için)
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Dosya ismini oluştur
    const companyName = (
      results.company?.name ||
      results.company ||
      "Bilinmeyen-Firma"
    )
      .replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/g, "") // Özel karakterleri temizle
      .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
      .toLowerCase();

    const packageName = (results.packageType || "Bilinmeyen-Paket")
      .replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/g, "") // Özel karakterleri temizle
      .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
      .toLowerCase();

    const dateStr = new Date().toLocaleDateString("tr-TR").replace(/\//g, "-");
    const timeStr = new Date()
      .toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/:/g, "-");

    // Dosyayı indir
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${companyName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Sonuçlar başarıyla Excel dosyası olarak indirildi");
  };

  return (
    <Button
      onClick={exportResults}
      variant="outline"
      size="sm"
      className="transition-all duration-200 hover:scale-105"
    >
      <FileSpreadsheet className="h-4 w-4 mr-2" />
      Excel İndir
    </Button>
  );
};

export default ExcelExport;
