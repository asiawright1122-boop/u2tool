#!/usr/bin/env python3
"""
Generate translation files using deep-translator with multithreading.
This handles large files better by running translations in parallel.
Supports processing a single language via --lang argument.
"""

import json
import sys
import time
import argparse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from deep_translator import GoogleTranslator

# Language configurations
LANGUAGES = {
    'es': 'Spanish',
    'pt': 'Portuguese',
    'ja': 'Japanese',
    'ru': 'Russian',
    'fr': 'French',
    'ar': 'Arabic',
    'de': 'German',
    'ko': 'Korean',
    'zh': 'Chinese (Simplified)'
}

def load_source(source_path):
    with open(source_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def collect_strings(data, container):
    """Collect all string values into a list"""
    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, str):
                if v.strip() and len(v) > 1:
                    container.append({'parent': data, 'key': k, 'value': v})
            else:
                collect_strings(v, container)
    elif isinstance(data, list):
        for i, v in enumerate(data):
            if isinstance(v, str):
                if v.strip() and len(v) > 1:
                    container.append({'parent': data, 'key': i, 'value': v})
            else:
                collect_strings(v, container)

def translate_item(item, source_lang, target_lang):
    """Translate a single item"""
    try:
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        # Retry logic
        for attempt in range(3):
            try:
                text = item['value']
                translated = translator.translate(text)
                return (item, translated)
            except Exception as e:
                time.sleep(1)
                if attempt == 2:
                    return (item, item['value']) # Fallback to original
    except Exception:
        return (item, item['value'])

def save_translation(data, target_path):
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ Created: {target_path}")

def main(target_langs=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('--lang', nargs='*', help='Target language code(s) (e.g. es pt). If not specified, all languages will be translated.')
    args = parser.parse_args()

    messages_dir = Path(__file__).parent.parent / 'src' / 'messages'
    source_file = messages_dir / 'en.json'
    
    if not source_file.exists():
        print(f"Error: missing {source_file}")
        sys.exit(1)
    
    # Determine target languages
    targets = {}
    if args.lang: # If --lang is provided
        for lang_code in args.lang:
            if lang_code not in LANGUAGES:
                print(f"Error: Invalid language code '{lang_code}'. Available languages: {', '.join(LANGUAGES.keys())}")
                sys.exit(1)
            targets[lang_code] = LANGUAGES[lang_code]
    else: # If --lang is not provided, translate all
        targets = LANGUAGES

    print(f"Loading source: {source_file}")
    source_data = load_source(source_file)
    
    # Pre-collect structure to count
    container = []
    collect_strings(source_data, container)
    total_items = len(container)
    print(f"Found {total_items} strings.")
    
    for lang_code, lang_name in targets.items():
        target_file = messages_dir / f'{lang_code}.json'
        
        # Check existence? Maybe force overwrite if running effectively
        if target_file.exists():
             print(f"⚠ Overwriting {lang_code}.json")
            
        print(f"\nTranslating to {lang_name} ({lang_code})...")
        
        # Deep copy structure
        current_data = json.loads(json.dumps(source_data))
        current_container = []
        collect_strings(current_data, current_container)
        
        target_code = lang_code
        if lang_code == 'zh':
            target_code = 'zh-CN'
        
        # Multithreaded translation
        start_time = time.time()
        completed = 0
        
        # Increased workers to 50 for max speed
        with ThreadPoolExecutor(max_workers=50) as executor:
            # Submit all tasks
            futures = [executor.submit(translate_item, item, 'en', target_code) for item in current_container]
            
            for future in as_completed(futures):
                item, result = future.result()
                # Update in place
                item['parent'][item['key']] = result
                
                completed += 1
                if completed % 500 == 0:
                    elapsed = time.time() - start_time
                    rate = completed / elapsed
                    print(f"  {completed}/{total_items} ({rate:.1f} items/sec)")
        
        save_translation(current_data, target_file)

if __name__ == '__main__':
    import sys
    target_langs = sys.argv[1:] if len(sys.argv) > 1 else None
    main(target_langs)
