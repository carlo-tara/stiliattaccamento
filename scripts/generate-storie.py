#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script per generare le pagine HTML delle storie reali dal documento markdown
"""

import re
import os

# Template HTML base per ogni storia
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
        <li><a href="../libri.html">Libri</a></li>
        <li><a href="../storie-reali.html">Storie Reali</a></li>
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
          <a href="../storie-reali.html">Storie Reali</a>
          <span>›</span>
          <span>{short_title}</span>
        </nav>
        
        <h1>{title}</h1>
        <p class="text-center mb-6" style="font-size: var(--font-size-lg); color: var(--color-text-secondary);">
          <strong>Profilo:</strong> {profilo}
        </p>
        
        {content}
        
        <!-- Navigazione -->
        <div class="card mt-8">
          <h3>Altre Storie</h3>
          <p><a href="../storie-reali.html">← Torna all'indice delle Storie Reali</a></p>
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

def extract_storie():
    """Estrae le storie dal file markdown"""
    with open('docs/storie-reali-consapevolezza.md', 'r', encoding='utf-8') as f:
        content = f.read()
    
    storie = []
    
    # Pattern per trovare ogni storia: ## STORIA N: NOME - DESCRIZIONE
    pattern = r'## STORIA (\d+): ([^-]+) - (.+?)(?=## STORIA|\Z)'
    
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    for match in matches:
        num = int(match.group(1))
        nome = match.group(2).strip()
        descrizione = match.group(3).strip()
        storia_content = match.group(0)
        
        # Estrai profilo (pulito, senza markdown)
        profilo_match = re.search(r'\*\*Il Profilo\*\*: (.+?)(?=\n\n|\*\*|###)', storia_content, re.DOTALL)
        profilo_raw = profilo_match.group(1).strip() if profilo_match else ""
        # Rimuovi markdown dal profilo
        profilo = re.sub(r'\*\*', '', profilo_raw)
        profilo = re.sub(r'^- ', '', profilo, flags=re.MULTILINE)
        profilo = profilo.replace('\n', ' ')
        
        # Estrai metafora (se presente)
        metafora_match = re.search(r'\*\*La Metafora\*\*: (.+?)(?=\n\n|###)', storia_content)
        metafora = metafora_match.group(1).strip() if metafora_match else ""
        
        # Estrai sezioni
        situazione_match = re.search(r'### LA SITUAZIONE INIZIALE\n(.*?)(?=### LA PRIMA CONSAPEVOLEZZA|\Z)', storia_content, re.DOTALL)
        situazione = situazione_match.group(1).strip() if situazione_match else ""
        
        consapevolezza_match = re.search(r'### LA PRIMA CONSAPEVOLEZZA\n(.*?)(?=### IL VIAGGIO DI CONSAPEVOLEZZA|\Z)', storia_content, re.DOTALL)
        consapevolezza = consapevolezza_match.group(1).strip() if consapevolezza_match else ""
        
        viaggio_match = re.search(r'### IL VIAGGIO DI CONSAPEVOLEZZA\n(.*?)(?=### COSA CAMBIÓ|\Z)', storia_content, re.DOTALL)
        viaggio = viaggio_match.group(1).strip() if viaggio_match else ""
        
        cambio_match = re.search(r'### COSA CAMBIÓ \(senza "guarire"\)\n(.*?)(?=---|\Z)', storia_content, re.DOTALL)
        cambio = cambio_match.group(1).strip() if cambio_match else ""
        
        title = f"{nome} - {descrizione}"
        slug = nome.lower().replace(' ', '-').replace('/', '-')
        
        storie.append({
            'num': num,
            'nome': nome,
            'descrizione': descrizione,
            'title': title,
            'short_title': nome,
            'slug': slug,
            'profilo': profilo,
            'metafora': metafora,
            'situazione': situazione,
            'consapevolezza': consapevolezza,
            'viaggio': viaggio,
            'cambio': cambio
        })
    
    return storie

def markdown_to_html(text):
    """Converte testo markdown base in HTML"""
    if not text:
        return ""
    
    html = text
    
    # Rimuovi separatori markdown
    html = re.sub(r'^---\s*$', '', html, flags=re.MULTILINE)
    
    # Headers (prima di tutto)
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^#### (.+)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    
    # Bold (prima delle liste)
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    
    # Liste numerate e puntate
    lines = html.split('\n')
    result = []
    in_ol = False
    in_ul = False
    
    for line in lines:
        line_stripped = line.strip()
        
        # Skip empty lines
        if not line_stripped:
            if in_ol:
                result.append('</ol>')
                in_ol = False
            if in_ul:
                result.append('</ul>')
                in_ul = False
            result.append('')
            continue
        
        # Numbered list
        if re.match(r'^\d+\.\s+', line_stripped):
            if in_ul:
                result.append('</ul>')
                in_ul = False
            if not in_ol:
                result.append('<ol style="margin-left: var(--spacing-6); margin-top: var(--spacing-4);">')
                in_ol = True
            content = re.sub(r'^\d+\.\s+', '', line_stripped)
            result.append(f'<li style="margin-bottom: var(--spacing-2);">{content}</li>')
        # Bullet list
        elif re.match(r'^-\s+', line_stripped):
            if in_ol:
                result.append('</ol>')
                in_ol = False
            if not in_ul:
                result.append('<ul style="margin-left: var(--spacing-6); margin-top: var(--spacing-4);">')
                in_ul = True
            content = re.sub(r'^-\s+', '', line_stripped)
            result.append(f'<li style="margin-bottom: var(--spacing-2);">{content}</li>')
        # Regular line
        else:
            if in_ol:
                result.append('</ol>')
                in_ol = False
            if in_ul:
                result.append('</ul>')
                in_ul = False
            # Already a header?
            if line_stripped.startswith('<h'):
                result.append(line_stripped)
            else:
                result.append(f'<p>{line_stripped}</p>')
    
    if in_ol:
        result.append('</ol>')
    if in_ul:
        result.append('</ul>')
    
    html = '\n'.join(result)
    
    return html

def main():
    storie = extract_storie()
    
    output_dir = 'public/storie-reali'
    os.makedirs(output_dir, exist_ok=True)
    
    for storia in storie:
        # Costruisci il contenuto HTML
        content_parts = []
        
        # Metafora (se presente)
        if storia['metafora']:
            content_parts.append('<div class="card mb-6" style="background: linear-gradient(135deg, rgba(168, 213, 186, 0.1) 0%, rgba(168, 213, 186, 0.05) 100%);">')
            content_parts.append(f'<p style="font-style: italic; font-size: var(--font-size-lg);"><strong>Metafora:</strong> {storia["metafora"]}</p>')
            content_parts.append('</div>')
        
        # Situazione Iniziale
        if storia['situazione']:
            content_parts.append('<div class="card mb-6">')
            content_parts.append('<h2>La Situazione Iniziale</h2>')
            content_parts.append(markdown_to_html(storia['situazione']))
            content_parts.append('</div>')
        
        # Prima Consapevolezza
        if storia['consapevolezza']:
            content_parts.append('<div class="card mb-6 profile-card secure">')
            content_parts.append('<h2 class="color-secure">La Prima Consapevolezza</h2>')
            content_parts.append(markdown_to_html(storia['consapevolezza']))
            content_parts.append('</div>')
        
        # Viaggio di Consapevolezza
        if storia['viaggio']:
            content_parts.append('<div class="card mb-6">')
            content_parts.append('<h2>Il Viaggio di Consapevolezza</h2>')
            content_parts.append(markdown_to_html(storia['viaggio']))
            content_parts.append('</div>')
        
        # Cosa Cambiò
        if storia['cambio']:
            content_parts.append('<div class="card mb-6" style="border-left: 4px solid var(--color-accent-secure);">')
            content_parts.append('<h2>Cosa Cambiò (senza "guarire")</h2>')
            content_parts.append(markdown_to_html(storia['cambio']))
            content_parts.append('</div>')
        
        content_html = '\n'.join(content_parts)
        
        # Genera HTML completo
        full_html = HTML_TEMPLATE.format(
            title=storia['title'],
            short_title=storia['short_title'],
            profilo=storia['profilo'],
            description=f"Storia reale anonimizzata di {storia['nome']} - {storia['descrizione']}. Viaggio di consapevolezza attraverso l'attaccamento.",
            content=content_html
        )
        
        # Salva file
        filename = f"{storia['slug']}.html"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(full_html)
        
        print(f"Creato: {filepath}")

if __name__ == '__main__':
    main()

