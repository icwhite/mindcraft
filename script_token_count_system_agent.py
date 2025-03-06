import os
import json
import tiktoken

# Function to count tokens using tiktoken
def count_tokens(text):
    """Estimate token count for a given text using tiktoken."""
    encoding = tiktoken.encoding_for_model('gpt-4o')
    return len(encoding.encode(text))

# Define the logs parent directory
logs_parent_dir = r"./src/models/logs"

# Iterate through all conversation.txt files per task folder
for folder_name in os.listdir(logs_parent_dir):
    folder_path = os.path.join(logs_parent_dir, folder_name)
    system_token_count = 0
    assistant_token_count = 0
    for file_name in os.listdir(folder_path):
        if file_name.startswith("conversation") and file_name.endswith(".txt"):
            file_path = os.path.join(folder_path, file_name)
            
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()
            
            # Extract the JSON conversation section
            try:
                conversation_start = content.find("Conversation:\n[") + len("Conversation:\n")
                conversation_end = content.find("\n\nResponse:")
                conversation_json = content[conversation_start:conversation_end].strip()
                conversation_data = json.loads(conversation_json)
                
                # Process each conversation entry
                for entry in conversation_data:
                    if entry["role"] == "system":
                        system_token_count += count_tokens(entry["content"])
                    elif entry["role"] == "assistant":
                        assistant_token_count += count_tokens(entry["content"])
            
            except (json.JSONDecodeError, ValueError, KeyError, IndexError) as e:
                print(f"Error processing {file_name}: {e}")

    # Create the output JSON data
    output_data = {
        "task_id": folder_name,
        "system_token_count": system_token_count,
        "assistant_token_count": assistant_token_count
    }

    output_file_path = os.path.join(folder_path, "token_counts.json")
    with open(output_file_path, "w", encoding="utf-8") as output_file:
        json.dump(output_data, output_file, indent=4)

    print(f"Token counts saved to {output_file_path}")
