
import json

def flatten(x):
    out = []
    if isinstance(x, dict):
        for v in x.values():
            out.extend(flatten(v))
    elif isinstance(x, list):
        for v in x:
            out.extend(flatten(v))
    elif isinstance(x, str):
        out.append(x)
    return out

data = json.load(open('src/messages/en.json'))
all_strings = flatten(data)
unique_strings = set(all_strings)

print(f"Total strings: {len(all_strings)}")
print(f"Unique strings: {len(unique_strings)}")
print(f"Duplication Ratio: {len(all_strings)/len(unique_strings):.2f}x")
