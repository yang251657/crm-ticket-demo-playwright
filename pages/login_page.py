from playwright.sync_api import Page, expect


class LoginPage:
    def __init__(self, page: Page, base_url: str) -> None:
        self.page = page
        self.base_url = base_url
        self.username = page.get_by_label("用户名")
        self.password = page.get_by_label("密码")
        self.login_button = page.get_by_role("button", name="登录")
        self.login_message = page.get_by_role("status").first
        self.main_view = page.locator("#main-view")

    def open(self) -> None:
        self.page.goto(self.base_url)

    def login(self, username: str, password: str) -> None:
        self.username.fill(username)
        self.password.fill(password)
        self.login_button.click()

    def verify_login_success(self, username: str) -> None:
        expect(self.main_view).to_be_visible()
        expect(self.page.get_by_text(f"欢迎，{username}")).to_be_visible()

    def verify_login_failure(self) -> None:
        expect(self.login_message).to_have_text("用户名或密码错误")
