import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

from app.chunker import filter_files
from app.parsers.python_ast import parse_python_code
from app.parsers.js_ts_ast import parse_js_ts_code
from app.parsers.security_scanner import scan_repository_security, scan_file_for_vulnerabilities
from app.parsers.runner_generator import generate_run_locally_commands
from app.llm import analyze_with_llm

load_dotenv()

app = FastAPI(
    title="RepoBreakdown AST & AI Microservice",
    description="Python AST Extraction, Multiple Inheritance Tracking, Security Scanner, & Zero-Hallucination LLM Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParseRequest(BaseModel):
    owner: str
    repo: str
    fullName: str
    description: Optional[str] = ""
    tree: List[Dict[str, Any]]
    files: Dict[str, str]
    repoUrl: Optional[str] = ""

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "service": "RepoBreakdown Python AST Engine",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def read_health():
    return {
        "status": "healthy",
        "service": "repobreakdown-python-microservice"
    }

@app.post("/parse")
def parse_repository(payload: ParseRequest):
    try:
        repo_name = payload.fullName or f"{payload.owner}/{payload.repo}"
        repo_url = payload.repoUrl or f"https://github.com/{repo_name}"
        print(f"[Python Microservice] Ingesting {repo_name} ({len(payload.files)} files provided)")

        # 1. Filter Noise Files (node_modules, .git, lock files, binary files)
        cleaned_files = filter_files(payload.files)
        print(f"[Python Microservice] Cleaned {len(cleaned_files)} files after noise filtering.")

        # 2. Execute AST Parsing across files
        parsed_ast_list = []
        for file_path, code_content in cleaned_files.items():
            if file_path.endswith(".py"):
                ast_res = parse_python_code(file_path, code_content)
                parsed_ast_list.append(ast_res)
            elif file_path.endswith((".js", ".ts", ".jsx", ".tsx")):
                ast_res = parse_js_ts_code(file_path, code_content)
                parsed_ast_list.append(ast_res)

        # 3. Security Vulnerability Scanning
        security_alerts = scan_repository_security(cleaned_files)

        # 4. Generate 1-Click Run It Locally Commands
        run_commands = generate_run_locally_commands(repo_url, repo_name, payload.tree, cleaned_files)

        # 5. Pass AST Skeleton to Zero-Hallucination LLM Engine
        breakdown_result = analyze_with_llm(
            repo_name=repo_name,
            description=payload.description or "",
            tree=payload.tree,
            parsed_files=parsed_ast_list,
            raw_files=cleaned_files,
            repo_url=repo_url
        )

        # Ensure security alerts and run commands are included
        if not breakdown_result.get("security_alerts") or len(breakdown_result.get("security_alerts", [])) == 0:
            breakdown_result["security_alerts"] = security_alerts or [
                "No critical secrets, hardcoded API keys, or exposed credentials detected in analyzed AST files."
            ]

        if not breakdown_result.get("run_locally_commands"):
            breakdown_result["run_locally_commands"] = run_commands

        return breakdown_result

    except Exception as e:
        print(f"[Python Microservice Error] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


class ExplainFileRequest(BaseModel):
    filePath: str
    codeContent: Optional[str] = ""
    repoContext: Optional[str] = ""

@app.post("/explain-file")
def explain_single_file(payload: ExplainFileRequest):
    try:
        path = payload.filePath
        code = payload.codeContent or ""

        # Run AST parser if python or JS/TS
        ast_info = {}
        if path.endswith(".py"):
            ast_info = parse_python_code(path, code)
        elif path.endswith((".js", ".ts", ".jsx", ".tsx")):
            ast_info = parse_js_ts_code(path, code)

        # Scan for any security issues in this specific file
        file_security = scan_file_for_vulnerabilities(path, code)

        classes_list = ast_info.get("classes", [])
        functions_list = ast_info.get("functions", [])
        classes = [c["name"] for c in classes_list]
        functions = [f["name"] for f in functions_list]
        imports = ast_info.get("imports", [])
        file_name = path.split("/")[-1]

        # Multi-inheritance summary
        multi_classes = [c["name"] for c in classes_list if c.get("is_multiple_inheritance")]

        purpose = f"Module `{file_name}` located at `{path}`."
        if classes and functions:
            purpose = f"Core module defining class models ({', '.join(classes)}) and {len(functions)} handler function(s) for `{path}`."
        elif classes:
            purpose = f"Object-oriented module encapsulating {len(classes)} class definition(s) ({', '.join(classes)}) with encapsulated methods and lifecycle behaviors."
        elif functions:
            purpose = f"Functional service module exposing {len(functions)} utility and execution function(s) for data operations."
        elif file_name.endswith(('.json', '.yaml', '.yml', '.toml')):
            purpose = f"Configuration and dependency manifest declaring settings and schemas for `{file_name}`."
        elif file_name.endswith(('.md', '.txt')):
            purpose = f"Documentation file providing guidelines, specifications, and architecture explanations for `{file_name}`."

        summary = f"### System Architecture Role\n"
        summary += f"`{path}` serves as a key module in the codebase. "
        
        if classes_list:
            summary += f"\n\n**Class Hierarchies:**\n"
            for c in classes_list:
                bases = f" (inherits: {', '.join(c.get('inherits_from', []))})" if c.get('inherits_from') else ""
                multi_tag = " **[MULTIPLE INHERITANCE]**" if c.get("is_multiple_inheritance") else ""
                doc = f" - {c['docstring']}" if c.get('docstring') else ""
                summary += f"- `class {c['name']}{bases}`{multi_tag}{doc}\n"
                for m in c.get('methods', [])[:5]:
                    m_args = f"({', '.join(m.get('args', []))})" if m.get('args') else "()"
                    summary += f"  • `{m['name']}{m_args}`\n"

        if functions_list:
            summary += f"\n\n**Key Functions & Handlers:**\n"
            for fn in functions_list[:8]:
                fn_args = f"({', '.join(fn.get('args', []))})" if fn.get('args') else "()"
                doc = f" - {fn['docstring']}" if fn.get('docstring') else ""
                summary += f"- `{fn['name']}{fn_args}`{doc}\n"

        if imports:
            summary += f"\n\n**Dependencies Imported:**\n" + ", ".join([f"`{imp}`" for imp in imports[:10]])

        return {
            "filePath": path,
            "purpose": purpose,
            "responsibility": f"Encapsulates business logic, data routines, and interface handling for {path}.",
            "summary": summary,
            "classes": classes_list,
            "functions": functions_list,
            "multiple_inheritance_classes": multi_classes,
            "key_exports": classes + functions,
            "imports": imports,
            "security_alerts": file_security,
            "lines": len(code.splitlines()) if code else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=True)
