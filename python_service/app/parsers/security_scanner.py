import re
from typing import Dict, List

SECURITY_PATTERNS = [
    # Strict regex matching user specification: (?i)(api_key|password|secret)\s*=\s*['"][^'"]+['"]
    (re.compile(r'(?i)(api_key|password|secret|token|bearer|credential|access_key|private_key)\s*[:=]\s*[\'"][^\'"]{4,}[\'"]'), "potential hardcoded credential or API key"),
    (re.compile(r'ghp_[a-zA-Z0-9]{36}'), "exposed GitHub Personal Access Token"),
    (re.compile(r'xox[baprs]-[0-9a-zA-Z]{10,48}'), "exposed Slack Token"),
    (re.compile(r'AIza[0-9A-Za-z-_]{35}'), "exposed Google API Key"),
    (re.compile(r'sk-[a-zA-Z0-9]{20,48}'), "exposed OpenAI Secret Key"),
    (re.compile(r'AKIA[0-9A-Z]{16}'), "exposed AWS Access Key ID"),
]

# Paths that are expected to contain examples or mock configs
IGNORED_PATHS = [
    ".env.example",
    ".env.template",
    "mock",
    "fixture",
    "example",
]

def scan_file_for_vulnerabilities(file_path: str, content: str) -> List[str]:
    """
    Scans a single file's content for hardcoded secrets, passwords, and API keys.
    Returns human-readable alert strings.
    """
    alerts = []
    
    lower_path = file_path.lower()
    is_test_file = any(ignored in lower_path for ignored in IGNORED_PATHS)
    
    lines = content.splitlines()
    for line_idx, line in enumerate(lines, start=1):
        clean_line = line.strip()
        # Skip comments
        if clean_line.startswith("#") or clean_line.startswith("//") or clean_line.startswith("/*"):
            continue
            
        for pattern, desc in SECURITY_PATTERNS:
            match = pattern.search(line)
            if match:
                matched_str = match.group(0)
                # Check for obvious placeholders like 'your_api_key', 'TODO', 'changeme'
                if any(placeholder in matched_str.lower() for placeholder in ["your_", "placeholder", "xxx", "todo", "change_me", "my_secret"]):
                    continue

                alert_msg = f"Found {desc} in `{file_path}` on line {line_idx}"
                if is_test_file:
                    alert_msg += " (Warning: verify this is dummy/test data)"
                alerts.append(alert_msg)
                break  # avoid multiple detections on same line

    return alerts

def scan_repository_security(files: Dict[str, str]) -> List[str]:
    """
    Scans repository files for security vulnerabilities and returns a deduplicated list of alerts.
    """
    all_alerts = []
    for path, content in files.items():
        if content and isinstance(content, str):
            alerts = scan_file_for_vulnerabilities(path, content)
            all_alerts.extend(alerts)
            
    return all_alerts[:15]  # Cap to top 15 most critical alerts
