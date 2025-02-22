import os

def concatenate_md_files(output_filename="combined.txt"):
    # List all files in the current directory
    files = os.listdir(".")
    
    # Filter for markdown files (case insensitive)
    md_files = [f for f in files if f.lower().endswith(".md")]
    
    # Optionally, sort the markdown files alphabetically
    md_files.sort()
    
    # Open the output file in write mode
    with open(output_filename, "w", encoding="utf-8") as outfile:
        for file in md_files:
            with open(file, "r", encoding="utf-8") as infile:
                content = infile.read()
            # Write content and add two newlines as a separator between files
            outfile.write(content + "\n\n")
    
    print(f"Concatenated {len(md_files)} markdown files into '{output_filename}'.")

if __name__ == "__main__":
    concatenate_md_files()
