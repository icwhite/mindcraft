from evaluation_script import analyze_json_file, extract_result, aggregate_results, check_folder_results
import argparse
import glob
import os
import numpy as np

def main():

    parser = argparse.ArgumentParser(description="Analyze JSON files for construction tasks.")
    parser.add_argument('--log_dir', type=str, nargs='+', help='Log dir to analyze')

    args = parser.parse_args()
    log_dir = args.log_dir[0]
    print(log_dir)
    subfolders = [f for f in glob.glob(os.path.join(log_dir, "*")) if os.path.isdir(f)]
    results = aggregate_results(subfolders)
    scores = results["scores"]
    std = np.std(scores)
    print(results)
    print(f"Mean: {np.mean(scores)}, Std: {std}, Error Bar: {std/np.sqrt(len(scores))}")

if __name__ == "__main__":
    main()