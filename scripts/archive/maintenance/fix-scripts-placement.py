#!/usr/bin/env python3
"""
Script per spostare gli script template-loader.js e breadcrumb-generator.js
dal <head> a prima di </body>
"""

import re
from pathlib import Path

def fix_scripts_placement(filepath):
    """Sposta gli script template dal head al body"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Trova gli script template-loader e breadcrumb-generator nel head
    template_scripts_pattern = r'(\s*<!-- Scripts \(ordine importante: prima template-loader, poi breadcrumb-generator\) -->\s*<script src=["\'][^"\']*template-loader\.js["\']></script>\s*<script src=["\'][^"\']*breadcrumb-generator\.js["\']></script>)'
    
    match = re.search(template_scripts_pattern, content)
    if match:
        scripts_text = match.group(1)
        
        # Rimuovi dal head
        content = content.replace(scripts_text, '')
        
        # Aggiungi prima di </body>, ma solo se non sono già presenti
        if 'template-loader.js' not in content or content.find('template-loader.js') < content.find('</body>'):
            # Inserisci prima di </body>
            content = re.sub(
                r'(</body>)',
                scripts_text + '\n\\1',
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
        if fix_scripts_placement(filepath):
            print(f"Fixed: {filepath}")
            fixed += 1
    
    print(f"\n✓ Fixed {fixed} files")

if __name__ == "__main__":
    main()


