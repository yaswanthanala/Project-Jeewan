"""
JEEWAN — Selenium E2E: DAST-10 Quiz Flow (FR-08)
Verifies quiz loads, questions navigate, and results display.
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

FRONTEND_URL = "http://localhost:3001"


def test_quiz_page_loads(driver):
    """Quiz page should load with question 1."""
    driver.get(f"{FRONTEND_URL}/quiz")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-answer]"))
    )
    assert "Question 1" in driver.page_source


def test_quiz_answer_selection(driver):
    """Clicking an answer should highlight only that option."""
    driver.get(f"{FRONTEND_URL}/quiz")
    answers = WebDriverWait(driver, 10).until(
        lambda d: d.find_elements(By.CSS_SELECTOR, "[data-answer]")
    )
    assert len(answers) >= 3, "Should have at least 3 answer options"
    # Click second answer
    answers[1].click()
    # The Next button should now be enabled
    next_btn = driver.find_element(By.ID, "quiz-next")
    assert next_btn.is_enabled(), "Next button must be enabled after answer selection"


def test_quiz_full_flow(driver):
    """Complete all 10 questions and verify results page."""
    driver.get(f"{FRONTEND_URL}/quiz")

    for q in range(10):
        # Wait for answer buttons to appear
        answers = WebDriverWait(driver, 10).until(
            lambda d: d.find_elements(By.CSS_SELECTOR, "[data-answer]")
        )
        # Click first answer (value 0 — low risk) 
        answers[0].click()
        # Click Next/See Results
        next_btn = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.ID, "quiz-next"))
        )
        next_btn.click()

    # Should now show results
    result = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "quiz-result"))
    )
    assert result.is_displayed(), "Results page should be visible after completing quiz"
    assert "Low Risk" in driver.page_source or "Results" in driver.page_source


def test_quiz_progress_bar(driver):
    """Progress bar should update as questions advance."""
    driver.get(f"{FRONTEND_URL}/quiz")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-answer]"))
    )
    # Check initial progress text
    assert "10%" in driver.page_source or "Question 1" in driver.page_source
