import json

def traverse(node, depth=0):
    indent = "  " * depth
    name = node.get('name', 'Unnamed')
    type_ = node.get('type', 'UNKNOWN')
    chars = node.get('characters', '')
    
    line = ""
    if type_ == 'TEXT':
        line = f"{indent}- TEXT: {name} | Content: {chars}"
    elif type_ in ['INSTANCE', 'COMPONENT', 'FRAME', 'GROUP']:
        line = f"{indent}- {type_}: {name}"
    else:
        line = f"{indent}- {type_}: {name}"
    
    with open('figma_tree.txt', 'a', encoding='utf-8') as out_f:
        out_f.write(line + '\n')
    
    for child in node.get('children', []):
        traverse(child, depth + 1)

with open('figma_tree.txt', 'w', encoding='utf-8') as out_f:
    out_f.write('')

with open('figma_node.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

nodes = data.get('nodes', {})
for node_id, node_info in nodes.items():
    document = node_info.get('document', {})
    traverse(document)
