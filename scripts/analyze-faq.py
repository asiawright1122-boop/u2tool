
import json
from collections import Counter

data = json.load(open('src/messages/en.json'))

tips_counter = Counter()
faq_q_counter = Counter()
faq_a_counter = Counter()
full_strings = []

def traverse(node, path=""):
    if isinstance(node, dict):
        for k, v in node.items():
            new_path = f"{path}.{k}" if path else k
            if isinstance(v, str):
                full_strings.append(v)
                if "tips" in new_path.lower():
                    tips_counter[v] += 1
                if "faq" in new_path.lower():
                    if "question" in k.lower():
                        faq_q_counter[v] += 1
                    else:
                        faq_a_counter[v] += 1
            else:
                traverse(v, new_path)

traverse(data)

print(f"Top Tips:")
for k, v in tips_counter.most_common(50):
    print(f"{v}x: {k[:60]}...")

print(f"\nTop FAQ Questions:")
for k, v in faq_q_counter.most_common(10):
    print(f"{v}x: {k[:60]}...")

print(f"\nTop FAQ Answers:")
for k, v in faq_a_counter.most_common(10):
    print(f"{v}x: {k[:60]}...")
