#!/usr/bin/env python3
"""
Smart translation script with deduplication, caching, and batching.
Uses:
1. Hardcoded high-quality dictionary (scripts/ui_dict.json)
2. Persistent local cache (scripts/translation_cache.json)
3. MyMemoryTranslator (API backup)
"""

import json
import os
import time
import random
from pathlib import Path
from deep_translator import MyMemoryTranslator

CACHE_FILE = Path(__file__).parent / 'translation_cache.json'
DICT_FILE = Path(__file__).parent / 'ui_dict.json'

# MyMemory requires specific codes for best results
LANG_MAP = {
    'es': 'es-ES',
    'pt': 'pt-PT',
    'ja': 'ja-JP',
    'ru': 'ru-RU',
    'fr': 'fr-FR',
    'ar': 'ar-SA',
    'de': 'de-DE',
    'ko': 'ko-KR'
}

BATCH_SIZE = 1  # MyMemory is better with single or very small batches for free tier to minimize "null" responses

def load_json(path):
    if path.exists():
        try:
            return json.load(open(path, 'r', encoding='utf-8'))
        except:
            return {}
    return {}

def save_cache(cache):
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

def flatten_collect(x, unique_set):
    if isinstance(x, dict):
        for v in x.values():
            flatten_collect(v, unique_set)
    elif isinstance(x, list):
        for v in x:
            flatten_collect(v, unique_set)
    elif isinstance(x, str):
        if x.strip() and len(x) > 1: # Skip single chars
            unique_set.add(x)

def translate_single(text, code):
    """Translate a single text.""" 
    try:
        # translator = MyMemoryTranslator(source='en', target=code)
        # res = translator.translate(text)
        # return res
        return None # Disable API for now to ensure dict application works
    except Exception as e:
        print(f"Translation failed for '{text}': {e}")
        return None

def main():
    # 1. Load source
    source_path = Path(__file__).parent.parent / 'src' / 'messages' / 'en.json'
    source_data = load_json(source_path)
    
    # 2. Collect unique strings
    unique_set = set()
    flatten_collect(source_data, unique_set)
    unique_list = sorted(list(unique_set))
    print(f"Total unique strings: {len(unique_list)}")
    
    # 3. Load caches
    cache = load_json(CACHE_FILE) 
    ui_dict = load_json(DICT_FILE)
    
    # Pre-populate cache with UI dict
    print(f"Pre-populating cache with {len(ui_dict)} hardcoded terms...")
    for term, trans_map in ui_dict.items():
        if term not in cache:
            cache[term] = {}
        for lang_code, trans_text in trans_map.items():
            cache[term][lang_code] = trans_text
            
    # 4. Process each language
    for lang in LANG_MAP:
        code = LANG_MAP[lang]
        print(f"\nProcessing {lang} ({code})...")
        
        # Identify missing
        missing = []
        for text in unique_list:
            if text not in cache:
                cache[text] = {}
            if lang not in cache[text]:
                # Skip very long text to save quota? No, user wants deep.
                # Skip if it looks like a key? (No space, lowercase) -> Optional heuristic
                missing.append(text)
        
        print(f"  Missing translations: {len(missing)}")
        
        if not missing:
            continue
            
        # Limit for demo/safety
        # Process in very small batches or single items
        count = 0
        MAX_ITEMS = 300 # Safety limit per run to avoid total ban. Can re-run script.
        
        for item in missing:
            if count >= MAX_ITEMS:
                print("  Reached safety limit. Stopping for this language.")
                break
                
            print(f"  Translating: {item[:30]}...")
            trans = translate_single(item, code)
            
            if trans:
                cache[item][lang] = trans
                count += 1
            else:
                # If None, maybe quota exceeded
                print("  Translation returned None. Quota might be exceeded.")
                continue

            # Save sporadically
            if count % 10 == 0:
                save_cache(cache)
            
            # Delay
            time.sleep(random.uniform(1.0, 3.0))

    save_cache(cache)

    # 5. Generate Files
    print("\nGenerating language files...")
    
    def reconstruct(x, lang):
        if isinstance(x, dict):
            return {k: reconstruct(v, lang) for k, v in x.items()}
        elif isinstance(x, list):
            return [reconstruct(v, lang) for v in x]
        elif isinstance(x, str):
            if x.strip():
                # Try exact match
                if x in cache and lang in cache[x]:
                    return cache[x][lang]
                # Try lowercase match
                x_lower = x.lower()
                if x_lower in cache and lang in cache[x_lower]:
                    return cache[x_lower][lang]
            return x # Fallback
        return x

    for lang in LANG_MAP:
        new_data = reconstruct(source_data, lang)
        target_file = Path(__file__).parent.parent / 'src' / 'messages' / f'{lang}.json'
        with open(target_file, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=2)
        print(f"  Written {target_file.name}")

if __name__ == '__main__':
    main()
