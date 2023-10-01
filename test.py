import requests
from bs4 import BeautifulSoup
import time

res = requests.get("https://www.google.com/search?q=hello%20world")

soup = BeautifulSoup(res.text, 'html.parser')
# print(soup)
time.sleep(2)
# Example: Extract all the links on the page
links = soup.title
print(links)
# for link in links:
#     print(link.get('href'))
