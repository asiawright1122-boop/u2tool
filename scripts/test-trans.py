from deep_translator import MyMemoryTranslator

try:
    print("Testing MyMemory connection...")
    res = MyMemoryTranslator(source='en', target='es').translate("Graph Chart Generator")
    print(f"Result (es): {res}")
    
    res_ja = MyMemoryTranslator(source='en', target='ja').translate("Graph Chart Generator")
    print(f"Result (ja): {res_ja}")
    
except Exception as e:
    print(f"Error: {e}")
