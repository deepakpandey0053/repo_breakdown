import re
from typing import Dict, Any, List, Tuple

# Hard token safety limit (Gemini / OpenAI safe working context threshold)
MAX_SAFE_TOKENS = 60000
CHARS_PER_TOKEN = 3.6  # Conservative token estimation ratio


def estimate_tokens(text: str) -> int:
    """Estimates token count using conservative character ratio."""
    if not text:
        return 0
    return max(1, int(len(text) / CHARS_PER_TOKEN))


def get_file_importance_score(file_path: str) -> int:
    """
    Ranks files by architectural importance for LLM comprehension:
    100: Root manifests & build configs
    85:  Main entry points & server bootstrap
    70:  Routes, controllers, APIs & middleware
    55:  Core domain services, models, schemas & multi-agent logic
    40:  UI views, pages & components
    25:  Utilities, helpers & shared libraries
    10:  Tests, mocks, fixtures, examples
    """
    path_lower = file_path.replace("\\", "/").lower()
    base_name = path_lower.split("/")[-1]

    # Tier 1: Configs, manifests, build specs
    manifests = [
        'package.json', 'requirements.txt', 'pyproject.toml', 'makefile',
        'docker-compose.yml', 'docker-compose.yaml', 'dockerfile',
        'cargo.toml', 'go.mod', 'pom.xml', 'build.gradle', 'readme.md'
    ]
    if base_name in manifests or any(m in base_name for m in ['requirements', 'package.json', 'docker-compose']):
        return 100

    # Tier 2: Entry points & bootstrap
    entry_patterns = [
        'main.py', 'app.py', 'server.js', 'index.js', 'index.ts', 'server.ts',
        'app.jsx', 'app.tsx', 'cli.py', 'src/main.', 'src/index.', 'bin/', 'cmd/'
    ]
    if any(p in path_lower for p in entry_patterns) or base_name.startswith(('main.', 'app.', 'index.', 'server.')):
        return 85

    # Tier 3: Routing, controllers, APIs, endpoints, middleware
    route_patterns = ['route', 'router', 'controller', 'api', 'endpoint', 'handler', 'middleware', 'gateway']
    if any(p in path_lower for p in route_patterns):
        return 70

    # Tier 4: Core services, domain models, agents, state, DB schemas
    service_patterns = ['service', 'model', 'schema', 'entity', 'agent', 'strategy', 'engine', 'core', 'store', 'state', 'db']
    if any(p in path_lower for p in service_patterns):
        return 55

    # Tier 5: UI Views, components, pages
    ui_patterns = ['component', 'view', 'page', 'screen', 'layout', 'ui']
    if any(p in path_lower for p in ui_patterns):
        return 40

    # Tier 7: Tests, specs, mocks, fixtures, examples, docs (Low priority)
    test_patterns = ['test', 'spec', 'mock', 'fixture', '__test__', 'tests/', 'test_', '_test', 'example', 'demo', 'doc']
    if any(p in path_lower for p in test_patterns):
        return 10

    # Tier 6: Utilities, helpers, libs (Default middle-low)
    return 25


def format_file_ast_str(file_data: Dict[str, Any], abridged: bool = False) -> str:
    """Formats a single file's AST skeleton into context string."""
    path = file_data.get("file_path", "")
    classes = file_data.get("classes", [])
    functions = file_data.get("functions", [])

    lines = [f"\nFile: {path}"]
    for c in classes:
        bases = ", ".join(c.get("inherits_from", [])) or "None"
        multi_tag = " [MULTIPLE INHERITANCE]" if len(c.get("inherits_from", [])) > 1 else ""
        if abridged:
            # Drop docstrings and limit method lists to fit tightly in context
            methods = ", ".join([m["name"] for m in c.get("methods", [])[:2]])
            lines.append(f"  - Class: {c['name']}{multi_tag} (Inherits: [{bases}]) Methods: [{methods}]")
        else:
            methods = ", ".join([m["name"] for m in c.get("methods", [])])
            lines.append(f"  - Class: {c['name']}{multi_tag} (Inherits: [{bases}]) Doc: {c.get('docstring','')[:80]} Methods: [{methods}]")

    for f in functions:
        if abridged:
            lines.append(f"  - Function: {f['name']}()")
        else:
            lines.append(f"  - Function: {f['name']}({', '.join(f.get('args',[]))}) Doc: {f.get('docstring','')[:80]}")

    return "\n".join(lines)


def protect_ast_payload(
    parsed_files: List[Dict[str, Any]],
    max_tokens: int = MAX_SAFE_TOKENS,
    reserved_overhead_tokens: int = 6000
) -> Tuple[List[Dict[str, Any]], str, Dict[str, Any]]:
    """
    Ranks files by importance and enforces a hard safe token threshold.
    Returns:
      (retained_files, ast_context_str, metadata_stats)
    """
    available_ast_tokens = max(1000, max_tokens - reserved_overhead_tokens)

    # 1. Rank parsed files descending by architectural importance
    scored_files = []
    for f in parsed_files:
        score = get_file_importance_score(f.get("file_path", ""))
        scored_files.append((score, f))

    # Sort descending by score; secondary sort by class count (more classes = higher value)
    scored_files.sort(key=lambda x: (x[0], len(x[1].get("classes", []))), reverse=True)

    retained_files = []
    dropped_files = []
    ast_chunks = []
    current_tokens = 0

    for score, file_data in scored_files:
        path = file_data.get("file_path", "")
        full_chunk = format_file_ast_str(file_data, abridged=False)
        chunk_tokens = estimate_tokens(full_chunk)

        if current_tokens + chunk_tokens <= available_ast_tokens:
            retained_files.append(file_data)
            ast_chunks.append(full_chunk)
            current_tokens += chunk_tokens
        else:
            # Try abridged format
            abridged_chunk = format_file_ast_str(file_data, abridged=True)
            abridged_tokens = estimate_tokens(abridged_chunk)
            if current_tokens + abridged_tokens <= available_ast_tokens:
                retained_files.append(file_data)
                ast_chunks.append(abridged_chunk)
                current_tokens += abridged_tokens
            else:
                dropped_files.append(path)

    stats = {
        "total_parsed_files": len(parsed_files),
        "retained_files_count": len(retained_files),
        "dropped_files_count": len(dropped_files),
        "estimated_ast_tokens": current_tokens,
        "token_limit": max_tokens,
        "is_truncated": len(dropped_files) > 0,
        "dropped_files_sample": dropped_files[:5]
    }

    if dropped_files:
        print(
            f"[Token Guard Alert] AST payload exceeded budget! Retained {len(retained_files)} priority files "
            f"({current_tokens} tokens). Truncated {len(dropped_files)} lower-priority files to respect safe limit ({max_tokens})."
        )
        ast_chunks.append(
            f"\n[TOKEN OVERFLOW PROTECTION ACTIVE]: Preserved {len(retained_files)} critical modules. "
            f"Truncated {len(dropped_files)} auxiliary/test files to maintain strict {max_tokens} context limit."
        )

    ast_context_str = "".join(ast_chunks)
    return retained_files, ast_context_str, stats
