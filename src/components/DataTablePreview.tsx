import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Database } from "lucide-react";
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

interface DataTablePreviewProps {
  data: DataRow[];
  cleaningResults?: CleaningResult[];
  title: string;
  description: string;
}

const DataTablePreview = ({ data, cleaningResults = [], title, description }: DataTablePreviewProps) => {
  const { toast } = useToast();

  const downloadData = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Download Complete",
      description: "CSV file has been downloaded successfully",
    });
  };

  const convertToCSV = (data: DataRow[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const getCleaningResultForCell = (rowId: string, field: string) => {
    return cleaningResults.find(result => result.field === field);
  };

  const getCellClassName = (rowId: string, field: string) => {
    const result = getCleaningResultForCell(rowId, field);
    if (!result) return "";
    
    switch (result.type) {
      case 'typo': return "bg-blue-50 dark:bg-blue-950/20 border-l-2 border-l-blue-500";
      case 'missing': return "bg-green-50 dark:bg-green-950/20 border-l-2 border-l-green-500";
      case 'inconsistent': return "bg-orange-50 dark:bg-orange-950/20 border-l-2 border-l-orange-500";
      case 'augmented': return "bg-purple-50 dark:bg-purple-950/20 border-l-2 border-l-purple-500";
      default: return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'typo': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'missing': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 'inconsistent': return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case 'augmented': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4" />
            <p>No data to preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button onClick={downloadData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
        
        {cleaningResults.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="text-sm text-muted-foreground mr-4">Applied fixes:</div>
            {Array.from(new Set(cleaningResults.map(r => r.type))).map(type => (
              <Badge key={type} className={getTypeColor(type)}>
                {type.charAt(0).toUpperCase() + type.slice(1)} ({cleaningResults.filter(r => r.type === type).length})
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="font-semibold">
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={row.id || index}>
                  {headers.map((header) => (
                    <TableCell 
                      key={header} 
                      className={getCellClassName(row.id, header)}
                    >
                      <div className="max-w-xs truncate">
                        {String(row[header] || '')}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {data.length} records with {headers.length} fields
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTablePreview;