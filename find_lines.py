filepath = r"c:\Users\haptn\Downloads\Di chuyển khu vực bên phải\src\imports\QlyHoSoKhList-1\QlyHoSoKhList.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f, 1):
        if "Vinamilk" in line or "Công ty Cổ phần Sữa Việt Nam" in line or "Sữa Việt Nam" in line:
            print(f"Line {idx}: {line.strip()}")
