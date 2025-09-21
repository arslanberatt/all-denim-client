import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Package, Plus } from "lucide-react";
import toast from "react-hot-toast";
import AddCompanyModal from "./AddCompanyModal";

const CalculatorForm = ({
  companies = [],
  onCalculate,
  onPackageChange,
  onCompanyAdded,
}) => {
  const [formData, setFormData] = useState({
    companyId: "",
    packageType: "",
    cutProcess: "",
    sationProcess: "",
    washProcess: "",
    printProcess: "",
    wearProcess: "",
    accessoryProcess: "",
    buttonProcess: "",
  });
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);

  const packageTypes = [
    { value: "PACKAGE_050", label: "0-50 Adet" },
    { value: "PACKAGE_51100", label: "51-100 Adet" },
    { value: "PACKAGE_101200", label: "101-200 Adet" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "packageType" && onPackageChange) {
      onPackageChange(value);
    }
  };

  const handleCalculate = () => {
    if (!formData.companyId || !formData.packageType) {
      toast.error("Lütfen şirket ve paket tipini seçin");
      return;
    }

    const numericFields = [
      "cutProcess",
      "sationProcess",
      "washProcess",
      "printProcess",
      "wearProcess",
      "accessoryProcess",
      "buttonProcess",
    ];

    for (const field of numericFields) {
      if (
        formData[field] &&
        (isNaN(parseFloat(formData[field])) || parseFloat(formData[field]) < 0)
      ) {
        toast.error(`${field} geçerli bir sayı olmalıdır`);
        return;
      }
    }

    onCalculate(formData);
  };

  const isFormValid = formData.companyId && formData.packageType;

  return (
    <>
      <Card className="shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md order-2 lg:order-1">
        <CardHeader className="border-b border-slate-200 bg-white">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-slate-600" />
            Hesap Formu
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyId" className="text-sm font-medium">
                Firma
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.companyId}
                  onValueChange={(value) =>
                    handleInputChange("companyId", value)
                  }
                >
                  <SelectTrigger className="h-10 transition-colors focus:ring-2 focus:ring-blue-500 bg-white border-slate-300 [&>span]:bg-white flex-1">
                    <SelectValue placeholder="Firma seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(companies) && companies.length > 0 ? (
                      companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="default" disabled>
                        Firmalar yükleniyor...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddCompanyModalOpen(true)}
                  className="h-10 px-3 flex-shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageType" className="text-sm font-medium">
                Paket Tipi
              </Label>
              <Select
                value={formData.packageType}
                onValueChange={(value) =>
                  handleInputChange("packageType", value)
                }
              >
                <SelectTrigger className="h-10 transition-colors focus:ring-2 focus:ring-blue-500 bg-white border-slate-300 [&>span]:bg-white">
                  <SelectValue placeholder="Paket seçin" />
                </SelectTrigger>
                <SelectContent>
                  {packageTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              İşlemler ve İşçilik (TRY)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "cutProcess", label: "Kesim (TRY)" },
                { key: "sationProcess", label: "Dikim (TRY)" },
                { key: "washProcess", label: "Yıkama tint (TRY)" },
                { key: "printProcess", label: "Baskı (TRY)" },
                { key: "wearProcess", label: "Ütü-Paket (TRY)" },
                { key: "accessoryProcess", label: "Aksesuar (TRY)" },
                { key: "buttonProcess", label: "İlik (TRY)" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label
                    htmlFor={key}
                    className="text-xs font-medium text-slate-600"
                  >
                    {label}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder="0.00"
                    className="h-9 text-sm transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full h-12 text-lg font-semibold text-black border-2 border-black hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!isFormValid}
          >
            Hesapla
          </Button>
        </CardContent>
      </Card>

      <AddCompanyModal
        isOpen={isAddCompanyModalOpen}
        onClose={() => setIsAddCompanyModalOpen(false)}
        onCompanyAdded={onCompanyAdded}
      />
    </>
  );
};

export default CalculatorForm;
