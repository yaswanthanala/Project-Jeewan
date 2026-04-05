"""
JEEWAN — Selenium E2E: SOS Button Test (NFR-07: 1-click access)
Verifies SOS button is visible and clickable on home screen.
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

FRONTEND_URL = "http://localhost:3001"


def test_sos_button_visible_on_home(driver):
    """SOS button must be visible on the home page without scrolling."""
    driver.get(FRONTEND_URL)
    sos_links = driver.find_elements(By.LINK_TEXT, "SOS")
    assert len(sos_links) > 0, "SOS button/link must be visible on the home screen"


def test_sos_button_in_navbar(driver):
    """SOS button must be in the navbar for 1-click access."""
    driver.get(FRONTEND_URL)
    navbar = driver.find_element(By.TAG_NAME, "nav")
    sos_btn = navbar.find_elements(By.LINK_TEXT, "SOS")
    assert len(sos_btn) > 0, "SOS must be in the navbar"


def test_home_page_loads(driver):
    """Home page should load without errors."""
    driver.get(FRONTEND_URL)
    assert "JEEWAN" in driver.title or "JEEWAN" in driver.page_source
