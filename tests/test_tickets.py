from pages.login_page import LoginPage
from pages.ticket_page import TicketPage


def test_agent_can_assign_ticket(page, app_url: str) -> None:
    login_page = LoginPage(page, app_url)
    ticket_page = TicketPage(page)

    login_page.open()
    login_page.login("agent", "Password123")
    ticket_page.open()
    ticket_page.search("TK-1001")
    ticket_page.open_detail("TK-1001")
    ticket_page.assign_to("Supervisor")
    ticket_page.verify_detail_assignee("Supervisor")


def test_agent_can_transfer_ticket(page, app_url: str) -> None:
    login_page = LoginPage(page, app_url)
    ticket_page = TicketPage(page)

    login_page.open()
    login_page.login("agent", "Password123")
    ticket_page.open()
    ticket_page.open_detail("TK-1002")
    ticket_page.transfer_to("Refund Team")
    ticket_page.verify_detail_assignee("Refund Team")
    ticket_page.verify_detail_status("处理中")


def test_agent_can_update_ticket_status(page, app_url: str) -> None:
    login_page = LoginPage(page, app_url)
    ticket_page = TicketPage(page)

    login_page.open()
    login_page.login("agent", "Password123")
    ticket_page.open()
    ticket_page.open_detail("TK-1001")
    ticket_page.update_status("RESOLVED")
    ticket_page.verify_detail_status("已解决")


def test_agent_can_add_ticket_note(page, app_url: str) -> None:
    login_page = LoginPage(page, app_url)
    ticket_page = TicketPage(page)

    login_page.open()
    login_page.login("agent", "Password123")
    ticket_page.open()
    ticket_page.open_detail("TK-1004")
    ticket_page.add_note("已联系客户补充问题截图")
    ticket_page.verify_note_visible("已联系客户补充问题截图")
