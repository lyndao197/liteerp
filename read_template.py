import pandas as pd
import sys

try:
    file_path = r'C:\Users\haptn\Downloads\Ha.Odoo\System-Analysis Template.xlsx'
    xls = pd.ExcelFile(file_path)
    for sheet_name in xls.sheet_names:
        print(f"--- Sheet: {sheet_name} ---")
        df = pd.read_excel(xls, sheet_name=sheet_name)
        print("Columns:")
        print(list(df.columns))
        print("Rows sample:")
        print(df.head(2).to_string())
        print()
except Exception as e:
    print("Error:", e)
