import os
import json
import shutil
from tqdm import tqdm

def check_json_success(file_path):
    """
    Checks if a JSON file contains 'Task ended with score: 1'.

    Args:
        file_path (str): Path to the JSON file.

    Returns:
        bool: True if success condition is found, False otherwise.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, dict):  # Ensure it's a valid JSON object
                if "Task ended with score : 1" in json.dumps(data):  # Search entire JSON as string
                    print(file_path, "is where I found success")
                    return True
    except Exception as e:
        print(f"Error reading JSON {file_path}: {e}")
    
    return False

def check_experiment_success(task_folder):
    """
    Determines if an experiment was successful by checking its two JSON files.

    Args:
        task_folder (str): Path to the experiment folder.

    Returns:
        bool: True if either JSON file contains the success condition, False otherwise.
    """
    json_files = [os.path.join(task_folder, f) for f in os.listdir(task_folder) if f.endswith(".json")]
    
    if len(json_files) < 2:
        print(f"Warning: Expected 2 JSON files in {task_folder}, found {len(json_files)}.")

    for json_file in json_files:
        if check_json_success(json_file):
            return True  # If any JSON file is successful, mark the experiment as successful
    
    return False  # If neither JSON file contained success, mark as failure

def copy_successful_experiment(experiment_name, logs_folder, success_logs_folder):
    """
    Copies the experiment folder from logs/ to logs/success_logs/ if it's successful.

    Args:
        experiment_name (str): Name of the successful experiment.
        logs_folder (str): Path to the logs directory.
        success_logs_folder (str): Path to the success_logs directory.
    """
    source_path = os.path.join(logs_folder, experiment_name)
    destination_path = os.path.join(success_logs_folder, experiment_name)

    if os.path.exists(source_path):  # Check if the matching logs folder exists
        print(f"Copying {source_path} to {destination_path}...")
        shutil.copytree(source_path, destination_path, dirs_exist_ok=True)
    else:
        print(f"Warning: No matching logs folder found for {experiment_name}")

def is_base(folder_name):
    return "full_plan" in folder_name and "depth_0" in folder_name and "missing" not in folder_name

def base_without_plan(folder_name):
    return "no_plan" in folder_name and "depth_0" in folder_name and "missing" in folder_name

def process_experiments(base_folder, logs_folder):
    """
    Processes all 'train_tasks_*' folders and aggregates experiment results.

    Args:
        base_folder (str): Path to the 'experiments' directory.
        logs_folder (str): Path to the logs directory.

    Returns:
        dict: Aggregated experiment results, including category-based success rates.
    """
    aggregated_data = {}

    total = 0
    successful = 0

    base_total = 0
    base_successful = 0

    base_no_plan_total = 0
    base_no_plan_successful = 0

    missing_total = 0
    missing_successful = 0

    full_plan_total = 0
    full_plan_successful = 0

    partial_plan_total = 0
    partial_plan_successful = 0

    no_plan_total = 0
    no_plan_successful = 0

    high_depth_total = 0
    high_depth_successful = 0

    success_logs_folder = os.path.join(logs_folder, "success_logs")
    os.makedirs(success_logs_folder, exist_ok=True)  # Ensure success_logs folder exists

    # Iterate over all train_tasks_* folders
    train_task_folders = [os.path.join(base_folder, d) for d in os.listdir(base_folder) if d.startswith("train_tasks_")]
    
    for train_task_folder in tqdm(train_task_folders, desc="Processing train task folders"):
        if not os.path.isdir(train_task_folder):
            continue  # Skip if not a directory

        # Iterate over experiment subfolders inside train_tasks_*
        experiment_folders = [os.path.join(train_task_folder, d) for d in os.listdir(train_task_folder) if os.path.isdir(os.path.join(train_task_folder, d))]
        
        for task_folder in experiment_folders:
            folder_name = os.path.basename(task_folder)
            total += 1
            success = int(check_experiment_success(task_folder))  # Convert True/False to 1/0
            successful += success

            # Categorize experiments
            if "missing" in folder_name:
                missing_successful += success
                missing_total += 1
            if is_base(folder_name):
                base_successful += success
                base_total += 1
            if base_without_plan(folder_name):
                base_no_plan_successful += success
                base_no_plan_total += 1
            if "full_plan" in folder_name and not is_base(folder_name):
                full_plan_successful += success
                full_plan_total += 1
            if "partial_plan" in folder_name and not is_base(folder_name):
                partial_plan_successful += success
                partial_plan_total += 1
            if "no_plan" in folder_name and not is_base(folder_name):
                no_plan_successful += success
                no_plan_total += 1
            if ("depth_1" in folder_name or "depth_2" in folder_name) and not is_base(folder_name):
                high_depth_successful += success
                high_depth_total += 1

            # If experiment is successful, copy its logs folder
            if success:
                copy_successful_experiment(folder_name, logs_folder, success_logs_folder)

    return {
        "total": total,
        "successful": successful,
        "success_rate": successful / total if total > 0 else 0,
        "base_total": base_total,
        "base_successful": base_successful,
        "base_success_rate": base_successful / base_total if base_total > 0 else 0,
        "base_no_plan_total": base_no_plan_total,
        "base_no_plan_successful": base_no_plan_successful,
        "base_no_plan_success_rate": base_no_plan_successful / base_no_plan_total if base_no_plan_total > 0 else 0,
        "missing_total": missing_total,
        "missing_successful": missing_successful,
        "missing_success_rate": missing_successful / missing_total if missing_total > 0 else 0,
        "full_plan_total": full_plan_total,
        "full_plan_successful": full_plan_successful,
        "full_plan_success_rate": full_plan_successful / full_plan_total if full_plan_total > 0 else 0,
        "partial_plan_total": partial_plan_total,
        "partial_plan_successful": partial_plan_successful,
        "partial_plan_success_rate": partial_plan_successful / partial_plan_total if partial_plan_total > 0 else 0,
        "no_plan_total": no_plan_total,
        "no_plan_successful": no_plan_successful,
        "no_plan_success_rate": no_plan_successful / no_plan_total if no_plan_total > 0 else 0,
        "high_depth_total": high_depth_total,
        "high_depth_successful": high_depth_successful,
        "high_depth_success_rate": high_depth_successful / high_depth_total if high_depth_total > 0 else 0
    }

def save_results(results, output_path):
    """
    Saves experiment results to a JSON file.

    Args:
        results (dict): Aggregated experiment results.
        output_path (str): Path to save the JSON file.
    """
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=4)
    print(f"Results saved to {output_path}")

# Define directories
experiments_dir = "experiments"  # Change this if needed
logs_dir = "logs"  # Change this if needed

# Process experiments and save results
experiment_results = process_experiments(experiments_dir, logs_dir)
save_results(experiment_results, os.path.join(experiments_dir, "experiment_results.json"))
