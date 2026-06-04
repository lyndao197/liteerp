import re

filepath = r"c:\Users\haptn\Downloads\Di chuyển khu vực bên phải\src\imports\QlyHoSoKhList-1\QlyHoSoKhList.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

def extract_fn(name):
    match = re.search(r'function\s+' + name + r'\s*\(\s*(?:[^)]*)\)\s*\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\}', content)
    return match.group(0) if match else f"Function {name} not found"

with open('frame57_subcomponents_lvl4.tsx', 'w', encoding='utf-8') as out_f:
    for name in ['Frame9', 'Frame10', 'Frame2', 'Frame3', 'Frame5', 'Frame6', 'Frame7', 'Frame11', 'Frame12', 'Frame14', 'Frame64', 'Frame65', 'Frame4', 'Frame17', 'Frame18', 'Frame19', 'Frame66', 'Frame20']:
        out_f.write(f"// =================== {name} ===================\n")
        out_f.write(extract_fn(name) + "\n\n")

print("Done writing frame57_subcomponents_lvl4.tsx")
