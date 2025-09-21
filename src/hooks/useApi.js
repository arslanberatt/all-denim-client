import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiService from "@/services/api";

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCompanies();

        // API'den gelen veriyi kontrol et ve düzenle
        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          setCompanies([]);
        }
      } catch (err) {
        setError(err.message);
        toast.error("Firmalar yüklenirken hata oluştu");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const refreshCompanies = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCompanies();
      if (Array.isArray(data)) {
        setCompanies(data);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Firmalar yenilenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return { companies, loading, error, refreshCompanies };
};

export const useExchangeRate = () => {
  const [exchangeRates, setExchangeRates] = useState({
    eurRate: "",
    usdRate: "",
    gbpRate: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchExchangeRate = async () => {
    try {
      setLoading(true);
      // Her bir para birimi için ayrı ayrı TRY fiyatını çek
      const [eurRes, usdRes, gbpRes] = await Promise.all([
        fetch("https://api.exchangerate-api.com/v4/latest/EUR"),
        fetch("https://api.exchangerate-api.com/v4/latest/USD"),
        fetch("https://api.exchangerate-api.com/v4/latest/GBP"),
      ]);
      const [eurData, usdData, gbpData] = await Promise.all([
        eurRes.json(),
        usdRes.json(),
        gbpRes.json(),
      ]);

      if (eurData?.rates?.TRY && usdData?.rates?.TRY && gbpData?.rates?.TRY) {
        const newRates = {
          eurRate: eurData.rates.TRY.toFixed(2),
          usdRate: usdData.rates.TRY.toFixed(2),
          gbpRate: gbpData.rates.TRY.toFixed(2),
        };
        setExchangeRates(newRates);
      } else {
        toast.error("Döviz kuru verisi alınamadı");
      }
    } catch (err) {
      console.error("Exchange rate error:", err);
      toast.error("Döviz kuru yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return {
    exchangeRate: exchangeRates.eurRate,
    exchangeRates,
    setExchangeRate: (rate) =>
      setExchangeRates((prev) => ({ ...prev, eurRate: rate })),
    loading,
    fetchExchangeRate,
  };
};

export const useCalculations = () => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCalculations = async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      const data = await apiService.getCalculations(page, limit, filters);

      // API'den gelen veriyi kontrol et
      if (Array.isArray(data)) {
        setCalculations(data);
      } else {
        setCalculations([]);
      }
    } catch (err) {
      setError(err.message);
      toast.error("Hesaplamalar yüklenirken hata oluştu");
      setCalculations([]);
    } finally {
      setLoading(false);
    }
  };

  const createCalculation = async (calculationData) => {
    try {
      const result = await apiService.createCalculation(calculationData);

      // API'den gelen sonucu kontrol et
      const newCalculation = result || {
        id: Date.now().toString(),
        ...calculationData,
      };

      setCalculations((prev) => [newCalculation, ...prev]);
      toast.success("Hesaplama başarıyla kaydedildi");
      return newCalculation;
    } catch (err) {
      toast.error("Hesaplama kaydedilirken hata oluştu");
      throw err;
    }
  };

  return {
    calculations,
    loading,
    error,
    fetchCalculations,
    createCalculation,
    setCalculations,
  };
};
