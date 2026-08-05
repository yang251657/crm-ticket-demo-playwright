from playwright.sync_api import Page, expect


class TicketPage:
    def __init__(self, page: Page) -> None:
        self.page = page
        self.ticket_menu = page.get_by_role("button", name="工单模块")
        self.search_input = page.get_by_label("搜索工单")
        self.status_filter = page.get_by_label("工单状态")
        self.search_button = page.get_by_role("button", name="查询")
        self.rows = page.locator("#ticket-body tr")
        self.operation_message = page.locator("#ticket-operation-message")

    def open(self) -> None:
        self.ticket_menu.click()

    def search(self, keyword: str, status: str = "ALL") -> None:
        self.search_input.fill(keyword)
        self.status_filter.select_option(status)
        self.search_button.click()

    def verify_ticket_visible(self, ticket_id: str) -> None:
        expect(self.rows.filter(has_text=ticket_id)).to_have_count(1)

    def open_detail(self, ticket_id: str) -> None:
        row = self.rows.filter(has_text=ticket_id)
        row.get_by_role("button", name="查看详情").click()

    def assign_to(self, assignee: str) -> None:
        self.page.get_by_label("分配给").select_option(assignee)
        self.page.get_by_role("button", name="分配", exact=True).click()

    def transfer_to(self, assignee: str) -> None:
        self.page.get_by_label("转派给").select_option(assignee)
        self.page.get_by_role("button", name="转派", exact=True).click()

    def update_status(self, status: str) -> None:
        self.page.get_by_label("状态流转").select_option(status)
        self.page.get_by_role("button", name="更新状态").click()

    def add_note(self, note: str) -> None:
        self.page.get_by_label("添加备注").fill(note)
        self.page.get_by_role("button", name="添加备注").click()

    def cancel_ticket(self) -> None:
        self.page.get_by_role("button", name="取消工单").click()

    def close_ticket(self) -> None:
        self.page.get_by_role("button", name="关闭工单").click()

    def verify_operation_message(self, message: str) -> None:
        expect(self.operation_message).to_have_text(message)

    def verify_detail_status(self, status_text: str) -> None:
        expect(self.page.locator("#detail-status")).to_have_text(status_text)

    def verify_detail_assignee(self, assignee: str) -> None:
        expect(self.page.locator("#detail-assignee")).to_have_text(assignee)

    def verify_note_visible(self, note: str) -> None:
        expect(self.page.get_by_role("listitem").filter(has_text=note)).to_be_visible()
