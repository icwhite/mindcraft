import boto3
import os
import json
import re
from botocore.exceptions import ClientError
import json
import argparse
from tqdm import tqdm
import glob

def download_and_analyze_s3_folders(bucket_name, s3_prefix, local_base_dir):
    """
    Downloads groups of folders from S3 based on the next level of prefixes.

    Args:
        bucket_name (str): Name of the S3 bucket.
        s3_prefix (str): Prefix where the folders are located (e.g., 'my-experiments/').
        local_base_dir (str): Local directory to download the folders to.

    Returns:
        list: List of downloaded local folder paths.
    """
    s3_client = boto3.client('s3')
    downloaded_folders = []
    total = 0
    successful = 0

    base_successful = 0
    base_total = 0

    missing_successful = 0
    missing_total = 0

    full_plan_successful = 0
    full_plan_total = 0

    partial_plan_successful = 0
    partial_plan_total = 0

    no_plan_successful = 0
    no_plan_total = 0

    high_depth_successful = 0
    high_depth_total = 0

    try:
        # List objects with the prefix, delimited by '/' to find sub-prefixes (folders)
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=s3_prefix, Delimiter='/')

        if 'CommonPrefixes' not in response:
            print(f"No folders found under s3://{bucket_name}/{s3_prefix}")
            return downloaded_folders

        s3_folder_prefixes = [prefix['Prefix'] for prefix in response['CommonPrefixes']]
        subfolder = s3_prefix.split('/')[-2]

        for s3_folder_prefix in tqdm(s3_folder_prefixes):
            total += 1
            folder_name = s3_folder_prefix.split('/')[-2] # Extract folder name
            local_folder_path = os.path.join(local_base_dir, subfolder, folder_name)
            os.makedirs(local_folder_path, exist_ok=True)
            downloaded_folders.append(local_folder_path)

            # Download files within the folder
            objects_in_folder = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=s3_folder_prefix)
            if 'Contents' in objects_in_folder:
                for obj in objects_in_folder['Contents']:
                    s3_key = obj['Key']
                    if s3_key.endswith(('.json')): # Only download json files
                        local_file_path = os.path.join(local_folder_path, os.path.basename(s3_key))
                        try:
                            s3_client.download_file(bucket_name, s3_key, local_file_path)
                            success = int(extract_result(local_folder_path))
                            successful += success

                            if "missing" in local_folder_path:
                                missing_successful += success
                                missing_total += 1
                            if "full_plan" in local_folder_path and "depth_0" in local_folder_path:
                                base_successful += success
                                base_total += 1
                            if "full_plan" in local_folder_path:
                                full_plan_successful += success
                                full_plan_total += 1
                            if "partial_plan" in local_folder_path:
                                partial_plan_successful += success
                                partial_plan_total += 1
                            if "no_plan" in local_folder_path:
                                no_plan_successful += success
                                no_plan_total += 1
                            if "depth_1" in local_folder_path or "depth_2" in local_folder_path:
                                high_depth_successful += success
                                high_depth_total += 1
                            
                            # print(f"Base: {base_successful}/{base_total}")
                            # print(f"Missing: {missing_successful}/{missing_total}")
                            # print(f"Full Plan: {full_plan_successful}/{full_plan_total}")
                            # print(f"Partial Plan: {partial_plan_successful}/{partial_plan_total}")
                            # print(f"No Plan: {no_plan_successful}/{no_plan_total}")
                            # print(f"High Depth: {high_depth_successful}/{high_depth_total}")
                        except Exception as e:
                            print(f"Error downloading {s3_key}: {e}")
            
            else:
                print(f"No files found in {s3_folder_prefix}")

    except ClientError as e:
        print(f"Error accessing S3: {e}")
        return []

    return {
        "folders": downloaded_folders, 
        "total": total,
        "successful": successful, 
        "percent_success": successful / total if total > 0 else 0,
        "base": {
            "total": base_total,
            "successful": base_successful,
            "percent_success": base_successful / base_total if base_total > 0 else 0
        },
        "missing": {
            "total": missing_total,
            "successful": missing_successful,
            "percent_success": missing_successful / missing_total if missing_total > 0 else 0
        },
        "partial_plan": {
            "total": partial_plan_total,
            "successful": partial_plan_successful,
            "percent_success": partial_plan_successful / partial_plan_total if partial_plan_total > 0 else 0
        },
        "no_plan": {
            "total": no_plan_total,
            "successful": no_plan_successful,
            "percent_success": no_plan_successful / no_plan_total if no_plan_total > 0 else 0
        },
        "high_depth": {
            "total": high_depth_total,
            "successful": high_depth_successful,
            "percent_success": high_depth_successful / high_depth_total if high_depth_total > 0 else 0
        }
    }

def analyze_json_file(file_path):
    """
    Analyzes a single JSON file to extract the task outcome.

    Args:
        file_path (str): Path to the JSON file.

    Returns:
        str or None: The task outcome string if found, otherwise None.
    """
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            if 'turns' in data and isinstance(data['turns'], list):
                for turn in reversed(data['turns']):  # Check turns from the end
                    if turn.get('role') == 'system' and isinstance(turn.get('content'), str):
                        if "Task successful ended with code : 2" in turn['content']:
                            return True
        return False
    except FileNotFoundError:
        print(f"Error: File not found: {file_path}")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in: {file_path}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred while processing {file_path}: {e}")
        return None

def extract_result(folder_path):
    folder_name = os.path.basename(folder_path)
    json_files = glob.glob(os.path.join(folder_path, "*.json"))
    assert len(json_files) == 2, f"Expected 2 json files in {folder_name}, found {len(json_files)}"

    if not json_files:
        print(f"No JSON files found in {folder_name}")
        return None
    else: 
        outcome = False
        for json_file in json_files:
            outcome = analyze_json_file(json_file)
            if outcome:
                return True
        return False

    # andy_outcome = None
    # jill_outcome = None

    # andy_file = os.path.join(folder_path, "andy.json")
    # jill_file = os.path.join(folder_path, "jill.json")

    # # Attempt to find numbered versions if base name doesn't exist
    # if not os.path.exists(andy_file):
    #     for file_name in os.listdir(folder_path):
    #         if file_name.startswith("Andy_") and file_name.endswith(".json"):
    #             andy_file = os.path.join(folder_path, file_name)
    #             break
    #     else:
    #         andy_file = None # Indicate no andy file found

    # if not os.path.exists(jill_file):
    #     for file_name in os.listdir(folder_path):
    #         if file_name.startswith("Jill_") and file_name.endswith(".json"):
    #             jill_file = os.path.join(folder_path, file_name)
    #             break
    #     else:
    #         jill_file = None # Indicate no jill file found

    # if andy_file:
    #     andy_outcome = analyze_json_file(andy_file)
    #     # print(f"Andy: {andy_outcome}")
    # else:
    #     print(f"Warning: No andy json file found in {folder_name}")

    # if jill_file:
    #     jill_outcome = analyze_json_file(jill_file)
    #     # print(f"Jill: {jill_outcome}")
    # else:
    #     print(f"Warning: No jill json file found in {folder_name}")

    # return andy_outcome or jill_outcome
    



def aggregate_results(local_folders):
    """
    Aggregates the analysis results for each folder.

    Args:
        local_folders (list): List of local folder paths containing the JSON files.

    Returns:
        dict: A dictionary where keys are folder names and values are the aggregated outcomes.
    """
    aggregated_data = {}
    successful = 0
    for folder_path in local_folders:
        folder_name = os.path.basename(folder_path)

        json_files = glob.glob(os.path.join(folder_path, "*.json"))
        if not json_files:
            print(f"No JSON files found in {folder_name}")
            continue

        andy_outcome = None
        jill_outcome = None



        andy_file = os.path.join(folder_path, "andy.json")
        jill_file = os.path.join(folder_path, "jill.json")

        # Attempt to find numbered versions if base name doesn't exist
        if not os.path.exists(andy_file):
            for file_name in os.listdir(folder_path):
                if file_name.startswith("Andy_") and file_name.endswith(".json"):
                    andy_file = os.path.join(folder_path, file_name)
                    break
            else:
                andy_file = None # Indicate no andy file found

        if not os.path.exists(jill_file):
            for file_name in os.listdir(folder_path):
                if file_name.startswith("Jill_") and file_name.endswith(".json"):
                    jill_file = os.path.join(folder_path, file_name)
                    break
            else:
                jill_file = None # Indicate no jill file found

        if andy_file:
            andy_outcome = analyze_json_file(andy_file)
        else:
            print(f"Warning: No andy json file found in {folder_name}")

        if jill_file:
            jill_outcome = analyze_json_file(jill_file)
        else:
            print(f"Warning: No jill json file found in {folder_name}")
        


        if andy_outcome == jill_outcome and andy_outcome is not None:
            aggregated_data[folder_name] = f"Both: {andy_outcome}"
        else:
            results = []
            if andy_outcome:
                results.append(f"Andy: {andy_outcome}")
            if jill_outcome:
                results.append(f"Jill: {jill_outcome}")
            if results:
                aggregated_data[folder_name] = ", ".join(results)
            else:
                aggregated_data[folder_name] = "No outcome found in either file"

    return aggregated_data


# --- Main Execution ---
if __name__ == "__main__":
    # 1. Download folders from AWS
    parser = argparse.ArgumentParser()
    parser.add_argument('--aws_bucket_name', default="izzy-mindcraft" , type=str, help='AWS bucket name')
    parser.add_argument('--s3_folder_prefix', default="experiments/4o_craft_better_tasks_03-02_07-15/", type=str, help='S3 folder prefix')
    parser.add_argument('--local_download_dir', default="results", type=str, help='Local download directory')
    args = parser.parse_args()

    AWS_BUCKET_NAME = args.aws_bucket_name
    S3_FOLDER_PREFIX = args.s3_folder_prefix
    LOCAL_DOWNLOAD_DIR = args.local_download_dir


    print(f"Downloading folders from s3://{args.aws_bucket_name}/{args.s3_folder_prefix} to {args.local_download_dir}...")
    results = download_and_analyze_s3_folders(args.aws_bucket_name, args.s3_folder_prefix, args.local_download_dir)

if __name__ == "__main__":
    # Save results to a file
    subfolder = S3_FOLDER_PREFIX.split('/')[-2]
    with open(LOCAL_DOWNLOAD_DIR + subfolder + "results.json", "w") as file:
        json.dump(results, file)

    print("Results saved to results.json")
    print(results)
    # if not downloaded_local_folders:
    #     print("No folders downloaded. Exiting.")
    #     exit()

    # print("\n--- Analyzing downloaded files ---")
    # # 2. & 3. Analyze files and aggregate results
    # results = aggregate_results(downloaded_local_folders)

    # print("\n--- Aggregated Results ---")
    # for folder, outcome in results.items():
    #     print(f"Folder: {folder} -> {outcome}")

    # Optional: Clean up downloaded files
    # import shutil
    # shutil.rmtree(LOCAL_DOWNLOAD_DIR)
    # print(f"\nCleaned up {LOCAL_DOWNLOAD_DIR}")