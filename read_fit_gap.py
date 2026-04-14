import pandas as pd
import json
import sys

file_path = "Fit Gap_Thông tin quản lý.xlsx"
try:
    # Read all sheets, and extract data
    xls = pd.ExcelFile(file_path)
    output = {}
    for sheet in xls.sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet)
        output[sheet] = df.head(50).to_dict(orient="records")
    
    with open("out_fit_gap.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2, default=str)
    print("Done")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
