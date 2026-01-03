#!/usr/bin/env python3
"""
Script per rimuovere gli script template-loader e breadcrumb-generator dal <head>
(devono essere solo prima di </body>)
"""

import re
from pathlib import Path

def remove_duplicate_scripts(filepath):
    """Rimuove gli script template dal head"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Pattern per trovare gli script template nel <head>
    # Cerca tra <head> e </head>
    head_pattern = r'(<head>.*?)(\s*<!-- Scripts \(ordine importante: prima template-loader, poi breadcrumb-generator\) -->\s*<script src=["\'][^"\']*template-loader\.js["\']></script>\s*<script src=["\'][^"\']*breadcrumb-generator\.js["\']></script>)(.*?</head>)'
    
    def remove_from_head(match):
        before = match.group(1)
        scripts = match.group(2)
        after = match.group(3)
        return before + after
    
    content = re.sub(head_pattern, remove_from_head, content, flags=re.DOTALL)
    
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
        if remove_duplicate_scripts(filepath):
            print(f"Fixed: {filepath}")
            fixed += 1
    
    print(f"\n✓ Fixed {fixed} files")

if __name__ == "__main__":
    main()


