from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

@app.route('/')
def home():
    return "Flask server is running. Use the /scrape endpoint for POST requests."

def scrape_website(url):
    # Set up Selenium WebDriver with headless configuration
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    driver = webdriver.Chrome(options=options)

    try:
        # Load the target URL
        driver.get(url)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Scrape Typography (font styles)
        fonts = [link['href'] for link in soup.find_all('link', {'rel': 'stylesheet'}) if 'fonts.googleapis' in link.get('href', '')]

        # Scrape Color Schemes
        colors = []
        for style in soup.find_all('style'):
            if 'color' in style.text:
                colors.append(style.text)
        meta_colors = soup.find_all('meta', {'name': 'theme-color'})
        colors += [meta['content'] for meta in meta_colors if 'content' in meta.attrs]

        # Scrape Logo
        logos = [img['src'] for img in soup.find_all('img', {'alt': 'logo'}) if 'src' in img.attrs]

        # Scrape Navbar Components (Links in Navbar)
        navbar = soup.find('nav')
        navbar_links = []
        if navbar:
            navbar_links = [a.text.strip() for a in navbar.find_all('a') if a.text.strip()]

        # Scrape Layout Information
        layout = []
        for div in soup.find_all('div', class_=True):
            layout.append({
                'class': div['class'],
                'content': div.text.strip()
            })

        # Scrape Inline Styles
        styles = soup.find_all('style')
        inline_styles = [style.text for style in styles]

        # Return the scraped data
        result = {
            "fonts": fonts,
            "colors": colors,
            "logos": logos,
            "navbar_links": navbar_links,
            "layout": layout,
            "styles": inline_styles
        }
        return result
    finally:
        driver.quit()  # Ensure the WebDriver is closed

@app.route('/scrape', methods=['POST'])
def scrape():
    print("Scrape endpoint was called")
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    try:
        result = scrape_website(url)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()