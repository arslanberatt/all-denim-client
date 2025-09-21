import { FileSpreadsheet } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import * as XLSX from 'xlsx';

const ExcelExport = ({ results, exchangeRates }) => {
  const exportResults = () => {
    if (!results) {
      toast.error("Export edilecek veri bulunamadı");
      return;
    }

    // Doğru format ile veri hazırlama
    const worksheetData = [
      // Başlık satırı
      ["DENIM MALIYET HESAPLAMA RAPORU"],
      [""],
      ["RAPOR BİLGİLERİ"],
      ["Şirket Adı", results.company?.name || results.company || "Bilinmeyen Firma"],
      ["Paket Tipi", results.packageType === "PACKAGE_050" ? "0-50 Adet" : 
                    results.packageType === "PACKAGE_51100" ? "51-100 Adet" : 
                    results.packageType === "PACKAGE_101200" ? "101-200 Adet" : 
                    results.packageType || "Bilinmeyen"],
      ["Rapor Tarihi", results.date || new Date(results.createdAt).toLocaleDateString("tr-TR")],
      ["Rapor Saati", results.time || new Date(results.createdAt).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })],
      ["EUR Kuru Güncelleme", results.eurRateUpdated ? new Date(results.eurRateUpdated).toLocaleString("tr-TR") : "N/A"],
      ["Hesaplama ID", results.id || "N/A"],
      [""],
      ["DÖVIZ KURLARI"],
      ["EUR/TRY", `₺${results.eurRate?.toFixed(4) || "N/A"}`],
      ["USD/TRY", `₺${exchangeRates.usdRate || "N/A"}`],
      ["GBP/TRY", `₺${exchangeRates.gbpRate || "N/A"}`],
      [""],
      ["İŞÇİLİK FİYATLARI (TL)"],
      ["Kesim İşlemi", `₺${results.cutProcess || 0}`],
      ["Dikiş İşlemi", `₺${results.sationProcess || 0}`],
      ["Yıkama İşlemi", `₺${results.washProcess || 0}`],
      ["Baskı İşlemi", `₺${results.printProcess || 0}`],
      ["Ütü-Paket İşlemi", `₺${results.wearProcess || 0}`],
      ["Aksesuar İşlemi", `₺${results.accessoryProcess || 0}`],
      ["İlik İşlemi", `₺${results.buttonProcess || 0}`],
      ["Toplam İşçilik (TL)", `₺${results.laborCost || 0}`],
      [""],
      ["KUMAŞ BİLGİLERİ"],
      ["Kumaş Fiyatı (TL/m)", `₺${results.fabricPrice || 3.16}`],
      ["Kumaş Metresi", `${results.fabricMeter || 1.5} m`],
      ["Kumaş Birim Fiyatı (TL)", `₺${results.fabricUnitPrice || 4.74}`],
      [""],
      // Ana tablo başlıkları
      ["Adet Aralığı", "Kumaş Birim Fiyatı (€)", "İşçilik Maliyeti (€)", "Malzeme Maliyeti (€)", "Genel Gider (€)", "Kar Marjı (€)", "Ara Toplam (€)", "Komisyon (€)", "KDV (€)", "Final EUR", "Final TL", "Final USD", "Final GBP"],
      // Veri satırı
      [
        results.packageType === "PACKAGE_050" ? "0-50" : 
        results.packageType === "PACKAGE_51100" ? "51-100" : 
        results.packageType === "PACKAGE_101200" ? "101-200" : "N/A",
        results.fabricUnitPrice || 0,
        results.laborCostInEUR || 0,
        results.materialCost || 0,
        results.overheadCost || 0,
        results.profitMargin || 0,
        results.subtotal || 0,
        results.commission || 0,
        results.tax || 0,
        results.totalPrice || 0,
        results.totalPrice ? (results.totalPrice * results.eurRate) : 0,
        results.totalPrice ? (results.totalPrice * results.eurRate / exchangeRates.usdRate) : 0,
        results.totalPrice ? (results.totalPrice * results.eurRate / exchangeRates.gbpRate) : 0
      ],
      [""],
      ["HESAPLAMA DETAYLARI"],
      ["Malzeme Maliyeti (€)", `€${results.materialCost?.toFixed(4) || "0.0000"}`],
      ["Genel Gider (€)", `€${results.overheadCost?.toFixed(4) || "0.0000"}`],
      ["Kar Marjı (€)", `€${results.profitMargin?.toFixed(4) || "0.0000"}`],
      ["Ara Toplam (€)", `€${results.subtotal?.toFixed(4) || "0.0000"}`],
      ["Komisyon (€)", `€${results.commission?.toFixed(4) || "0.0000"}`],
      ["KDV (€)", `€${results.tax?.toFixed(4) || "0.0000"}`],
      ["Toplam Fiyat (€)", `€${results.totalPrice?.toFixed(4) || "0.0000"}`],
      [""],
      ["Toplam Maliyet (EUR)", `€${results.totalPrice?.toFixed(2) || "0.00"}`],
      ["Toplam Maliyet (TRY)", `₺${results.totalPrice ? (results.totalPrice * results.eurRate).toFixed(2) : "0.00"}`],
      ["Toplam Maliyet (USD)", `$${results.totalPrice ? (results.totalPrice * results.eurRate / exchangeRates.usdRate).toFixed(2) : "0.00"}`],
      ["Toplam Maliyet (GBP)", `£${results.totalPrice ? (results.totalPrice * results.eurRate / exchangeRates.gbpRate).toFixed(2) : "0.00"}`],
      [""],
      ["RAPOR DETAYLARI"],
      ["Rapor Oluşturulma Tarihi", new Date().toLocaleString("tr-TR")],
      ["Sistem", "All Denims Maliyet Hesaplama Sistemi"],
      ["İletişim", "info@alldenims.com"]
    ];

    // Excel workbook oluştur
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Sütun genişliklerini ayarla
    const colWidths = [
      { wch: 15 }, // Adet Aralığı
      { wch: 18 }, // Kumaş Birim Fiyatı
      { wch: 18 }, // İşçilik Maliyeti
      { wch: 18 }, // Malzeme Maliyeti
      { wch: 15 }, // Genel Gider
      { wch: 15 }, // Kar Marjı
      { wch: 15 }, // Ara Toplam
      { wch: 15 }, // Komisyon
      { wch: 15 }, // KDV
      { wch: 15 }, // Final EUR
      { wch: 15 }, // Final TL
      { wch: 15 }, // Final USD
      { wch: 15 }  // Final GBP
    ];
    worksheet['!cols'] = colWidths;

    // Worksheet'i workbook'a ekle
    XLSX.utils.book_append_sheet(workbook, worksheet, "Maliyet Raporu");

    // Dosya ismini oluştur
    const companyName = (
      results.company?.name ||
      results.company ||
      "Bilinmeyen-Firma"
    )
      .replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    const dateStr = new Date().toLocaleDateString("tr-TR").replace(/\//g, "-");
    const fileName = `${companyName}-${dateStr}.xlsx`;

    // Excel dosyasını indir
    XLSX.writeFile(workbook, fileName);

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

