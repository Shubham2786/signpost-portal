import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, FileText, CheckCircle } from "lucide-react";

interface Error {
  line: number;
  message: string;
  type: string;
  suggestion: string;
}

interface FileComparisonProps {
  fileName: string;
  originalContent: string;
  correctedContent: string;
  fixedErrors: Error[];
}

const FileComparison = ({ fileName, originalContent, correctedContent, fixedErrors }: FileComparisonProps) => {
  const [viewMode, setViewMode] = useState(50); // 0 = original only, 100 = corrected only, 50 = split view
  
  const originalLines = originalContent.split('\n');
  const correctedLines = correctedContent.split('\n');
  
  const getChangedLines = () => {
    const changed = new Set<number>();
    fixedErrors.forEach(error => changed.add(error.line - 1));
    return changed;
  };
  
  const changedLines = getChangedLines();

  const renderContent = () => {
    if (viewMode <= 25) {
      // Show original only
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="font-medium">Original File</span>
          </div>
          <ScrollArea className="h-96 w-full border rounded-md p-4">
            <div className="font-mono text-sm">
              {originalLines.map((line, index) => (
                <div
                  key={index}
                  className={`flex ${changedLines.has(index) ? 'bg-destructive/10 border-l-4 border-l-destructive pl-2' : ''}`}
                >
                  <span className="text-muted-foreground mr-4 select-none w-8 text-right">
                    {index + 1}
                  </span>
                  <span className="flex-1">{line || " "}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      );
    } else if (viewMode >= 75) {
      // Show corrected only
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium">Corrected File</span>
          </div>
          <ScrollArea className="h-96 w-full border rounded-md p-4">
            <div className="font-mono text-sm">
              {correctedLines.map((line, index) => (
                <div
                  key={index}
                  className={`flex ${changedLines.has(index) ? 'bg-green-50 border-l-4 border-l-green-500 pl-2' : ''}`}
                >
                  <span className="text-muted-foreground mr-4 select-none w-8 text-right">
                    {index + 1}
                  </span>
                  <span className="flex-1">{line || " "}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      );
    } else {
      // Show split view
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium text-sm">Original</span>
            </div>
            <ScrollArea className="h-96 w-full border rounded-md p-2">
              <div className="font-mono text-xs">
                {originalLines.map((line, index) => (
                  <div
                    key={index}
                    className={`flex ${changedLines.has(index) ? 'bg-destructive/10 border-l-2 border-l-destructive pl-1' : ''}`}
                  >
                    <span className="text-muted-foreground mr-2 select-none w-6 text-right">
                      {index + 1}
                    </span>
                    <span className="flex-1">{line || " "}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-sm">Corrected</span>
            </div>
            <ScrollArea className="h-96 w-full border rounded-md p-2">
              <div className="font-mono text-xs">
                {correctedLines.map((line, index) => (
                  <div
                    key={index}
                    className={`flex ${changedLines.has(index) ? 'bg-green-50 border-l-2 border-l-green-500 pl-1' : ''}`}
                  >
                    <span className="text-muted-foreground mr-2 select-none w-6 text-right">
                      {index + 1}
                    </span>
                    <span className="flex-1">{line || " "}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          File Comparison: {fileName}
        </CardTitle>
        <CardDescription>
          Compare original and corrected versions of your file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">View Mode</span>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">Original</Badge>
              <Badge variant="outline" className="text-xs">Split</Badge>
              <Badge variant="outline" className="text-xs">Corrected</Badge>
            </div>
          </div>
          <Slider
            value={[viewMode]}
            onValueChange={(value) => setViewMode(value[0])}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        {renderContent()}

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Fixed Errors Summary
          </h4>
          <div className="grid gap-2">
            {fixedErrors.map((error, index) => (
              <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    Line {error.line}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {error.type}
                  </Badge>
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-800">
                  Fixed: {error.message}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Applied: {error.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileComparison;