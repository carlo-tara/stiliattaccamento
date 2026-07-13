#!/usr/bin/env python3
"""
Script per applicare il sistema di template dinamici a tutte le pagine HTML
"""

import re
import os
from pathlib import Path

# Percorsi relativi degli script in base alla profondità
SCRIPT_PATHS = {
    0: "js/",  # Root: js/
    1: "../js/",  # Sottodirectory: ../js/
}

def get_depth(filepath):
    """Calcola la profondità del file rispetto a public/"""
    path = Path(filepath)
    # Conta le directory tra public/ e il file (escludendo public stesso)
    parts = path.relative_to(Path("public")).parts
    return len(parts) - 1  # -1 perché il nome del file non conta

def remove_breadcrumb(content):
    """Rimuove i breadcrumb esistenti dal contenuto"""
    # Pattern per trovare breadcrumb: <nav class="breadcrumb" ...>...</nav>
    # Pattern multiline per catturare tutto il breadcrumb
    pattern = r'<nav\s+class="breadcrumb"[^>]*>.*?</nav>'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # Rimuovi anche eventuali spazi extra dopo la rimozione
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    return content

def replace_header(content, depth):
    """Sostituisce l'header con placeholder"""
    # Pattern per trovare l'header completo
    # Cerchiamo dall'inizio di <header> fino alla fine di </header>
    pattern = r'<header>.*?</header>'
    replacement = '''  <!-- Placeholder per header -->
  <div id="header-placeholder"></div>
  
  <!-- Placeholder per topbar (breadcrumb) -->
  <div id="topbar-placeholder"></div>'''
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    return content

def replace_footer(content, depth):
    """Sostituisce il footer con placeholder"""
    # Pattern per trovare il footer completo
    pattern = r'<footer>.*?</footer>'
    replacement = '  <!-- Placeholder per footer -->\n  <div id="footer-placeholder"></div>'
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    return content

def add_template_scripts(content, depth):
    """Aggiunge gli script template-loader.js e breadcrumb-generator.js"""
    script_path = SCRIPT_PATHS.get(depth, "../js/")
    
    # Template per i nuovi script
    template_scripts = f'''  <!-- Scripts (ordine importante: prima template-loader, poi breadcrumb-generator) -->
  <script src="{script_path}template-loader.js"></script>
  <script src="{script_path}breadcrumb-generator.js"></script>'''
    
    # Cerchiamo dove inserire gli script (prima di altri script esistenti)
    # Pattern per trovare il primo script tag
    script_pattern = r'(<script\s+src=["\'][^"\']*\.js["\']>)'
    
    if re.search(script_pattern, content):
        # Inserisci prima del primo script
        content = re.sub(
            script_pattern,
            template_scripts + '\n  \\1',
            content,
            count=1
        )
    else:
        # Se non ci sono script, aggiungi prima di </body>
        content = re.sub(
            r'(</body>)',
            template_scripts + '\n\\1',
            content
        )
    
    return content

def process_file(filepath):
    """Processa un singolo file HTML"""
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    depth = get_depth(filepath)
    
    # 1. Rimuovi breadcrumb esistenti
    content = remove_breadcrumb(content)
    
    # 2. Sostituisci header con placeholder
    content = replace_header(content, depth)
    
    # 3. Sostituisci footer con placeholder
    content = replace_footer(content, depth)
    
    # 4. Aggiungi script template (prima degli altri script)
    content = add_template_scripts(content, depth)
    
    # Scrivi il file modificato
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Updated (depth: {depth})")

def main():
    """Processa tutti i file HTML in public/"""
    public_dir = Path("public")
    
    # Trova tutti i file HTML (esclusi template)
    html_files = list(public_dir.rglob("*.html"))
    html_files = [f for f in html_files if "templates" not in str(f)]
    
    # Escludi index.html che è già stato aggiornato
    html_files = [f for f in html_files if f.name != "index.html"]
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    for filepath in sorted(html_files):
        try:
            process_file(filepath)
        except Exception as e:
            print(f"  ✗ Error: {e}")
    
    print(f"\n✓ Processed {len(html_files)} files")

if __name__ == "__main__":
    main()


