import json

logs_path = "/Users/kaka/.gemini/antigravity/brain/b434a4e9-5e73-45f0-ade5-224189145557/.system_generated/logs/transcript.jsonl"
with open(logs_path) as f:
    lines = f.readlines()

print(f"Total steps: {len(lines)}")

# Print keys of a cleared step
for line in reversed(lines):
    data = json.loads(line)
    if data.get("status") == "CLEARED":
        print(f"Cleared step index {data.get('step_index')}: keys={list(data.keys())}")
        # print first few characters of values
        for k, v in data.items():
            if isinstance(v, str):
                print(f"  {k}: {v[:100]}")
            else:
                print(f"  {k}: {type(v)}")
        break

# Let's find the last step that is NOT cleared or has content
print("\n--- Last non-cleared steps ---")
count = 0
for line in reversed(lines):
    data = json.loads(line)
    if data.get("status") != "CLEARED":
        content = data.get("content") or ""
        print(f"Step {data.get('step_index')}: source={data.get('source')}, type={data.get('type')}, status={data.get('status')}")
        print(f"Content: {content[:300]}\n")
        count += 1
        if count >= 5:
            break
