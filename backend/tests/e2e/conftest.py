"""
JEEWAN — Selenium E2E Tests
Tests complete user flows in the browser.
Requires: Chrome, frontend running on localhost:3000/3001

Usage: pytest tests/e2e/ -v
"""
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options


FRONTEND_URL = "http://localhost:3001"


@pytest.fixture(scope="session")
def driver():
    """Headless Chrome WebDriver for all E2E tests."""
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--window-size=1280,900")
    d = webdriver.Chrome(options=opts)
    d.implicitly_wait(10)
    yield d
    d.quit()
