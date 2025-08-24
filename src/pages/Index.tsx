import { useState } from "react";
import Login from "@/components/Login";
import FileUpload from "@/components/FileUpload";
import FilePreview from "@/components/FilePreview";
import ErrorDetection from "@/components/ErrorDetection";
import FileComparison from "@/components/FileComparison";

interface Error {
  line: number;
  message: string;
  type: string;
  suggestion: string;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ file: File; content: string } | null>(null);
  const [errors, setErrors] = useState<Error[]>([]);
  const [correctedContent, setCorrectedContent] = useState<string>("");
  const [fixedErrors, setFixedErrors] = useState<Error[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleFileUpload = (file: File, content: string) => {
    setUploadedFile({ file, content });
    setErrors([]);
    setCorrectedContent("");
    setFixedErrors([]);
    setShowComparison(false);
  };

  const handleErrorsDetected = (detectedErrors: Error[]) => {
    setErrors(detectedErrors);
  };

  const handleErrorsFixed = (fixedContent: string, fixed: Error[]) => {
    setCorrectedContent(fixedContent);
    setFixedErrors(fixed);
    setShowComparison(true);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold mb-2">Error Detection System</h1>
          <p className="text-muted-foreground">
            Upload files, detect errors, and get corrected versions automatically
          </p>
        </div>

        <FileUpload onFileUpload={handleFileUpload} />

        {uploadedFile && (
          <div className="grid gap-6">
            <FilePreview 
              fileName={uploadedFile.file.name}
              content={uploadedFile.content}
              errors={errors}
            />
            
            <ErrorDetection
              fileName={uploadedFile.file.name}
              content={uploadedFile.content}
              onErrorsDetected={handleErrorsDetected}
              onErrorsFixed={handleErrorsFixed}
            />
            
            {showComparison && correctedContent && (
              <FileComparison
                fileName={uploadedFile.file.name}
                originalContent={uploadedFile.content}
                correctedContent={correctedContent}
                fixedErrors={fixedErrors}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
