import http.server
import os
import socketserver
import threading
from pathlib import Path

import pytest


HOST = "127.0.0.1"
PORT = 8000


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:
        pass


@pytest.fixture(scope="session")
def app_url() -> str:
    site_dir = Path(__file__).parent / "site"

    handler = lambda *args, **kwargs: QuietHandler(
        *args,
        directory=str(site_dir),
        **kwargs,
    )

    with socketserver.TCPServer((HOST, PORT), handler) as server:
        thread = threading.Thread(
            target=server.serve_forever,
            daemon=True,
        )
        thread.start()

        yield f"http://{HOST}:{PORT}"

        server.shutdown()
        thread.join(timeout=2)


# Playwright 浏览器启动配置
@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    # GitHub Actions 等 CI 环境通常会设置 CI=true
    is_ci = os.getenv("CI", "").lower() == "true"

    return {
        **browser_type_launch_args,

        # 本地显示浏览器；CI 使用无头模式
        "headless": is_ci,

        # 本地慢速展示；CI 正常速度执行
        "slow_mo": 0 if is_ci else 1500,
    }