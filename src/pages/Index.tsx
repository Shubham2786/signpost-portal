import { useState } from "react";
import Login from "@/components/Login";
import FileUpload from "@/components/FileUpload";
import DataTablePreview from "@/components/DataTablePreview";
import DataCleaningPipeline from "@/components/DataCleaningPipeline";
import DataComparisonSlider from "@/components/DataComparisonSlider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/toaster";

interface DataRow {
  id: string;
  [key: string]: any;
}

interface CleaningResult {
  type: 'typo' | 'missing' | 'inconsistent' | 'duplicate' | 'augmented';
  field: string;
  originalValue: string;
  cleanedValue: string;
  confidence: number;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ file: File; content: string } | null>(null);
  const [originalData, setOriginalData] = useState<DataRow[]>([]);
  const [cleanedData, setCleanedData] = useState<DataRow[]>([]);
  const [cleaningResults, setCleaningResults] = useState<CleaningResult[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleFileUpload = (file: File, content: string) => {
    setUploadedFile({ file, content });
    
    // Parse CSV/JSON data
    let parsedData: DataRow[] = [];
    try {
      if (file.name.endsWith('.csv')) {
        parsedData = parseCSV(content);
      } else if (file.name.endsWith('.json')) {
        parsedData = JSON.parse(content);
      } else {
        // For other file types, create sample data structure
        parsedData = createSampleDataFromContent(content);
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      parsedData = createSampleDataFromContent(content);
    }
    
    setOriginalData(parsedData);
    setCleanedData([]);
    setCleaningResults([]);
    setShowComparison(false);
  };

  const parseCSV = (content: string): DataRow[] => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: DataRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: DataRow = { id: `row_${i}` };
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }
    
    return data;
  };

  const createSampleDataFromContent = (content: string): DataRow[] => {
    // Create sample data structure for demonstration
    const lines = content.split('\n').slice(0, 10);
    return lines.map((line, index) => ({
      id: `row_${index + 1}`,
      content: line.substring(0, 100),
      lineNumber: index + 1,
      length: line.length,
      hasError: Math.random() > 0.7 ? 'Yes' : 'No'
    }));
  };

  const handleCleaningComplete = (cleanedData: DataRow[], results: CleaningResult[]) => {
    setCleanedData(cleanedData);
    setCleaningResults(results);
    setShowComparison(true);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Data Cleaning & Augmentation</h1>
            <p className="text-muted-foreground">
              Automated data quality improvement using machine learning
            </p>
          </div>
          <ThemeToggle />
        </div>

        <FileUpload onFileUpload={handleFileUpload} />

        {uploadedFile && originalData.length > 0 && (
          <div className="space-y-6">
            {/* Original Data Preview */}
            <DataTablePreview
              data={originalData}
              title="Original Dataset"
              description="Raw data ready for AI processing"
            />
            
            {/* Data Cleaning Pipeline */}
            <DataCleaningPipeline
              data={originalData}
              onCleaningComplete={handleCleaningComplete}
            />
            
            {/* Comparison Slider */}
            {showComparison && cleanedData.length > 0 && (
              <DataComparisonSlider
                originalData={originalData}
                cleanedData={cleanedData}
                cleaningResults={cleaningResults}
              />
            )}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
