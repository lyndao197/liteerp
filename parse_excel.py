import pandas as pd

try:
    df = pd.read_excel('KVMN_ Phu\u0323 lu\u0323c to\u031b\u0300 tri\u0300nh kinh doanh Hakuhodo 10032026.xlsx', sheet_name=0)
    with open('excel_dump.txt', 'w', encoding='utf-8') as f:
        f.write(df.head(50).to_string())
except Exception as e:
    import glob
    files = glob.glob('*.xlsx')
    with open('excel_dump.txt', 'w', encoding='utf-8') as f:
        f.write(f"Error: {e}\nAvailable xlsx files: {files}")
