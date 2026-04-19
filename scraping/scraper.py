import json
import html
import time
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

def get_ug_data(url):
    with sync_playwright() as p:
# 1. Launch a real-looking browser
        browser = p.chromium.launch(headless=True) # Change to False if you want to watch it work
        page = browser.new_page(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        response = page.goto(url, wait_until="commit")
        raw_source = response.text()
        return raw_source

def parse_tab(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find the target div
    target_div = soup.find("div", class_="js-store")
    
    if not target_div:
        return "Error: Could not find the .js-store element."

    # Grab the attribute (UG usually uses 'data-content')
    raw_json_str = target_div.get("data-content")
    
    if raw_json_str:
        # Decode and Parse
        decoded_str = html.unescape(raw_json_str)
        data = json.loads(decoded_str)
        
        try:
            # Navigate to the specific field you want
            content = data['store']['page']['data']['tab_view']#['wiki_tab']['content'].replace("\n", "")
            return content
        except KeyError:
            return "Error: JSON structure has changed or wiki_tab is missing."
    
    return "Error: data-content attribute not found."

def create_output(tab):
    output = "";
    output += tab['wiki_tab']['content'].replace("\n", "") + "\n\n\n"
    output += "Song:\n" + tab['headerMeta']['name'] + "\n\n"
    output += "Artist:\n" + tab['headerMeta']['artists'][0]['name']
    return output

# --- EXECUTION ---
target_urls = [
]

for url in target_urls:
    try:
        html_source = get_ug_data(url)
        tav_content = parse_tab(html_source)
        result = create_output(tav_content)

        filename = "results/" + url.split('/')[-1]

        # Write to html
        #with open(filename + ".html", "w", encoding="utf-8") as f:
        #        f.write(html_source)

        # Write to file
        with open(filename + ".txt", "w", encoding="utf-8") as f:
                f.write(result)

        print(f"Successfully processed: {url}")
    except Exception as e:
            print(f"Failed to process {url}: {e}")