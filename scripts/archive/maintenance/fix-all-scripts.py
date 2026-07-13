#!/usr/bin/env python3
"""
Script per spostare gli script template-loader.js e breadcrumb-generator.js
dal <head> a prima di </body> in tutti i file HTML
"""

import re
from pathlib import Path

def get_script_path(depth):
    """Ottiene il percorso degli script in base alla profondità"""
    if depth == 0:
        return "js/"
    else:
        return "../js/"

def fix_scripts_placement(filepath):
    """Sposta gli script template dal head al body"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Calcola profondità
    path = Path(filepath)
    parts = path.relative_to(Path("public")).parts
    depth = len(parts) - 1
    script_path = get_script_path(depth)
    
    # Pattern per trovare gli script template nel head
    # Cerca il commento e i due script
    template_scripts_pattern = r'\s*<!-- Scripts \(ordine importante: prima template-loader, poi breadcrumb-generator\) -->\s*<script src=["\'][^"\']*template-loader\.js["\']></script>\s*<script src=["\'][^"\']*breadcrumb-generator\.js["\']></script>'
    
    # Rimuovi dal head (se presente)
    content = re.sub(template_scripts_pattern, '', content, flags=re.DOTALL)
    
    # Verifica se gli script sono già presenti prima di </body>
    if f'template-loader.js' in content and content.find('template-loader.js') > content.find('</body>'):
        # Script sono già nel posto giusto
        return False
    
    # Verifica se esiste già un footer-placeholder (significa che abbiamo già processato)
    if 'footer-placeholder' not in content:
        return False
    
    # Trova </body> e inserisci gli script prima
    body_end_pattern = r'(</body>)'
    template_scripts = f'''  <!-- Scripts (ordine importante: prima template-loader, poi breadcrumb-generator) -->
  <script src="{script_path}template-loader.js"></script>
  <script src="{script_path}breadcrumb-generator.js"></script>'''
    
    if re.search(body_end_pattern, content):
        # Inserisci prima di </body>, ma solo se non sono già presenti prima
        if f'{script_path}template-loader.js' not in content or content.find(f'{script_path}template-loader.js') > content.find('</body>'):
            content = re.sub(
                body_end_pattern,
                template_scripts + '\n\\1',
                content,
                count=1
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
        if fix_scripts_placement(filepath):
            print(f"Fixed: {filepath}")
            fixed += 1
    
    print(f"\n✓ Fixed {fixed} files")

if __name__ == "__main__":
    main()


