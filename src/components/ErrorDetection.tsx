import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Wrench, Download, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Error {
  line: number;
  message: string;
  type: string;
  suggestion: string;
}

interface ErrorDetectionProps {
  fileName: string;
  content: string;
  onErrorsDetected: (errors: Error[]) => void;
  onErrorsFixed: (fixedContent: string, fixedErrors: Error[]) => void;
}

const ErrorDetection = ({ fileName, content, onErrorsDetected, onErrorsFixed }: ErrorDetectionProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);
  const [fixedContent, setFixedContent] = useState<string>("");
  const [fixedErrors, setFixedErrors] = useState<Error[]>([]);
  const [hasDetectedErrors, setHasDetectedErrors] = useState(false);
  const [hasFixedErrors, setHasFixedErrors] = useState(false);
  const { toast } = useToast();

  const detectErrors = async () => {
    setIsDetecting(true);
    
    // Simulate error detection
    setTimeout(() => {
      const mockErrors: Error[] = [
        {
          line: 3,
          message: "Missing comma after value",
          type: "Syntax Error",
          suggestion: "Add comma after 'value'"
        },
        {
          line: 7,
          message: "Trailing whitespace detected",
          type: "Format Error", 
          suggestion: "Remove trailing spaces"
        },
        {
          line: 12,
          message: "Inconsistent quote style",
          type: "Style Error",
          suggestion: "Use consistent quote style"
        }
      ];
      
      setErrors(mockErrors);
      setHasDetectedErrors(true);
      onErrorsDetected(mockErrors);
      setIsDetecting(false);
      
      toast({
        title: "Error detection complete",
        description: `Found ${mockErrors.length} errors in ${fileName}`,
        variant: mockErrors.length > 0 ? "destructive" : "default",
      });
    }, 2000);
  };

  const fixErrors = async () => {
    setIsFixing(true);
    
    // Simulate error fixing
    setTimeout(() => {
      const correctedContent = content
        .split('\n')
        .map((line, index) => {
          // Simulate fixing errors
          if (index === 2) return line + ","; // Add missing comma
          if (index === 6) return line.trimEnd(); // Remove trailing whitespace
          if (index === 11) return line.replace(/'/g, '"'); // Fix quote style
          return line;
        })
        .join('\n');
      
      setFixedContent(correctedContent);
      setFixedErrors([...errors]);
      setHasFixedErrors(true);
      onErrorsFixed(correctedContent, errors);
      setIsFixing(false);
      
      toast({
        title: "Errors fixed successfully",
        description: `All ${errors.length} errors have been corrected`,
      });
    }, 1500);
  };

  const downloadCorrectedFile = () => {
    const blob = new Blob([fixedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corrected_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File downloaded",
      description: "Corrected file has been downloaded successfully",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Error Detection & Correction
          </CardTitle>
          <CardDescription>
            Detect and automatically fix errors in your uploaded file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={detectErrors} 
              disabled={isDetecting}
              className="flex-1"
            >
              <Search className="h-4 w-4 mr-2" />
              {isDetecting ? "Detecting Errors..." : "Find Errors"}
            </Button>
            
            {hasDetectedErrors && errors.length > 0 && (
              <Button 
                onClick={fixErrors} 
                disabled={isFixing}
                variant="secondary"
                className="flex-1"
              >
                <Wrench className="h-4 w-4 mr-2" />
                {isFixing ? "Fixing Errors..." : "Resolve Errors"}
              </Button>
            )}
            
            {hasFixedErrors && (
              <Button 
                onClick={downloadCorrectedFile}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Fixed File
              </Button>
            )}
          </div>

          {hasDetectedErrors && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Detection Results</h4>
                <Badge variant={errors.length > 0 ? "destructive" : "secondary"}>
                  {errors.length} Error{errors.length !== 1 ? 's' : ''} Found
                </Badge>
              </div>
              
              {errors.map((error, index) => (
                <div key={index} className="p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Line {error.line}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {error.type}
                        </Badge>
                        {hasFixedErrors && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {error.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Suggestion: {error.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDetection;