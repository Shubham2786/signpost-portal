import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Zap, Download, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface DataCleaningPipelineProps {
  data: DataRow[];
  onCleaningComplete: (cleanedData: DataRow[], results: CleaningResult[]) => void;
}

const DataCleaningPipeline = ({ data, onCleaningComplete }: DataCleaningPipelineProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const { toast } = useToast();

  const cleaningSteps = [
    "Detecting typos and spelling errors",
    "Normalizing inconsistent labels", 
    "Filling missing values",
    "Removing duplicates",
    "Generating synthetic samples",
    "Validating data quality"
  ];

  const simulateDataCleaning = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    const cleaningResults: CleaningResult[] = [];
    let cleanedData = [...data];

    for (let i = 0; i < cleaningSteps.length; i++) {
      setCurrentStep(cleaningSteps[i]);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate cleaning operations based on current step
      switch (i) {
        case 0: // Typo detection
          cleanedData = cleanedData.map(row => {
            const newRow = { ...row };
            Object.keys(row).forEach(key => {
              if (typeof row[key] === 'string' && Math.random() > 0.8) {
                const originalValue = row[key];
                const cleanedValue = originalValue.replace(/teh/g, 'the').replace(/recieve/g, 'receive');
                if (originalValue !== cleanedValue) {
                  cleaningResults.push({
                    type: 'typo',
                    field: key,
                    originalValue,
                    cleanedValue,
                    confidence: 0.95
                  });
                  newRow[key] = cleanedValue;
                }
              }
            });
            return newRow;
          });
          break;
          
        case 1: // Inconsistent labels
          cleanedData = cleanedData.map(row => {
            const newRow = { ...row };
            Object.keys(row).forEach(key => {
              if (typeof row[key] === 'string' && Math.random() > 0.85) {
                const originalValue = row[key];
                let cleanedValue = originalValue;
                
                // Standardize common variations
                if (originalValue.toLowerCase().includes('male')) {
                  cleanedValue = originalValue.toLowerCase().includes('fe') ? 'Female' : 'Male';
                }
                if (originalValue.toLowerCase().includes('yes') || originalValue.toLowerCase().includes('true')) {
                  cleanedValue = 'Yes';
                }
                if (originalValue.toLowerCase().includes('no') || originalValue.toLowerCase().includes('false')) {
                  cleanedValue = 'No';
                }
                
                if (originalValue !== cleanedValue) {
                  cleaningResults.push({
                    type: 'inconsistent',
                    field: key,
                    originalValue,
                    cleanedValue,
                    confidence: 0.88
                  });
                  newRow[key] = cleanedValue;
                }
              }
            });
            return newRow;
          });
          break;
          
        case 2: // Missing values
          cleanedData = cleanedData.map(row => {
            const newRow = { ...row };
            Object.keys(row).forEach(key => {
              if ((row[key] === null || row[key] === undefined || row[key] === '') && Math.random() > 0.7) {
                const originalValue = row[key] || 'NULL';
                let cleanedValue = 'Unknown';
                
                // Smart filling based on field type
                if (key.toLowerCase().includes('age')) cleanedValue = '25';
                if (key.toLowerCase().includes('score')) cleanedValue = '0';
                if (key.toLowerCase().includes('status')) cleanedValue = 'Active';
                
                cleaningResults.push({
                  type: 'missing',
                  field: key,
                  originalValue,
                  cleanedValue,
                  confidence: 0.75
                });
                newRow[key] = cleanedValue;
              }
            });
            return newRow;
          });
          break;
          
        case 4: // Synthetic samples (augmentation)
          if (Math.random() > 0.5) {
            const syntheticRow = { ...cleanedData[0] };
            Object.keys(syntheticRow).forEach(key => {
              if (key !== 'id') {
                syntheticRow[key] = `synthetic_${syntheticRow[key]}`;
              }
            });
            syntheticRow.id = `synthetic_${Date.now()}`;
            
            cleaningResults.push({
              type: 'augmented',
              field: 'entire_row',
              originalValue: 'N/A',
              cleanedValue: 'Generated synthetic sample',
              confidence: 0.82
            });
            
            cleanedData.push(syntheticRow);
          }
          break;
      }
      
      setProgress((i + 1) / cleaningSteps.length * 100);
    }

    setIsProcessing(false);
    setCurrentStep("Cleaning completed!");
    
    toast({
      title: "Data Cleaning Complete",
      description: `Applied ${cleaningResults.length} cleaning operations`,
    });

    onCleaningComplete(cleanedData, cleaningResults);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          AI Data Cleaning Pipeline
        </CardTitle>
        <CardDescription>
          Automated data quality improvement using machine learning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isProcessing ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{data.length}</div>
                <div className="text-sm text-muted-foreground">Records</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{Object.keys(data[0] || {}).length}</div>
                <div className="text-sm text-muted-foreground">Fields</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">AI Steps</div>
              </div>
            </div>
            
            <Button 
              onClick={simulateDataCleaning}
              className="w-full"
              size="lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              Start AI Data Cleaning
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {progress === 100 ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <RotateCcw className="h-4 w-4 animate-spin text-primary" />
              )}
              {currentStep}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {cleaningSteps.map((step, index) => (
            <Badge 
              key={index}
              variant={progress > (index / cleaningSteps.length * 100) ? "default" : "secondary"}
              className="text-xs"
            >
              {step.split(' ').slice(0, 2).join(' ')}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCleaningPipeline;