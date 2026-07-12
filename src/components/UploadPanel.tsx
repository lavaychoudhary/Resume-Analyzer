import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { FileText, Paperclip, X } from "lucide-react";

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
          setError("File is larger than 5MB. Please upload a smaller file.");
        } else if (reason.code === "file-invalid-type") {
          setError("Only PDF and DOCX files are accepted.");
        } else {
          setError("That file couldn't be used. Try a different one.");
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
      <div className="section-title">
        <Paperclip size={18} className="text-navy" strokeWidth={2.5} />
        <label>Resume</label>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300 ${
            isDragActive
              ? "border-navy bg-navy-soft shadow-inner"
              : "border-beige-300 bg-beige-50/50 hover:border-navy hover:bg-beige-50"
          }`}
        >
          <input {...getInputProps()} />
          <FileText size={28} className={`mx-auto mb-4 ${isDragActive ? 'text-navy' : 'text-beige-300'}`} strokeWidth={1.5} />
          <p className="font-sans text-sm text-espresso">
            <span className="font-semibold text-navy">Choose a file</span> or drag it here
          </p>
          <p className="mt-2 font-sans text-xs font-medium text-espresso-muted tracking-wide">PDF or DOCX · up to 5MB</p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-beige-200 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex min-w-0 items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-navy-soft flex items-center justify-center shrink-0">
              <FileText size={20} className="text-navy" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="truncate font-sans font-medium text-espresso">{file.name}</p>
              <p className="font-sans text-xs text-espresso-muted">{formatSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileSelected(null)}
            aria-label="Remove file"
            className="shrink-0 rounded-full p-2 text-espresso-muted transition-colors hover:bg-rose-soft hover:text-rose-600"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && <p className="mt-3 font-sans text-sm font-medium text-rose-600 animate-fadeIn">{error}</p>}
    </div>
  );
}
