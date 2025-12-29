#!/usr/bin/env python3
import json
from pathlib import Path

# Core UI Translations
CORE_TRANSLATIONS = {
    'es': {
        'nav': {'home': 'Inicio', 'tools': 'Herramientas', 'about': 'Acerca de', 'viewAllTools': 'Ver todas', 'searchPlaceholder': 'Buscar...', 'noResults': 'No encontrado', 'relatedTools': 'Relacionado'},
        'site': {'tagline': 'Herramientas online gratuitas'},
        'home': {'hero': {'title': 'Herramientas Gratuitas', 'subtitle': 'Colección de herramientas para desarrolladores. Sin registro.', 'cta': 'Explorar'}},
        'categories': {'text': 'Texto', 'image': 'Imagen', 'development': 'Desarrollo', 'encoding': 'Codificación', 'math': 'Matemáticas'}
    },
    'pt': {
        'nav': {'home': 'Início', 'tools': 'Ferramentas', 'about': 'Sobre', 'viewAllTools': 'Ver todas', 'searchPlaceholder': 'Buscar...', 'noResults': 'Não encontrado', 'relatedTools': 'Relacionado'},
        'site': {'tagline': 'Ferramentas online gratuitas'},
        'home': {'hero': {'title': 'Ferramentas Gratuitas', 'subtitle': 'Coleção de ferramentas para desenvolvedores. Sem cadastro.', 'cta': 'Explorar'}},
        'categories': {'text': 'Texto', 'image': 'Imagem', 'development': 'Desenvolvimento', 'encoding': 'Codificação', 'math': 'Matemática'}
    },
    'fr': {
        'nav': {'home': 'Accueil', 'tools': 'Outils', 'about': 'À propos', 'viewAllTools': 'Voir tout', 'searchPlaceholder': 'Rechercher...', 'noResults': 'Aucun résultat', 'relatedTools': 'Similaire'},
        'site': {'tagline': 'Outils en ligne gratuits'},
        'home': {'hero': {'title': 'Outils Gratuits', 'subtitle': 'Collection d\'outils pour développeurs. Sans inscription.', 'cta': 'Explorer'}},
        'categories': {'text': 'Texte', 'image': 'Image', 'development': 'Développement', 'encoding': 'Encodage', 'math': 'Maths'}
    },
    'de': {
        'nav': {'home': 'Startseite', 'tools': 'Werkzeuge', 'about': 'Über', 'viewAllTools': 'Alle ansehen', 'searchPlaceholder': 'Suchen...', 'noResults': 'Keine Ergebnisse', 'relatedTools': 'Ähnlich'},
        'site': {'tagline': 'Kostenlose Online-Tools'},
        'home': {'hero': {'title': 'Kostenlose Tools', 'subtitle': 'Tools für Entwickler. Keine Registrierung.', 'cta': 'Durchsuchen'}},
        'categories': {'text': 'Text', 'image': 'Bild', 'development': 'Entwicklung', 'encoding': 'Kodierung', 'math': 'Mathe'}
    },
    'ru': {
        'nav': {'home': 'Главная', 'tools': 'Инструменты', 'about': 'О нас', 'viewAllTools': 'Все инструменты', 'searchPlaceholder': 'Поиск...', 'noResults': 'Нет результатов', 'relatedTools': 'Похожие'},
        'site': {'tagline': 'Бесплатные онлайн инструменты'},
        'home': {'hero': {'title': 'Бесплатные инструменты', 'subtitle': 'Коллекция инструментов для разработчиков. Без регистрации.', 'cta': 'Обзор'}},
        'categories': {'text': 'Текст', 'image': 'Изображения', 'development': 'Разработка', 'encoding': 'Кодирование', 'math': 'Математика'}
    },
    'ja': {
        'nav': {'home': 'ホーム', 'tools': 'ツール', 'about': '概要', 'viewAllTools': 'すべて見る', 'searchPlaceholder': '検索...', 'noResults': '結果なし', 'relatedTools': '関連ツール'},
        'site': {'tagline': '無料オンラインツール'},
        'home': {'hero': {'title': '無料ツールコレクション', 'subtitle': '開発者向けツール。登録不要。', 'cta': 'ツールを見る'}},
        'categories': {'text': 'テキスト', 'image': '画像', 'development': '開発', 'encoding': 'エンコード', 'math': '数学'}
    },
    'ko': {
        'nav': {'home': '홈', 'tools': '도구', 'about': '정보', 'viewAllTools': '모두 보기', 'searchPlaceholder': '검색...', 'noResults': '결과 없음', 'relatedTools': '관련 도구'},
        'site': {'tagline': '무료 온라인 도구'},
        'home': {'hero': {'title': '무료 개발자 도구', 'subtitle': '개발자를 위한 무료 도구 모음. 가입 필요 없음.', 'cta': '도구 찾아보기'}},
        'categories': {'text': '텍스트', 'image': '이미지', 'development': '개발', 'encoding': '인코딩', 'math': '수학'}
    },
    'ar': {
        'nav': {'home': 'الرئيسية', 'tools': 'أدوات', 'about': 'حول', 'viewAllTools': 'عرض الكل', 'searchPlaceholder': 'بحث...', 'noResults': 'لا توجد نتائج', 'relatedTools': 'أدوات ذات صلة'},
        'site': {'tagline': 'أدوات مجانية عبر الإنترنت'},
        'home': {'hero': {'title': 'أدوات مطورين مجانية', 'subtitle': 'مجموعة أدوات للمطورين. بدون تسجيل.', 'cta': 'تصفح الأدوات'}},
        'categories': {'text': 'نصوص', 'image': 'صور', 'development': 'تطوير', 'encoding': 'تشفير', 'math': 'رياضيات'}
    }
}

LANGUAGES = ['es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko']

def load_source(source_path):
    with open(source_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def merge_translations(base, overrides):
    """Recursively merge overrides into base"""
    for k, v in overrides.items():
        if k in base and isinstance(base[k], dict) and isinstance(v, dict):
            merge_translations(base[k], v)
        elif k in base:
            base[k] = v
    return base

def main():
    messages_dir = Path(__file__).parent.parent / 'src' / 'messages'
    source_file = messages_dir / 'en.json'
    source_data = load_source(source_file)
    
    for lang in LANGUAGES:
        print(f"Generating {lang}...")
        # Start with English
        target_data = json.loads(json.dumps(source_data))
        
        # Apply core translations if available
        if lang in CORE_TRANSLATIONS:
            merge_translations(target_data, CORE_TRANSLATIONS[lang])
            
        # Write file
        target_file = messages_dir / f'{lang}.json'
        with open(target_file, 'w', encoding='utf-8') as f:
            json.dump(target_data, f, ensure_ascii=False, indent=2)
            
    print("Done.")

if __name__ == '__main__':
    main()
