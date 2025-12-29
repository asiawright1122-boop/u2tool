#!/usr/bin/env python3
"""
Translate only missing/untranslated strings in translation files.
This script identifies strings that are identical to English and translates only those.
Preserves existing translations.

Usage:
  python scripts/translate-missing.py --lang zh      # Translate missing Chinese strings
  python scripts/translate-missing.py --lang all    # Translate all languages
  python scripts/translate-missing.py --dry-run     # Show what would be translated
"""

import json
import sys
import time
import argparse
import re
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("Error: deep-translator not installed. Run: pip install deep-translator")
    sys.exit(1)

# Language configurations
LANGUAGES = {
    'zh': {'name': 'Chinese (Simplified)', 'code': 'zh-CN'},
    'es': {'name': 'Spanish', 'code': 'es'},
    'pt': {'name': 'Portuguese', 'code': 'pt'},
    'ja': {'name': 'Japanese', 'code': 'ja'},
    'ru': {'name': 'Russian', 'code': 'ru'},
    'fr': {'name': 'French', 'code': 'fr'},
    'ar': {'name': 'Arabic', 'code': 'ar'},
    'de': {'name': 'German', 'code': 'de'},
    'ko': {'name': 'Korean', 'code': 'ko'},
}

# Keys that should NOT be translated (technical terms, brand names, etc.)
SKIP_PATTERNS = [
    r'^tools\.[^.]+\.seo_title$',  # SEO titles need manual review
    r'^tools\.[^.]+\.seo_description$',  # SEO descriptions need manual review
]

# Values that should remain in English
SKIP_VALUES = [
    'ToolBox',
    'JSON', 'XML', 'HTML', 'CSS', 'YAML', 'TOML', 'CSV', 'TSV',
    'Base64', 'Base32', 'Base58', 'Base85',
    'MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'SHA-384',
    'UUID', 'GUID', 'JWT', 'HMAC', 'TOTP',
    'RGB', 'HEX', 'HSL', 'HSV', 'CMYK',
    'URL', 'URI', 'IP', 'IPv4', 'IPv6', 'DNS', 'CIDR',
    'QR', 'PNG', 'JPG', 'GIF', 'SVG', 'WebP',
    'UTF-8', 'ASCII', 'Unicode',
]

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(data, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_all_paths(obj, prefix=''):
    """Get all key paths and their values"""
    paths = {}
    if isinstance(obj, dict):
        for k, v in obj.items():
            full_key = f"{prefix}.{k}" if prefix else k
            if isinstance(v, str):
                paths[full_key] = v
            elif isinstance(v, dict):
                paths.update(get_all_paths(v, full_key))
    return paths

def set_nested_value(obj, key_path, value):
    """Set a value in a nested dict using dot notation"""
    keys = key_path.split('.')
    current = obj
    for key in keys[:-1]:
        current = current[key]
    current[keys[-1]] = value

def should_skip_key(key):
    """Check if a key should be skipped"""
    for pattern in SKIP_PATTERNS:
        if re.match(pattern, key):
            return True
    return False

def should_skip_value(value):
    """Check if a value should remain in English"""
    # Skip very short strings
    if len(value) <= 2:
        return True
    # Skip technical terms
    if value in SKIP_VALUES:
        return True
    # Skip strings that are all uppercase (likely acronyms)
    if value.isupper() and len(value) <= 10:
        return True
    # Skip strings that look like code/technical
    if re.match(r'^[A-Z][a-z]*[A-Z]', value):  # camelCase or PascalCase
        return True
    return False

def is_untranslated(en_value, target_value):
    """Check if a value needs translation (is same as English)"""
    if en_value == target_value:
        return True
    return False

def translate_text(text, target_code, retries=3):
    """Translate text with retry logic"""
    for attempt in range(retries):
        try:
            translator = GoogleTranslator(source='en', target=target_code)
            result = translator.translate(text)
            return result
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1)
            else:
                print(f"  ⚠ Failed to translate: {text[:50]}... Error: {e}")
                return text
    return text

def translate_batch(items, target_code, max_workers=3):
    """Translate a batch of items with rate limiting"""
    results = {}
    
    # Use fewer workers and add delays to avoid rate limiting
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_key = {}
        
        # Submit tasks with small delays
        for i, item in enumerate(items):
            future = executor.submit(translate_text, item['value'], target_code)
            future_to_key[future] = item['key']
            # Add small delay between submissions to avoid rate limiting
            if i % 5 == 4:
                time.sleep(1)
        
        completed = 0
        total = len(items)
        
        for future in as_completed(future_to_key):
            key = future_to_key[future]
            try:
                translated = future.result()
                results[key] = translated
            except Exception as e:
                print(f"  ⚠ Error translating {key}: {e}")
                # Keep original value on error
                results[key] = next(item['value'] for item in items if item['key'] == key)
            
            completed += 1
            if completed % 50 == 0:
                print(f"  Progress: {completed}/{total} ({completed*100//total}%)")
    
    return results

def main():
    parser = argparse.ArgumentParser(description='Translate missing strings in translation files')
    parser.add_argument('--lang', required=True, help='Target language code (zh, es, etc.) or "all"')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be translated without making changes')
    parser.add_argument('--limit', type=int, default=0, help='Limit number of translations (0 = no limit)')
    parser.add_argument('--include-seo', action='store_true', help='Include SEO titles and descriptions')
    args = parser.parse_args()
    
    messages_dir = Path(__file__).parent.parent / 'src' / 'messages'
    en_file = messages_dir / 'en.json'
    
    if not en_file.exists():
        print(f"Error: English source file not found: {en_file}")
        sys.exit(1)
    
    # Load English source
    print("Loading English source...")
    en_data = load_json(en_file)
    en_paths = get_all_paths(en_data)
    print(f"Found {len(en_paths)} translation keys")
    
    # Determine target languages
    if args.lang == 'all':
        targets = list(LANGUAGES.keys())
    else:
        if args.lang not in LANGUAGES:
            print(f"Error: Unknown language '{args.lang}'. Available: {', '.join(LANGUAGES.keys())}")
            sys.exit(1)
        targets = [args.lang]
    
    # Update skip patterns if including SEO
    global SKIP_PATTERNS
    if args.include_seo:
        SKIP_PATTERNS = []
    
    for lang in targets:
        lang_config = LANGUAGES[lang]
        target_file = messages_dir / f'{lang}.json'
        
        print(f"\n{'='*60}")
        print(f"Processing {lang_config['name']} ({lang})")
        print(f"{'='*60}")
        
        if not target_file.exists():
            print(f"  ⚠ Target file not found: {target_file}")
            continue
        
        # Load target language
        target_data = load_json(target_file)
        target_paths = get_all_paths(target_data)
        
        # Find untranslated strings
        to_translate = []
        for key, en_value in en_paths.items():
            target_value = target_paths.get(key)
            
            if target_value is None:
                continue  # Key doesn't exist in target
            
            if should_skip_key(key):
                continue
            
            if should_skip_value(en_value):
                continue
            
            if is_untranslated(en_value, target_value):
                to_translate.append({'key': key, 'value': en_value})
        
        print(f"  Found {len(to_translate)} untranslated strings")
        
        if args.limit > 0:
            to_translate = to_translate[:args.limit]
            print(f"  Limited to {len(to_translate)} strings")
        
        if args.dry_run:
            print(f"\n  Would translate (first 20):")
            for item in to_translate[:20]:
                print(f"    - {item['key']}: {item['value'][:50]}...")
            if len(to_translate) > 20:
                print(f"    ... and {len(to_translate) - 20} more")
            continue
        
        if not to_translate:
            print("  ✓ All strings are already translated!")
            continue
        
        # Translate
        print(f"\n  Translating {len(to_translate)} strings...")
        start_time = time.time()
        
        translations = translate_batch(to_translate, lang_config['code'])
        
        elapsed = time.time() - start_time
        print(f"  Completed in {elapsed:.1f}s ({len(translations)/elapsed:.1f} strings/sec)")
        
        # Update target data
        for key, translated in translations.items():
            set_nested_value(target_data, key, translated)
        
        # Save
        save_json(target_data, target_file)
        print(f"  ✓ Saved: {target_file}")

if __name__ == '__main__':
    main()
