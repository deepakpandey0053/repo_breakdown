import sys
import os

# Add python_service directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.parsers.python_ast import parse_python_code
from app.parsers.js_ts_ast import parse_js_ts_code
from app.parsers.security_scanner import scan_file_for_vulnerabilities, scan_repository_security
from app.parsers.runner_generator import generate_run_locally_commands
from app.chunker import filter_files
from app.llm import fallback_ast_analysis

def test_ast_parsers():
    print("Testing Python AST Parser...")
    sample_py = """
import os
from typing import List

class BaseEngine:
    \"\"\"Base computation engine.\"\"\"
    def compute(self, x):
        return x * 2

class LoggerMixin:
    \"\"\"Mixin providing log capability.\"\"\"
    def log_event(self, msg):
        print(msg)

class AdvancedPipeline(BaseEngine, LoggerMixin):
    \"\"\"Orchestrator utilizing multiple inheritance.\"\"\"
    def __init__(self, name: str):
        self.name = name

    def execute_flow(self, data: List[int]):
        \"\"\"Executes the multi-stage pipeline.\"\"\"
        self.log_event("Starting execution")
        return [self.compute(d) for d in data]

def initialize_runtime(config_path: str):
    \"\"\"Bootstrap runtime config.\"\"\"
    pass
"""
    py_res = parse_python_code("pipeline.py", sample_py)
    assert len(py_res["classes"]) == 3, f"Expected 3 classes, got {len(py_res['classes'])}"
    
    # Check multiple inheritance
    adv_class = [c for c in py_res["classes"] if c["name"] == "AdvancedPipeline"][0]
    assert adv_class["is_multiple_inheritance"] == True, "Failed to flag multiple inheritance"
    assert "BaseEngine" in adv_class["inherits_from"] and "LoggerMixin" in adv_class["inherits_from"], "Failed to extract both base classes"
    print("[PASS] Python AST Parser & Multiple Inheritance verified successfully!")

    print("Testing JS/TS AST Parser...")
    sample_js = """
import express from 'express';

export class ServiceWorker extends BaseWorker {
    async processJob(jobId) {
        return true;
    }
}

export function startWorker() {
    return new ServiceWorker();
}
"""
    js_res = parse_js_ts_code("worker.js", sample_js)
    assert len(js_res["classes"]) == 1, "Expected 1 JS class"
    assert js_res["classes"][0]["inherits_from"] == ["BaseWorker"], "Inherits_from mismatch"
    assert len(js_res["functions"]) == 1, "Expected 1 exported function"
    print("[PASS] JS/TS AST Parser verified successfully!")

def test_security_scanner():
    print("Testing Security Scanner...")
    vuln_code = """
AWS_ACCESS = "AKIAIOSFODNN7EXAMPLE"
api_key = 'sk-1234567890abcdef1234567890abcdef'
DB_PASSWORD = "supersecretpassword123!"
normal_var = "hello world"
"""
    alerts = scan_file_for_vulnerabilities("config.py", vuln_code)
    assert len(alerts) >= 2, f"Expected at least 2 security alerts, got {len(alerts)}: {alerts}"
    print(f"[PASS] Security Scanner detected {len(alerts)} alerts as expected: {alerts[0]}")

def test_runner_generator():
    print("Testing 1-Click Run It Locally Generator...")
    tree = [{"path": "requirements.txt", "type": "blob"}, {"path": "main.py", "type": "blob"}]
    files = {"requirements.txt": "fastapi\nuvicorn\n"}
    cmds = generate_run_locally_commands("https://github.com/test/repo", "test/repo", tree, files)
    assert any("pip install" in c for c in cmds), f"Expected pip install command, got {cmds}"
    assert any("python main.py" in c for c in cmds), f"Expected python main.py command, got {cmds}"
    print(f"[PASS] Run Locally Generator produced valid commands: {cmds}")

def test_strict_schema_fallback():
    print("Testing Strict Fallback Schema...")
    tree = [
        {"path": "pipeline.py", "type": "blob"},
        {"path": "requirements.txt", "type": "blob"}
    ]
    parsed_files = [
        {
            "file_path": "pipeline.py",
            "classes": [
                {
                    "name": "AdvancedPipeline",
                    "inherits_from": ["BaseEngine", "LoggerMixin"],
                    "is_multiple_inheritance": True,
                    "docstring": "Orchestrates multi-stage processing",
                    "methods": [{"name": "execute_flow"}]
                }
            ],
            "functions": [{"name": "initialize_runtime", "docstring": "Bootstraps config"}]
        }
    ]
    raw_files = {
        "pipeline.py": "class AdvancedPipeline(BaseEngine, LoggerMixin): pass",
        "requirements.txt": "fastapi"
    }

    result = fallback_ast_analysis("org/repo", "A test repository", tree, parsed_files, raw_files, "https://github.com/org/repo")
    
    # Verify exact schema keys
    required_keys = [
        "enhanced_summary",
        "tech_stack",
        "entry_point",
        "run_locally_commands",
        "architecture_nodes",
        "start_here_guide",
        "security_alerts",
        "mini_quiz"
    ]
    for key in required_keys:
        assert key in result, f"Missing required schema key: {key}"

    assert "executive_summary" in result["enhanced_summary"]
    assert "core_problem_solved" in result["enhanced_summary"]
    assert "how_it_works_pro" in result["enhanced_summary"]
    assert "how_it_works_eli5" in result["enhanced_summary"]

    assert len(result["architecture_nodes"]) >= 1
    assert result["architecture_nodes"][0]["is_multiple_inheritance"] == True
    assert len(result["mini_quiz"]) >= 3
    print("[PASS] Strict Schema Deterministic Fallback verified successfully!")

if __name__ == "__main__":
    test_ast_parsers()
    test_security_scanner()
    test_runner_generator()
    test_strict_schema_fallback()
    print("\n[SUCCESS] ALL STEP 2 PYTHON PARSER & MICROSERVICE TESTS PASSED SUCCESSFULLY!")
