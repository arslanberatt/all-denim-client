import { useState } from "react";
import { X, Building2, User, Mail, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "react-hot-toast";
import { apiService } from "../services/api";

const AddCompanyModal = ({ isOpen, onClose, onCompanyAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    contactPerson: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Firma adı zorunludur");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("E-posta adresi zorunludur");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.createCompany(formData);
      console.log("API Response:", response);

      // API response'unu kontrol et
      const newCompany = response.data || response;

      toast.success("Firma başarıyla eklendi");
      onCompanyAdded(newCompany);
      setFormData({ name: "", email: "", address: "", contactPerson: "" });
      onClose();
    } catch (error) {
      console.error("Firma ekleme hatası:", error);
      console.error("Error details:", error.message, error.response);
      toast.error(
        `Firma eklenirken hata oluştu: ${error.message || "Bilinmeyen hata"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", address: "", contactPerson: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto bg-white shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-white">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Yeni Firma Ekle
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                Firma Adı *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Firma adını girin"
                required
                className="w-full bg-white border-slate-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                E-posta *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="firma@example.com"
                className="w-full bg-white border-slate-300"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contactPerson"
                className="flex items-center gap-2"
              >
                İletişim Kişisi
              </Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="İletişim kişisi adı"
                className="w-full bg-white border-slate-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                Adres
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Firma adresi"
                className="w-full bg-white border-slate-300"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                type="submit"
                className="flex-1 text-white"
                disabled={loading}
                style={{ backgroundColor: "#000000" }}
              >
                {loading ? "Ekleniyor..." : "Firma Ekle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCompanyModal;
