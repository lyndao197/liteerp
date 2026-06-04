import urllib.request
import json
import sys

TOKEN = "figd_U-ozS5x-mgL3eDB6NfISSf77l_0gIzuL1MNbB4gc"
FILE_KEY = "R9OCK6UYUUPdqmQUCRVbpd"
NODE_ID = "4283:2350"

url = f"https://api.figma.com/v1/files/{FILE_KEY}/nodes?ids={NODE_ID}"

req = urllib.request.Request(url)
req.add_header('X-Figma-Token', TOKEN)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        with open('figma_node.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Success")
except Exception as e:
    print("Error:", e)
