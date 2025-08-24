import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

interface FilePreviewProps {
  fileName: string;
  content: string;
  errors?: Array<{
    line: number;
    message: string;
    type: string;
  }>;
}

const FilePreview = ({ fileName, content, errors = [] }: FilePreviewProps) => {
  const lines = content.split('\n');

  const getLineClassName = (lineIndex: number) => {
    const hasError = errors.some(error => error.line === lineIndex + 1);
    return hasError 
      ? "bg-destructive/10 border-l-4 border-l-destructive pl-2" 
      : "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          File Preview: {fileName}
        </CardTitle>
        <CardDescription>
          {errors.length > 0 ? (
            <span className="text-destructive font-medium">
              {errors.length} error{errors.length !== 1 ? 's' : ''} detected
            </span>
          ) : (
            "File content preview"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full border rounded-md p-4">
          <div className="font-mono text-sm">
            {lines.map((line, index) => (
              <div
                key={index}
                className={`flex ${getLineClassName(index)}`}
              >
                <span className="text-muted-foreground mr-4 select-none w-8 text-right">
                  {index + 1}
                </span>
                <span className="flex-1">{line || " "}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {errors.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-destructive">Detected Errors:</h4>
            {errors.map((error, index) => (
              <div key={index} className="p-2 bg-destructive/5 border border-destructive/20 rounded text-sm">
                <span className="font-medium">Line {error.line}:</span> {error.message}
                <span className="text-muted-foreground ml-2">({error.type})</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilePreview;