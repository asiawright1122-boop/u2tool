#!/usr/bin/env python3
"""
Sync tools from src/config/tools.ts to src/messages/en.json.
This script ensures every tool has an entry in the English translation file.
"""

import json
import re
from pathlib import Path

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(data, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def to_title_case(slug):
    # Convert "bar-chart-generator" to "Bar Chart Generator"
    return ' '.join(word.capitalize() for word in slug.split('-'))

def main():
    base_dir = Path(__file__).parent.parent
    tools_config_path = base_dir / 'src' / 'config' / 'tools.ts'
    en_json_path = base_dir / 'src' / 'messages' / 'en.json'
    ui_dict_path = base_dir / 'scripts' / 'ui_dict.json'

    # 1. Extract slugs from tools.ts
    with open(tools_config_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find slugs: { slug: 'foo-bar', ... }
    # Handles both single and double quotes
    slugs = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", content)
    print(f"Found {len(slugs)} tools in config.")

    # 2. Load existing data
    en_data = load_json(en_json_path)
    ui_dict = load_json(ui_dict_path)

    if 'tools' not in en_data:
        en_data['tools'] = {}

    tools_dict = en_data['tools']
    added_count = 0
    updated_count = 0

    # 3. Create a lookup map from ui_dict for potential names
    # ui_dict format: "Bar Chart Generator": { ... }
    # We can try to match the Title Case slug to these keys
    ui_name_map = {k.lower(): k for k in ui_dict.keys()}

    for slug in slugs:
        tool_key = slug
        
        # Initialize entry if missing
        if tool_key not in tools_dict:
            tools_dict[tool_key] = {}
            added_count += 1
        
        entry = tools_dict[tool_key]
        modified = False

        # Generate Name if missing
        if 'name' not in entry or not entry['name']:
            # Try to find a good name
            title_name = to_title_case(slug)
            
            # Check if this name exists in ui_dict (case insensitive lookup)
            if title_name.lower() in ui_name_map:
                entry['name'] = ui_name_map[title_name.lower()]
            else:
                entry['name'] = title_name
            modified = True

        # Generate Description if missing
        if 'description' not in entry or not entry['description']:
            # Generic SEO description
            tool_name = entry['name']
            entry['description'] = f"Free online {tool_name}. Create {tool_name} instantly in your browser. No signup required."
            modified = True
            
        # Generate SEO Metadata if missing
        if 'seo_title' not in entry:
            entry['seo_title'] = f"{entry['name']} - Free Online Tool"
            modified = True
            
        if 'seo_description' not in entry:
            entry['seo_description'] = entry['description']
            modified = True

        if modified:
            updated_count += 1

    # 4. Save updates
    save_json(en_data, en_json_path)
    print(f"Sync complete. Added {added_count} new tools. Updated {updated_count} existing tools.")

if __name__ == '__main__':
    main()
