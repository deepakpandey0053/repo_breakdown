import ast
from typing import Dict, Any, List

class PythonASTVisitor(ast.NodeVisitor):
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.classes: List[Dict[str, Any]] = []
        self.functions: List[Dict[str, Any]] = []
        self.imports: List[str] = []

    def visit_Import(self, node: ast.Import):
        for alias in node.names:
            self.imports.append(alias.name)
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom):
        module = node.module or ''
        for alias in node.names:
            self.imports.append(f"{module}.{alias.name}")
        self.generic_visit(node)

    def _get_base_name(self, base_node: ast.AST) -> str:
        """Extract name of base class handling ast.Name, ast.Attribute, Subscripts, etc."""
        if isinstance(base_node, ast.Name):
            return base_node.id
        elif isinstance(base_node, ast.Attribute):
            return f"{self._get_base_name(base_node.value)}.{base_node.attr}"
        elif isinstance(base_node, ast.Call):
            return self._get_base_name(base_node.func)
        elif isinstance(base_node, ast.Subscript):
            return self._get_base_name(base_node.value)
        return "object"

    def visit_ClassDef(self, node: ast.ClassDef):
        # Extract base classes with MULTIPLE INHERITANCE tracking
        inherits_from = [self._get_base_name(base) for base in node.bases]
        # Filter out plain 'object' if there are more specific bases
        if len(inherits_from) > 1 and "object" in inherits_from:
            inherits_from = [b for b in inherits_from if b != "object"]

        docstring = ast.get_docstring(node) or ""
        
        methods = []
        for item in node.body:
            if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
                method_doc = ast.get_docstring(item) or ""
                args = [arg.arg for arg in item.args.args if arg.arg != 'self']
                methods.append({
                    "name": item.name,
                    "is_async": isinstance(item, ast.AsyncFunctionDef),
                    "args": args,
                    "docstring": method_doc[:120]
                })

        self.classes.append({
            "name": node.name,
            "file_name": self.file_path,
            "inherits_from": inherits_from,
            "is_multiple_inheritance": len(inherits_from) > 1,
            "docstring": docstring[:250],
            "methods": methods
        })
        self.generic_visit(node)

    def visit_FunctionDef(self, node: ast.FunctionDef):
        # Only top-level functions (not methods inside classes)
        if isinstance(getattr(node, 'parent', None), ast.Module) or not hasattr(node, 'parent'):
            docstring = ast.get_docstring(node) or ""
            args = [arg.arg for arg in node.args.args]
            self.functions.append({
                "name": node.name,
                "file_name": self.file_path,
                "args": args,
                "is_async": False,
                "docstring": docstring[:150]
            })
        self.generic_visit(node)

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef):
        if isinstance(getattr(node, 'parent', None), ast.Module) or not hasattr(node, 'parent'):
            docstring = ast.get_docstring(node) or ""
            args = [arg.arg for arg in node.args.args]
            self.functions.append({
                "name": node.name,
                "file_name": self.file_path,
                "is_async": True,
                "args": args,
                "docstring": docstring[:150]
            })
        self.generic_visit(node)


def parse_python_code(file_path: str, code_content: str) -> Dict[str, Any]:
    """
    Parses Python source code string into AST structural skeleton.
    Returns extracted classes, multiple inheritance relationships, functions, and docstrings.
    """
    try:
        tree = ast.parse(code_content, filename=file_path)
        
        # Annotate parent nodes for top-level checks
        for parent in ast.walk(tree):
            for child in ast.iter_child_nodes(parent):
                child.parent = parent

        visitor = PythonASTVisitor(file_path)
        visitor.visit(tree)

        return {
            "file_path": file_path,
            "classes": visitor.classes,
            "functions": visitor.functions,
            "imports": visitor.imports[:20]
        }
    except Exception as e:
        return {
            "file_path": file_path,
            "error": f"AST parse error: {str(e)}",
            "classes": [],
            "functions": [],
            "imports": []
        }
