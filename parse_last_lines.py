import re
filepath = r"c:\Users\haptn\Downloads\Di chuyển khu vực bên phải\src\imports\QlyHoSoKhList-1\QlyHoSoKhList.tsx"


with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for function Frame57
match = re.search(r'function\s+Frame57\s*\(\)\s*\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\}', content)
if match:
    with open('frame57.tsx', 'w', encoding='utf-8') as out_f:
        out_f.write(match.group(0))
    print("Found Frame57 and wrote to frame57.tsx")
else:
    print("Frame57 not found")

