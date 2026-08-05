from playwright.sync_api import Page, expect


class OrderPage:
    def __init__(self, page: Page) -> None:
        self.page = page
        self.order_menu = page.get_by_role("button", name="订单模块")
        self.search_input = page.get_by_label("搜索订单")
        self.status_filter = page.get_by_label("订单状态")
        self.search_button = page.get_by_role("button", name="查询")
        self.loading = page.get_by_text("订单查询中...")
        self.rows = page.locator("#order-body tr")

    def open(self) -> None:
        self.order_menu.click()

    def search(self, keyword: str, status: str = "ALL") -> None:
        self.search_input.fill(keyword)
        self.status_filter.select_option(status)
        self.search_button.click()

        # 等待 Loading 出现
        expect(self.loading).to_be_visible()

        # 等待 Loading 消失
        expect(self.loading).to_be_hidden()

    def verify_order_visible(self, order_id: str) -> None:
        expect(self.rows.filter(has_text=order_id)).to_have_count(1)

    # ⭐ 新增：验证下拉框当前选中的值
    def verify_selected_status(self, status: str) -> None:
        expect(self.status_filter).to_have_value(status)