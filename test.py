import os
from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError

# 1. Load variables from the .env file into os.environ
load_dotenv()

def test_api_key():
    # 2. Check if the environment variable is loaded locally
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found in the environment setup.")
        return

    print("Checking local configuration... OK")
    
    try:
        # 3. Initialize the client (automatically uses GEMINI_API_KEY from environment)
        client = genai.Client()
        
        print("Sending test request to Gemini API...")
        # 4. Perform a simple token/generation test with a flash model
        response = client.models.generate_content(
            model='gemini-3.7-flash',
            contents='Respond with the single word "Success" if you read this.',
        )
        
        # 5. Output response text to verify authorization validity
        print(f"✅ Success! Connection verified. API Response: {response.text.strip()}")
        
    except APIError as e:
        print(f"❌ API Error: Connection failed. Check if your key is active or restricted.\nDetails: {e}")
    except Exception as e:
        print(f"❌ Unexpected Error occurred: {e}")

if __name__ == "__main__":
    test_api_key()
