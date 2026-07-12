import axios from "axios";
import type { AnalysisResult } from "../types/analysis";

const isProd = import.meta.env.PROD;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isProd ? "" : "http://localhost:8000");

export class AnalysisError extends Error {}

export async function analyzeResume(
  file: File,
  jobDescription: string
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);

  try {
    const response = await axios.post<AnalysisResult>(
      `${API_BASE_URL}/api`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const detail = err.response?.data?.detail;
      throw new AnalysisError(
        typeof detail === "string"
          ? detail
          : "We couldn't complete the analysis. Please try again."
      );
    }
    throw new AnalysisError("Something went wrong. Please try again.");
  }
}
