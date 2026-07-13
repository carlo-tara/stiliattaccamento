#!/usr/bin/env python3
"""
Script per aggiungere gli script template-loader e breadcrumb-generator
nei file che hanno i placeholder ma non hanno gli script
"""

import re
from pathlib import Path

def get_script_path(depth):
    """Ottiene il percorso degli script in base alla profondità"""
    if depth == 0:
        return "js/"
    else:
        return "../js/"

def add_missing_scripts(filepath):
    """Aggiunge gli script template se mancanti"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Calcola profondità
    path = Path(filepath)
    parts = path.relative_to(Path("public")).parts
    depth = len(parts) - 1
    script_path = get_script_path(depth)
    
    # Verifica se ha footer-placeholder (significa che è stato processato)
    if 'footer-placeholder' not in content:
        return False
    
    # Verifica se gli script template sono già presenti
    if f'{script_path}template-loader.js' in content:
        return False
    
    # Template per gli script
    template_scripts = f'''  <!-- Scripts (ordine importante: prima template-loader, poi breadcrumb-generator) -->
  <script src="{script_path}template-loader.js"></script>
  <script src="{script_path}breadcrumb-generator.js"></script>'''
    
    # Trova dove inserire (prima del primo script esistente o prima di </body>)
    first_script_pattern = r'(<script\s+src=["\'][^"\']*\.js["\']>)'
    
    if re.search(first_script_pattern, content):
        # Inserisci prima del primo script esistente
        content = re.sub(
            first_script_pattern,
            template_scripts + '\n  \\1',
            content,
            count=1
        )
    else:
        # Se non ci sono script, inserisci prima di </body>
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
        if add_missing_scripts(filepath):
            print(f"Fixed: {filepath}")
            fixed += 1
    
    print(f"\n✓ Fixed {fixed} files")

if __name__ == "__main__":
    main()


