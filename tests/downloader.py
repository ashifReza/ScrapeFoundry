import os
import requests

# Create a function to download images from URLs
def download_images(image_urls, output_folder):
    # Create the output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    
    # Iterate through each image URL
    for idx, url in enumerate(image_urls, start=1):
        try:
            # Send a GET request to the image URL
            response = requests.get(url)
            # Check if the request was successful
            if response.status_code == 200:
                # Extract the file extension from the URL
                file_extension = url.split('.')[-1]
                # Save the image to the output folder with a unique name
                filename = f'image_{idx}.{file_extension}'
                with open(os.path.join(output_folder, filename), 'wb') as f:
                    f.write(response.content)
                print(f"Image {idx} downloaded successfully.")
            else:
                print(f"Failed to download image {idx}. Status code: {response.status_code}")
        except Exception as e:
            print(f"Error downloading image {idx}: {e}")

# Read image URLs from the text file
def read_image_urls_from_file(file_path):
    with open(file_path, 'r') as f:
        image_urls = f.read().splitlines()
    return image_urls

if __name__ == "__main__":
    # Path to the text file containing image URLs
    text_file_path = 'image_urls.txt'
    # Output folder to save downloaded images
    output_folder = 'downloaded_images'
    
    # Read image URLs from the text file
    image_urls = read_image_urls_from_file(text_file_path)
    
    # Download images and save them to the output folder
    download_images(image_urls, output_folder)