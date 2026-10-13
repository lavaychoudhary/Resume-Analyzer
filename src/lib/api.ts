import axios from "axios";
import type { AnalysisResult } from "../types/analysis";

const isProd = import.meta.env.PROD;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isProd ? "" : "http://localhost:8000");

export class AnalysisError extends Error {}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/health`, { timeout: 3000 });
    return res.data?.status === "ok";
  } catch {
    return false;
  }
}

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
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 45000, // 45 seconds timeout prevents getting stuck
      }
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        throw new AnalysisError(
          "The analysis request timed out. Please check your backend connection and try again."
        );
      }
      if (!err.response) {
        throw new AnalysisError(
          "Cannot connect to the backend server at http://localhost:8000. Please make sure the backend is running (uvicorn api.index:app --reload)."
        );
      }
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
