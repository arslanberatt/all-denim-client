import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Factory, Calculator, BarChart3, History } from "lucide-react";
import { useCompanies, useExchangeRate, useCalculations } from "@/hooks/useApi";
import CalculatorForm from "./CalculatorForm";
import QuickInfo from "./QuickInfo";
import ResultsDisplay from "./ResultsDisplay";
import HistoryTable from "./HistoryTable";
import {
  FormSkeleton,
  QuickInfoSkeleton,
  ResultsSkeleton,
  HistorySkeleton,
} from "./LoadingSkeletons";
import toast from "react-hot-toast";

const DenimCalculator = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [results, setResults] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState("PACKAGE_050");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // API hooks
  const {
    companies,
    loading: companiesLoading,
    refreshCompanies,
  } = useCompanies();
  const {
    exchangeRates,
    loading: rateLoading,
    fetchExchangeRate,
  } = useExchangeRate();
  const {
    calculations,
    loading: calculationsLoading,
    pagination,
    createCalculation,
    setCalculations,
    fetchCalculations,
  } = useCalculations();

  // Initial data loading
  React.useEffect(() => {
    fetchCalculations(currentPage, 10);
    fetchExchangeRate();
  }, [currentPage]);

  const calculateCosts = async (formData) => {
    try {
      setSelectedPackage(formData.packageType);
      const calculationData = {
        companyId: parseInt(formData.companyId),
        packageType: formData.packageType,
        cutProcess: parseFloat(formData.cutProcess) || 0,
        sationProcess: parseFloat(formData.sationProcess) || 0,
        washProcess: parseFloat(formData.washProcess) || 0,
        printProcess: parseFloat(formData.printProcess) || 0,
        wearProcess: parseFloat(formData.wearProcess) || 0,
        accessoryProcess: parseFloat(formData.accessoryProcess) || 0,
        buttonProcess: parseFloat(formData.buttonProcess) || 0,
      };

      // API'ye kaydet
      const savedResult = await createCalculation(calculationData);

      // Local state'i güncelle
      const result = {
        ...savedResult,
        date: new Date().toLocaleDateString("tr-TR"),
        time: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setResults(result);
      setActiveTab("results");
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("Hesaplama sırasında hata oluştu");
    }
  };

  const viewCalculation = (calc) => {
    setResults(calc);
    setActiveTab("results");
  };

  const backToCalculator = () => {
    setActiveTab("calculator");
  };

  const handleCompanyAdded = async (newCompany) => {
    // Companies listesini yeniden yükle
    await refreshCompanies();
    toast.success("Firma başarıyla eklendi ve listeye eklendi");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/ALLDENIMS-white.webp"
              alt="All Denims Logo"
              className="h-16 sm:h-24 md:h-32 w-auto"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100">
            <TabsTrigger
              value="calculator"
              className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Calculator className="h-4 w-4" />
              Hesap
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4" />
              Sonuçlar
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <History className="h-4 w-4" />
              Geçmiş ({calculations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {companiesLoading ? (
                <FormSkeleton />
              ) : (
                <CalculatorForm
                  companies={companies}
                  onCalculate={calculateCosts}
                  onPackageChange={setSelectedPackage}
                  onCompanyAdded={handleCompanyAdded}
                />
              )}

              {companiesLoading ? (
                <QuickInfoSkeleton />
              ) : (
                <QuickInfo
                  exchangeRates={exchangeRates}
                  totalCalculations={calculations.length}
                  selectedPackage={selectedPackage}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <ResultsDisplay
              results={results}
              onBackToCalculator={backToCalculator}
              exchangeRates={exchangeRates}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {calculationsLoading ? (
              <HistorySkeleton />
            ) : (
              <HistoryTable
                history={calculations}
                onViewCalculation={viewCalculation}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                loading={calculationsLoading}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DenimCalculator;
