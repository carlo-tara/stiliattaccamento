#!/usr/bin/env python3
"""
Script per spostare gli script template-loader.js e breadcrumb-generator.js
PRIMA di tutti gli altri script (devono essere i primi)
"""

import re
from pathlib import Path

def get_script_path(depth):
    """Ottiene il percorso degli script in base alla profondità"""
    if depth == 0:
        return "js/"
    else:
        return "../js/"

def fix_scripts_order(filepath):
    """Sposta gli script template all'inizio, prima di tutti gli altri script"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Calcola profondità
    path = Path(filepath)
    parts = path.relative_to(Path("public")).parts
    depth = len(parts) - 1
    script_path = get_script_path(depth)
    
    # Pattern per trovare gli script template esistenti (dovunque siano)
    template_scripts_pattern = r'\s*<!-- Scripts \(ordine importante: prima template-loader, poi breadcrumb-generator\) -->\s*<script src=["\'][^"\']*template-loader\.js["\']></script>\s*<script src=["\'][^"\']*breadcrumb-generator\.js["\']></script>'
    
    # Rimuovi gli script template esistenti (se presenti)
    content = re.sub(template_scripts_pattern, '', content, flags=re.DOTALL)
    
    # Verifica se esiste footer-placeholder (significa che abbiamo già processato)
    if 'footer-placeholder' not in content:
        return False
    
    # Template per gli script template
    template_scripts = f'''  <!-- Scripts (ordine importante: prima template-loader, poi breadcrumb-generator) -->
  <script src="{script_path}template-loader.js"></script>
  <script src="{script_path}breadcrumb-generator.js"></script>'''
    
    # Trova dove inserire gli script (prima del primo script esistente o prima di </body>)
    # Pattern per trovare il primo script tag (escludendo template-loader e breadcrumb-generator)
    first_script_pattern = r'(<script\s+src=["\'][^"\']*(?!template-loader|breadcrumb-generator)[^"\']*\.js["\']>)'
    
    if re.search(first_script_pattern, content):
        # Inserisci prima del primo script esistente
        content = re.sub(
            first_script_pattern,
            template_scripts + '\n  \\1',
            content,
            count=1
        )
    else:
        # Se non ci sono altri script, inserisci prima di </body>
        content = re.sub(
            r'(</body>)',
            template_scripts + '\n\\1',
            content
        )
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    public_dir = Path("public")
    html_files = list(public_dir.rglob("*.html"))
    html_files = [f for f in html_files if "templates" not in str(f)]
    
    fixed = 0
    for filepath in sorted(html_files):
        if fix_scripts_order(filepath):
            print(f"Fixed: {filepath}")
            fixed += 1
    
    print(f"\n✓ Fixed {fixed} files")

if __name__ == "__main__":
    main()


