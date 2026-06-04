import urllib.request
import json
import os

TOKEN = "figd_U-ozS5x-mgL3eDB6NfISSf77l_0gIzuL1MNbB4gc"
FILE_KEY = "R9OCK6UYUUPdqmQUCRVbpd"
NODE_ID = "4492:8778"

# 1. Fetch JSON node
print("Fetching node JSON...")
url_json = f"https://api.figma.com/v1/files/{FILE_KEY}/nodes?ids={NODE_ID}"
req_json = urllib.request.Request(url_json)
req_json.add_header('X-Figma-Token', TOKEN)

try:
    with urllib.request.urlopen(req_json) as response:
        data = json.loads(response.read().decode())
        with open('figma_node.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Figma JSON saved successfully to figma_node.json.")
except Exception as e:
    print("Error fetching JSON:", e)

# 2. Fetch image of the node
print("Fetching node image URL...")
url_img = f"https://api.figma.com/v1/images/{FILE_KEY}?ids={NODE_ID}&format=png&scale=1.5"
req_img = urllib.request.Request(url_img)
req_img.add_header('X-Figma-Token', TOKEN)

try:
    with urllib.request.urlopen(req_img) as response:
        img_data = json.loads(response.read().decode())
        img_url = img_data.get('images', {}).get(NODE_ID)
        if img_url:
            print(f"Image URL: {img_url}")
            print("Downloading image...")
            # Create artifacts folder if it doesn't exist
            artifacts_dir = r"C:\Users\haptn\.gemini\antigravity-ide\brain\da38196f-a25b-4b1c-96ee-4a56e46e06c4"
            os.makedirs(artifacts_dir, exist_ok=True)
            img_path = os.path.join(artifacts_dir, "figma_design.png")
            
            urllib.request.urlretrieve(img_url, img_path)
            print(f"Image saved successfully to {img_path}")
        else:
            print("No image URL found in response:", img_data)
except Exception as e:
    print("Error fetching image:", e)
