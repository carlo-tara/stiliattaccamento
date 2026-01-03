#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per generare le pagine HTML degli approfondimenti sui libri dal PDF
"""

import re
import os

# Template HTML base per ogni libro
HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{description}">
  <title>{title} | Stili di Attaccamento Wiki</title>
  
  <!-- Schema.org Markup -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "{title}",
    "author": {{
      "@type": "Person",
      "name": "{author}"
    }},
    "datePublished": "{year}",
    "description": "{description}"
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
        <li><a href="../libri.html">Libri</a></li>
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
          <a href="../libri.html">Libri</a>
          <span>›</span>
          <span>{short_title}</span>
        </nav>
        
        <h1>{title}</h1>
        <p class="text-center mb-6" style="font-size: var(--font-size-lg); color: var(--color-text-secondary);">
          <strong>Autore:</strong> {author} | <strong>Anno:</strong> {year} | <strong>Tipo:</strong> {tipo} | <strong>Difficoltà:</strong> {difficolta}
        </p>
        
        {content}
        
        <!-- Navigazione -->
        <div class="card mt-8">
          <h3>Altri Libri</h3>
          <p><a href="../libri.html">← Torna all'indice dei Libri</a></p>
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

def extract_libri():
    """Estrae i libri dal file di testo"""
    with open('/tmp/libri_approfondimenti.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    libri = []
    
    # Pattern per trovare ogni libro
    # Cerca: numero. "TITOLO" - AUTORE (ANNO) o numero. "TITOLO" (SOTTOTITOLO) - AUTORE (ANNO)
    pattern = r'(\d+)\.\s*"([^"]+)"(?:\s*\(([^)]+)\))?\s*-\s*([^(]+)\((\d+)\)'
    
    matches = list(re.finditer(pattern, content, re.MULTILINE))
    
    for i, match in enumerate(matches):
        num = int(match.group(1))
        title = match.group(2).strip()
        subtitle = match.group(3).strip() if match.group(3) else None
        author = match.group(4).strip()
        year = match.group(5).strip()
        
        # Trova la fine del libro (inizio del prossimo o fine file)
        start_pos = match.end()
        if i + 1 < len(matches):
            end_pos = matches[i + 1].start()
        else:
            end_pos = len(content)
        
        libro_content = content[start_pos:end_pos].strip()
        
        # Estrai scheda libro
        scheda_match = re.search(r'Scheda Libro[^\n]*\n(.*?)(?=\nSintesi Teorica|\nApplicazione|\Z)', libro_content, re.DOTALL)
        scheda = scheda_match.group(1).strip() if scheda_match else ""
        
        # Estrai sintesi teorica
        sintesi_match = re.search(r'Sintesi Teorica\n(.*?)(?=\nApplicazione|\Z)', libro_content, re.DOTALL)
        sintesi = sintesi_match.group(1).strip() if sintesi_match else ""
        
        # Estrai applicazione pratica
        applicazione_match = re.search(r'Applicazione Pratica.*?\n(.*?)(?=\nApplicazioni Pratiche|\Z)', libro_content, re.DOTALL)
        applicazione = applicazione_match.group(1).strip() if applicazione_match else ""
        
        # Estrai applicazioni pratiche nel sito
        applicazioni_sito_match = re.search(r'Applicazioni Pratiche nel Sito\n(.*?)(?=\n\d+\.|\Z)', libro_content, re.DOTALL)
        applicazioni_sito = applicazioni_sito_match.group(1).strip() if applicazioni_sito_match else ""
        
        # Estrai tipo e difficoltà dalla scheda
        tipo_match = re.search(r'Tipo:\s*(.+)', scheda)
        tipo = tipo_match.group(1).strip() if tipo_match else "Non specificato"
        
        difficolta_match = re.search(r'Difficoltà:\s*(.+)', scheda)
        difficolta = difficolta_match.group(1).strip() if difficolta_match else "Non specificata"
        
        full_title = f"{title} ({subtitle})" if subtitle else title
        
        libri.append({
            'num': num,
            'title': full_title,
            'short_title': title,
            'author': author,
            'year': year,
            'tipo': tipo,
            'difficolta': difficolta,
            'scheda': scheda,
            'sintesi': sintesi,
            'applicazione': applicazione,
            'applicazioni_sito': applicazioni_sito,
            'slug': title.lower()
                .replace(' ', '-')
                .replace('?', '')
                .replace('(', '')
                .replace(')', '')
                .replace("'", '')
        })
    
    return libri

def markdown_to_html(text):
    """Converte testo base in HTML"""
    if not text:
        return ""
    
    html = text
    
    # Headers
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^#### (.+)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    html = re.sub(r'^##### (.+)$', r'<h5>\1</h5>', html, flags=re.MULTILINE)
    
    # Bold
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    
    # Numbered lists
    lines = html.split('\n')
    result = []
    in_list = False
    
    for line in lines:
        # Check if line starts with number and dot
        if re.match(r'^\d+\.\s+', line):
            if not in_list:
                result.append('<ol style="margin-left: var(--spacing-6); margin-top: var(--spacing-4);">')
                in_list = True
            # Remove number and add list item
            content = re.sub(r'^\d+\.\s+', '', line)
            result.append(f'<li style="margin-bottom: var(--spacing-2);">{content}</li>')
        else:
            if in_list:
                result.append('</ol>')
                in_list = False
            if line.strip():
                result.append(f'<p>{line.strip()}</p>')
            else:
                result.append('')
    
    if in_list:
        result.append('</ol>')
    
    html = '\n'.join(result)
    
    return html

def main():
    libri = extract_libri()
    
    output_dir = 'public/libri'
    os.makedirs(output_dir, exist_ok=True)
    
    for libro in libri:
        # Costruisci il contenuto HTML
        content_parts = []
        
        # Scheda Libro
        if libro['scheda']:
            content_parts.append('<div class="card mb-6">')
            content_parts.append('<h2>Scheda Libro</h2>')
            content_parts.append(markdown_to_html(libro['scheda']))
            content_parts.append('</div>')
        
        # Sintesi Teorica
        if libro['sintesi']:
            content_parts.append('<div class="card mb-6">')
            content_parts.append('<h2>Sintesi Teorica</h2>')
            content_parts.append(markdown_to_html(libro['sintesi']))
            content_parts.append('</div>')
        
        # Applicazione Pratica
        if libro['applicazione']:
            content_parts.append('<div class="card mb-6">')
            content_parts.append('<h2>Applicazione Pratica al Modello a Gradienti</h2>')
            content_parts.append(markdown_to_html(libro['applicazione']))
            content_parts.append('</div>')
        
        # Applicazioni Pratiche nel Sito
        if libro['applicazioni_sito']:
            content_parts.append('<div class="card mb-6">')
            content_parts.append('<h2>Applicazioni Pratiche nel Sito</h2>')
            content_parts.append(markdown_to_html(libro['applicazioni_sito']))
            content_parts.append('</div>')
        
        content_html = '\n'.join(content_parts)
        
        # Genera HTML completo
        full_html = HTML_TEMPLATE.format(
            title=libro['title'],
            short_title=libro['short_title'],
            author=libro['author'],
            year=libro['year'],
            tipo=libro['tipo'],
            difficolta=libro['difficolta'],
            description=f"Approfondimento su {libro['title']} di {libro['author']}",
            content=content_html
        )
        
        # Salva file
        filename = f"{libro['slug']}.html"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_html)
        
        print(f"Creato: {filepath}")

if __name__ == '__main__':
    main()

