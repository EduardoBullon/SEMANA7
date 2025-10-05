import re

def remove_js_comments(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove single line comments
    content = re.sub(r'^\s*//.*$', '', content, flags=re.MULTILINE)
    
    # Remove block comments 
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    
    # Remove empty lines
    lines = [line for line in content.split('\n') if line.strip()]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

# Remove comments from app.js
remove_js_comments('public/js/app.js')

print("Comments removed from app.js")