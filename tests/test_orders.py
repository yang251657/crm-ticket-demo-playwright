from pages.login_page import LoginPage
from pages.order_page import OrderPage


def test_agent_can_search_order(page, app_url: str) -> None:
    login_page = LoginPage(page, app_url)
    order_page = OrderPage(page)

    login_page.open()
    login_page.login("agent", "Password123")

    order_page.open()

    # 搜索已支付订单
    order_page.search("ORD-2001", "PAID")

    # 验证下拉框已选择"已支付"
    order_page.verify_selected_status("PAID")

    # 验证订单查询结果
    order_page.verify_order_visible("ORD-2001")