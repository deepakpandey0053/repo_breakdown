import re
from typing import Dict, Any, List

def parse_js_ts_code(file_path: str, code_content: str) -> Dict[str, Any]:
    """
    Parses JS/TS code to extract:
    - Classes, extends/inherits_from (multiple mixins/interfaces), methods, docstrings
    - Functions, exports, arrow functions
    - Key architectural components
    """
    classes = []
    functions = []
    imports = []

    # 1. Extract Imports
    import_matches = re.findall(r'import\s+(?:[\w*\s{},$]+from\s+)?[\'"]([^\'"]+)[\'"]', code_content)
    imports = list(dict.fromkeys(import_matches))[:20]

    # 2. Extract Class definitions: class ClassName extends BaseName or class ClassName extends mixin(BaseA, BaseB)
    class_pattern = re.compile(
        r'(?:\/\*\*([\s\S]*?)\*\/)?\s*(?:export\s+)?(?:default\s+)?class\s+([A-Za-z0-9_$]+)(?:\s+extends\s+([A-Za-z0-9_$.()\s,]+))?(?:\s+implements\s+([A-Za-z0-9_$.\s,]+))?',
        re.MULTILINE
    )

    for doc, class_name, extends_clause, implements_clause in class_pattern.findall(code_content):
        inherits_from = []
        if extends_clause:
            clean_extends = extends_clause.strip()
            # If mixin or multi-parent list like mixin(BaseA, BaseB) or BaseA, BaseB
            parents = re.findall(r'([A-Z][A-Za-z0-9_$]+)', clean_extends)
            inherits_from.extend(parents if parents else [clean_extends])

        if implements_clause:
            interfaces = re.findall(r'([A-Z][A-Za-z0-9_$]+)', implements_clause.strip())
            inherits_from.extend(interfaces)

        # Deduplicate while preserving order
        inherits_from = list(dict.fromkeys(inherits_from))
        docstring = doc.strip() if doc else ""

        # Find methods inside class snippet
        methods = []
        method_pattern = re.compile(r'(?:async\s+)?([a-zA-Z0-9_$]+)\s*\(([^)]*)\)\s*\{')
        class_idx = code_content.find(f"class {class_name}")
        if class_idx != -1:
            snippet = code_content[class_idx:class_idx+2000]
            for m_name, m_args in method_pattern.findall(snippet):
                if m_name not in ['constructor', 'if', 'for', 'while', 'switch', 'catch']:
                    methods.append({
                        "name": m_name,
                        "args": [a.strip() for a in m_args.split(',') if a.strip()],
                    })

        classes.append({
            "name": class_name,
            "file_name": file_path,
            "inherits_from": inherits_from,
            "is_multiple_inheritance": len(inherits_from) > 1,
            "docstring": docstring[:200],
            "methods": methods[:10]
        })

    # 3. Extract Function definitions (export function fnName or const fnName = ...)
    func_pattern = re.compile(
        r'(?:\/\*\*([\s\S]*?)\*\/)?\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)',
        re.MULTILINE
    )
    for doc, func_name, args in func_pattern.findall(code_content):
        functions.append({
            "name": func_name,
            "file_name": file_path,
            "args": [a.strip() for a in args.split(',') if a.strip()],
            "docstring": (doc or "").strip()[:150]
        })

    # Arrow function exports
    arrow_pattern = re.compile(
        r'(?:export\s+)?const\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>',
        re.MULTILINE
    )
    for func_name, args in arrow_pattern.findall(code_content):
        functions.append({
            "name": func_name,
            "file_name": file_path,
            "args": [a.strip() for a in args.split(',') if a.strip()],
            "docstring": ""
        })

    return {
        "file_path": file_path,
        "classes": classes,
        "functions": functions[:12],
        "imports": imports
    }
