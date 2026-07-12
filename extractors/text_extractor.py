"""
Text extraction utilities for PDF and DOCX files.

All processing happens in-memory — no files are written to disk.
"""

from __future__ import annotations

import io
import re


class ExtractionError(Exception):
    """Raised when text extraction from a file fails."""

    pass


def extract_text(file_bytes: bytes, filename: str) -> str:
    """
    Extract plain text from a PDF or DOCX file.

    Parameters
    ----------
    file_bytes : bytes
        Raw file content.
    filename : str
        Original filename (used to determine the extraction method).

    Returns
    -------
    str
        Extracted and cleaned text.

    Raises
    ------
    ExtractionError
        If the file format is unsupported or extraction fails.
    """
    extension = filename.rsplit(".", maxsplit=1)[-1].lower() if "." in filename else ""

    if extension == "pdf":
        return _extract_pdf(file_bytes)
    elif extension == "docx":
        return _extract_docx(file_bytes)
    else:
        raise ExtractionError(f"Unsupported file format: .{extension}")


def _extract_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF using pdfplumber."""
    try:
        import pdfplumber

        pages_text: list[str] = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages_text.append(text)
        return _clean_text("\n".join(pages_text))
    except Exception as exc:
        raise ExtractionError(f"Failed to extract text from PDF: {exc}") from exc


def _extract_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX using python-docx."""
    try:
        from docx import Document

        doc = Document(io.BytesIO(file_bytes))
        paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
        return _clean_text("\n".join(paragraphs))
    except Exception as exc:
        raise ExtractionError(f"Failed to extract text from DOCX: {exc}") from exc


def _clean_text(text: str) -> str:
    """Normalize whitespace and strip excessive blank lines."""
    # Collapse multiple spaces/tabs into single space
    text = re.sub(r"[^\S\n]+", " ", text)
    # Collapse 3+ consecutive newlines into 2
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()
