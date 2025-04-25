import { generateDocumentPdf } from "@/api/documentsApi";
import { downloadFile } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

const useGeneratePDFMutation = () => {
  const generatePDFMutation = useMutation({
    mutationFn: generateDocumentPdf,
    onSuccess: (pdfFile) => {
      downloadFile(pdfFile, "document.pdf");
    },
  });
  return generatePDFMutation;
};

export default useGeneratePDFMutation;
