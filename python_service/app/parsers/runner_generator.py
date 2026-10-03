import json
import re
from typing import Dict, List, Any

def generate_run_locally_commands(repo_url: str, repo_name: str, tree: List[Dict[str, Any]], files: Dict[str, str]) -> List[str]:
    """
    Parses manifest files (package.json, pom.xml, requirements.txt, etc.)
    and produces exact copyable terminal setup and execution commands.
    """
    folder_name = repo_name.split("/")[-1] if "/" in repo_name else repo_name
    clone_url = repo_url if repo_url.endswith(".git") else f"{repo_url}.git" if repo_url else f"https://github.com/{repo_name}.git"

    commands = [
        f"git clone {clone_url}",
        f"cd {folder_name}"
    ]

    file_paths = set(files.keys())
    for item in tree:
        if isinstance(item, dict) and 'path' in item:
            file_paths.add(item['path'])

    # 1. Node.js / JavaScript / TypeScript projects
    if 'package.json' in files:
        try:
            pkg_data = json.loads(files['package.json'])
            scripts = pkg_data.get('scripts', {})
            
            # Detect package manager
            if 'pnpm-lock.yaml' in file_paths:
                commands.append("pnpm install")
                if 'dev' in scripts:
                    commands.append("pnpm run dev")
                elif 'start' in scripts:
                    commands.append("pnpm start")
                else:
                    commands.append("pnpm start")
            elif 'yarn.lock' in file_paths:
                commands.append("yarn install")
                if 'dev' in scripts:
                    commands.append("yarn dev")
                elif 'start' in scripts:
                    commands.append("yarn start")
                else:
                    commands.append("yarn start")
            else:
                commands.append("npm install")
                if 'dev' in scripts:
                    commands.append("npm run dev")
                elif 'start' in scripts:
                    commands.append("npm start")
                elif 'build' in scripts:
                    commands.append("npm run build")
                else:
                    commands.append("node index.js")
            return commands
        except Exception:
            commands.extend(["npm install", "npm run dev"])
            return commands

    # 2. Python projects
    has_requirements = any('requirements.txt' in p for p in file_paths)
    has_pyproject = any('pyproject.toml' in p for p in file_paths)
    has_pipfile = any('Pipfile' in p for p in file_paths)
    
    if has_requirements or has_pyproject or has_pipfile or any(p.endswith('.py') for p in file_paths):
        commands.append("python -m venv venv")
        commands.append("source venv/bin/activate  # On Windows: venv\\Scripts\\activate")
        
        if has_requirements:
            commands.append("pip install -r requirements.txt")
        elif has_pyproject:
            commands.append("pip install .")
        elif has_pipfile:
            commands.append("pipenv install")
            
        # Detect main entry point
        if any(p == 'main.py' for p in file_paths):
            commands.append("python main.py")
        elif any(p == 'app.py' for p in file_paths):
            commands.append("python app.py")
        elif any(p == 'run.py' for p in file_paths):
            commands.append("python run.py")
        elif any(p == 'manage.py' for p in file_paths):
            commands.append("python manage.py runserver")
        else:
            commands.append("python main.py")
        return commands

    # 3. Java Maven / Gradle
    if any('pom.xml' in p for p in file_paths):
        commands.append("mvn clean install")
        commands.append("mvn spring-boot:run")
        return commands
    if any('build.gradle' in p for p in file_paths):
        commands.append("./gradlew build")
        commands.append("./gradlew bootRun")
        return commands

    # 4. Rust Cargo
    if any('Cargo.toml' in p for p in file_paths):
        commands.append("cargo build")
        commands.append("cargo run")
        return commands

    # 5. Go
    if any('go.mod' in p for p in file_paths):
        commands.append("go mod download")
        commands.append("go run main.go")
        return commands

    # Default generic commands
    commands.extend([
        "# Review README.md for custom build instructions",
        "npm install || pip install -r requirements.txt"
    ])
    return commands
