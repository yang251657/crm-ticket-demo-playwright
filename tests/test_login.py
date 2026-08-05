from pages.login_page import LoginPage


def test_agent_can_login(page, app_url: str) -> None:
    login_page = LoginPage(page, app_url)

    login_page.open()
    login_page.login("agent", "Password123")
    login_page.verify_login_success("agent")


def test_login_fails_with_invalid_password(page, app_url: str) -> None:
    login_page = LoginPage(page, app_url)

    login_page.open()
    login_page.login("agent", "wrong-password")
    login_page.verify_login_failure()
