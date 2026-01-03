#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per generare i file HTML degli approfondimenti dal documento markdown
"""

import re
import os

# Template HTML base
HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{description}">
  <title>{title}</title>
  
  <!-- Schema.org Markup -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{title}",
    "description": "{description}",
    "author": {{
      "@type": "Organization",
      "name": "Stili di Attaccamento Wiki"
    }}
  }}
  </script>
  
  <link rel="stylesheet" href="../css/main.css">
  <link rel="stylesheet" href="../css/themes.css">
</head>
<body>
  <header>
    <nav class="container">
      <div class="logo"><a href="../index.html">Stili di Attaccamento</a></div>
      <ul class="nav-links">
        <li><a href="../fondamenti.html">Fondamenti</a></li>
        <li><a href="../modello-gradienti.html">Modello a Gradienti</a></li>
        <li><a href="../archetipi.html">Archetipi</a></li>
        <li><a href="../stili-base.html">4 Stili Base</a></li>
        <li><a href="../test.html">Test</a></li>
        <li><a href="../approfondimenti.html">Approfondimenti</a></li>
      </ul>
      <button class="theme-toggle" onclick="toggleTheme()">☀️ Light</button>
    </nav>
  </header>

  <main>
    <section class="section">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="../index.html">Home</a>
          <span>›</span>
          <a href="../approfondimenti.html">Approfondimenti</a>
          <span>›</span>
          <span>{short_title}</span>
        </nav>
        
        <h1>{title}</h1>
        
        {content}
        
        <!-- Navigazione -->
        <div class="card mt-8">
          <h3>Altri Approfondimenti</h3>
          <p><a href="../approfondimenti.html">← Torna all'indice degli Approfondimenti</a></p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2024 Stili di Attaccamento Wiki. Tutti i diritti riservati.</p>
    </div>
  </footer>

  <script src="../js/theme.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>'''

def markdown_to_html(markdown_text):
    """Converte markdown base in HTML"""
    html = markdown_text
    
    # Headers
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^#### (.+)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    html = re.sub(r'^##### (.+)$', r'<h5>\1</h5>', html, flags=re.MULTILINE)
    
    # Bold
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    
    # Lists
    html = re.sub(r'^- (.+)$', r'<li style="margin-bottom: var(--spacing-2);">\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'(\n<li[^>]*>.*?</li>)', r'<ul style="margin-left: var(--spacing-6); margin-top: var(--spacing-4);">\1</ul>', html, flags=re.DOTALL)
    
    # Paragraphs
    lines = html.split('\n')
    result = []
    in_list = False
    for line in lines:
        if line.strip().startswith('<li') or line.strip().startswith('<ul'):
            if not in_list:
                in_list = True
            result.append(line)
        elif line.strip().startswith('</ul'):
            in_list = False
            result.append(line)
        elif line.strip() and not line.strip().startswith('<'):
            if not in_list:
                result.append(f'<p>{line.strip()}</p>')
            else:
                result.append(line)
        else:
            result.append(line)
    
    html = '\n'.join(result)
    
    # Cards
    html = re.sub(r'<h3>(.+?)</h3>', r'<div class="card mb-6"><h3>\1</h3>', html)
    
    return html

def extract_approfondimenti():
    """Estrae gli approfondimenti dal documento markdown"""
    with open('docs/10-approfondimenti-tematici.md', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Estrai ogni approfondimento
    pattern = r'## APPROFONDIMENTO \d+: (.+?)(?=## APPROFONDIMENTO|\Z)'
    matches = re.findall(pattern, content, re.DOTALL)
    
    approfondimenti = []
    for i, match in enumerate(matches, 1):
        lines = match.strip().split('\n')
        title = lines[0].strip()
        
        # Trova introduzione
        intro_idx = None
        for j, line in enumerate(lines):
            if '### Introduzione' in line:
                intro_idx = j
                break
        
        if intro_idx:
            intro = '\n'.join(lines[intro_idx+1:]).strip()
            # Rimuovi separatori
            intro = re.sub(r'^---\s*$', '', intro, flags=re.MULTILINE)
        else:
            intro = match.strip()
        
        approfondimenti.append({
            'number': i,
            'title': title,
            'content': intro,
            'slug': title.lower()
                .replace('attaccamento e ', '')
                .replace(' ', '-')
                .replace('/', '-')
                .replace('(', '')
                .replace(')', '')
                .replace('relazioni con genitori da adulti', 'famiglia')
                .replace('gravidanza/paternità/maternità', 'genitorialita')
                .replace('perdita/', '')
                .replace('guarigione/', 'crescita')
        })
    
    return approfondimenti

def main():
    approfondimenti = extract_approfondimenti()
    
    output_dir = 'public/approfondimenti'
    os.makedirs(output_dir, exist_ok=True)
    
    for app in approfondimenti:
        # Converti markdown a HTML
        html_content = markdown_to_html(app['content'])
        
        # Wrappa in cards per ogni sezione
        html_content = re.sub(r'### (SECURE|ANSIOSO|EVITANTE|DISORGANIZZATO)', 
                               r'</div><div class="card mb-6 profile-card \1-lower"><h3 class="color-\1-lower">\1', 
                               html_content)
        
        # Aggiungi card iniziale se non c'è
        if not html_content.strip().startswith('<div'):
            html_content = f'<div class="card mb-6">{html_content}</div>'
        
        # Genera HTML completo
        full_html = HTML_TEMPLATE.format(
            title=app['title'],
            short_title=app['title'].replace('ATTACCAMENTO E ', ''),
            description=f"Approfondimento su {app['title'].lower()}",
            content=html_content
        )
        
        # Salva file
        filename = f"{app['slug']}.html"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_html)
        
        print(f"Creato: {filepath}")

if __name__ == '__main__':
    main()

