"""
JEEWAN — Selenium E2E: Chatbot, Leaderboard, Login, Maps
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

FRONTEND_URL = "http://localhost:3001"


def test_chat_page_loads(driver):
    """Chat page should load with greeting message."""
    driver.get(f"{FRONTEND_URL}/chat")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "input"))
    )
    assert "JEEWAN" in driver.page_source


def test_leaderboard_loads(driver):
    """Leaderboard page should load and show institution ranking."""
    driver.get(f"{FRONTEND_URL}/leaderboard")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "h1"))
    )
    assert "Leaderboard" in driver.page_source or "leaderboard" in driver.page_source.lower()


def test_login_page_loads(driver):
    """Login page should have Google sign-in and email options."""
    driver.get(f"{FRONTEND_URL}/login")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "button"))
    )
    assert "Google" in driver.page_source


def test_maps_page_loads(driver):
    """Maps page should load with the rehab centre finder."""
    driver.get(f"{FRONTEND_URL}/maps")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "h1"))
    )
    assert "Rehab" in driver.page_source or "Map" in driver.page_source


def test_login_page_has_role_selector(driver):
    """Login page should have role selection (User, Counsellor, etc)."""
    driver.get(f"{FRONTEND_URL}/login")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "button"))
    )
    assert "User" in driver.page_source
    assert "Counsellor" in driver.page_source
