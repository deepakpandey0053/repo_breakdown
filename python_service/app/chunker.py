import re
from typing import Dict

NOISE_PATTERNS = [
    r"(^|/)(node_modules|\.git|\.github|\.vscode|\.idea|dist|build|target|vendor|__pycache__|\.venv|venv|\.cache)/",
    r"\.egg-info/",
    r"\.(png|jpg|jpeg|gif|webp|ico|svg|woff|woff2|ttf|eot|zip|tar|gz|bz2|7z|pdf|mp4|mp3|wav|map|exe|dll|so|dylib)$",
    r"(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|Pipfile\.lock|poetry\.lock|Cargo\.lock)$",
]

def is_noise_path(path: str) -> bool:
    """Returns True if the file path matches noise/binary/lockfile filters."""
    path_clean = path.replace("\\", "/")
    for pattern in NOISE_PATTERNS:
        if re.search(pattern, path_clean, re.IGNORECASE):
            return True
    return False

def filter_files(files: Dict[str, str]) -> Dict[str, str]:
    """Filters out noise files from raw file dict."""
    cleaned = {}
    for path, content in files.items():
        if not is_noise_path(path) and content:
            cleaned[path] = content
    return cleaned
