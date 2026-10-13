import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { FileText, Upload, X, CheckCircle, AlertCircle } from "lucide-react";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface UploadPanelProps {
  file: File | null;
  onFileSelected: (file: File | null) => void;
}

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPanel({ file, onFileSelected }: UploadPanelProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const reason = rejections[0].errors[0];
        if (reason.code === "file-too-large") {
          setError("File exceeds 5MB limit. Please upload a smaller file.");
        } else if (reason.code === "file-invalid-type") {
          setError("Only PDF and DOCX files are supported by the ATS parser.");
        } else {
          setError("Failed to read file. Please try another resume document.");
        }
        return;
      }
      setError(null);
      onFileSelected(accepted[0] ?? null);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_SIZE_BYTES,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          1. Upload Resume
        </label>
        <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
          PDF / DOCX
        </span>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-7 text-center transition-all duration-200 ${
            isDragActive
              ? "border-green-500 bg-green-50"
              : "border-beige-200 bg-beige-25 hover:border-green-500 hover:bg-white"
          }`}
        >
          <input {...getInputProps()} />
          <div
            className={`mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isDragActive ? "bg-green-100 text-green-700" : "bg-beige-100 text-ink-muted"
            }`}
          >
            <Upload size={22} strokeWidth={1.75} />
          </div>
          <p className="font-sans text-sm font-semibold text-ink">
            <span className="text-green-600 hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            Supported formats: PDF, DOCX (Max 5MB)
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-green-700 bg-green-50 border border-green-200/80 px-2.5 py-0.5 rounded-full">
            <CheckCircle size={12} />
            ATS Compliant Format Ready
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50/70 p-4 transition-all animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0 border border-green-200">
              <FileText size={20} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-sans text-sm font-bold text-ink">{file.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle size={13} className="text-green-600" />
                <p className="font-sans text-xs font-semibold text-green-700">
                  {formatSize(file.size)} · Ready for ATS Scan
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileSelected(null)}
            aria-label="Remove resume"
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:bg-beige-200 hover:text-ink transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg animate-fadeIn">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
