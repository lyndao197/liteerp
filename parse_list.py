import re

filepath = r"c:\Users\haptn\Downloads\Di chuyển khu vực bên phải\src\imports\QlyHoSoKhList-1\QlyHoSoKhList.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find all text contents inside JSX tags, i.e., {`text`} or >text< or placeholder="text"
jsx_texts = re.findall(r'>([^<>{}\n]+)<|{`([^`]+)`}|placeholder="([^"]+)"', content)
texts = set()
for t in jsx_texts:
    val = (t[0] or t[1] or t[2]).strip()
    if len(val) > 1 and not val.startswith('/') and not val.startswith('.'):
        texts.add(val)

with open('list_texts.txt', 'w', encoding='utf-8') as out_f:
    out_f.write("JSX Text Content (NFC/NFD):\n")
    for t in sorted(list(texts)):
        out_f.write(f"- {t}\n")
print("Done writing to list_texts.txt")


