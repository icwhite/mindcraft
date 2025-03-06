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
    response_token_count = 0

    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)

        with open(file_path, 'r', encoding="utf-8") as file:
            content = file.read()

        try:
            # Extract the Response section
            response_start = content.find("\n\nResponse:") + len("\n\nResponse:")
            response_text = content[response_start:].strip()
            response_token_count += count_tokens(response_text)
        except Exception as e:
            print(f"Error processing {file_name}: {e}")

    # Create the output JSON data
    output_data = {
        "task_id": folder_name,
        "response_token_count": response_token_count
    }

    output_path = os.path.join(folder_path, f"response_token_counts.json")
    with open(output_path, 'w', encoding="utf-8") as json_file:
        json.dump(output_data, json_file, indent=4)

    print(f"Response token counts saved to {output_path}")

