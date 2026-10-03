import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    # 1. Health check
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    print("[PASS] GET /health returns 200 OK")

    # 2. Parse endpoint
    payload = {
        "owner": "testorg",
        "repo": "sample-engine",
        "fullName": "testorg/sample-engine",
        "description": "A high-performance pipeline demonstrating multiple inheritance",
        "repoUrl": "https://github.com/testorg/sample-engine",
        "tree": [
            {"path": "core/pipeline.py", "type": "blob"},
            {"path": "requirements.txt", "type": "blob"}
        ],
        "files": {
            "core/pipeline.py": """
class BaseWorker:
    def work(self): pass

class MetricsMixin:
    def track_metrics(self): pass

class AsyncPipeline(BaseWorker, MetricsMixin):
    \"\"\"Combines BaseWorker and MetricsMixin.\"\"\"
    def run(self):
        self.work()
        self.track_metrics()

api_key = "sk-live-99887766554433221100"
""",
            "requirements.txt": "fastapi>=0.100.0\nuvicorn\n"
        }
    }

    res = client.post("/parse", json=payload)
    assert res.status_code == 200, f"Parse failed: {res.text}"
    data = res.json()
    
    # Check all schema keys
    for k in ["enhanced_summary", "tech_stack", "entry_point", "run_locally_commands", "architecture_nodes", "start_here_guide", "security_alerts", "mini_quiz"]:
        assert k in data, f"Missing key: {k}"

    print(f"[PASS] POST /parse returned valid response with {len(data['architecture_nodes'])} architecture node(s) and {len(data['security_alerts'])} security alert(s)")

    # 3. Explain-file endpoint
    explain_payload = {
        "filePath": "core/pipeline.py",
        "codeContent": payload["files"]["core/pipeline.py"],
        "repoContext": "testorg/sample-engine"
    }
    res2 = client.post("/explain-file", json=explain_payload)
    assert res2.status_code == 200, f"Explain failed: {res2.text}"
    detail = res2.json()
    assert "purpose" in detail
    assert "summary" in detail
    assert "multiple_inheritance_classes" in detail
    assert "AsyncPipeline" in detail["multiple_inheritance_classes"]
    print("[PASS] POST /explain-file returned detailed AST breakdown & multiple inheritance identification")

if __name__ == "__main__":
    test_endpoints()
    print("\n[SUCCESS] FASTAPI TESTCLIENT VERIFIED ALL ENDPOINTS!")
