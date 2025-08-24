import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GitCompare, TrendingUp } from "lucide-react";
import DataTablePreview from "./DataTablePreview";

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

interface DataComparisonSliderProps {
  originalData: DataRow[];
  cleanedData: DataRow[];
  cleaningResults: CleaningResult[];
}

const DataComparisonSlider = ({ originalData, cleanedData, cleaningResults }: DataComparisonSliderProps) => {
  const [viewMode, setViewMode] = useState([100]); // 0 = original, 100 = cleaned

  const getCurrentData = () => {
    return viewMode[0] === 0 ? originalData : cleanedData;
  };

  const getCurrentResults = () => {
    return viewMode[0] === 100 ? cleaningResults : [];
  };

  const getDataQualityScore = (data: DataRow[], hasResults: boolean) => {
    if (data.length === 0) return 0;
    
    let qualityScore = 70; // Base score
    
    // Add points for cleaned data
    if (hasResults) {
      qualityScore += Math.min(30, cleaningResults.length * 2);
    }
    
    // Simulate quality improvements
    if (hasResults) {
      qualityScore = Math.min(95, qualityScore);
    }
    
    return qualityScore;
  };

  const originalQuality = getDataQualityScore(originalData, false);
  const cleanedQuality = getDataQualityScore(cleanedData, true);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Data Comparison Slider
          </CardTitle>
          <CardDescription>
            Slide to compare original data vs cleaned data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quality Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">{originalQuality}%</div>
              <div className="text-sm text-muted-foreground">Original Quality</div>
              <Badge variant="secondary" className="mt-2">
                {originalData.length} records
              </Badge>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{cleanedQuality}%</div>
              <div className="text-sm text-muted-foreground">Cleaned Quality</div>
              <Badge variant="default" className="mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{cleanedQuality - originalQuality}%
              </Badge>
            </div>
          </div>

          {/* Slider Control */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Original Data</span>
              <span>Cleaned Data</span>
            </div>
            <Slider
              value={viewMode}
              onValueChange={setViewMode}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm">
              Currently viewing: <Badge variant="outline">
                {viewMode[0] === 0 ? "Original" : viewMode[0] === 100 ? "Cleaned" : `${viewMode[0]}% Cleaned`}
              </Badge>
            </div>
          </div>

          {/* Cleaning Summary */}
          {cleaningResults.length > 0 && (
            <div className="space-y-3">
              <Separator />
              <h4 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Cleaning Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(
                  cleaningResults.reduce((acc, result) => {
                    acc[result.type] = (acc[result.type] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([type, count]) => (
                  <div key={type} className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-primary">{count}</div>
                    <div className="text-xs text-muted-foreground capitalize">{type}s Fixed</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Preview */}
      <DataTablePreview
        data={getCurrentData()}
        cleaningResults={getCurrentResults()}
        title={viewMode[0] === 0 ? "Original Dataset" : "Cleaned Dataset"}
        description={
          viewMode[0] === 0 
            ? "Raw data before AI processing" 
            : `Enhanced data with ${cleaningResults.length} improvements applied`
        }
      />
    </div>
  );
};

export default DataComparisonSlider;