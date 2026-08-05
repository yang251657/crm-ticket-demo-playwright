# CRM 工单系统 Playwright Demo

## Demo 功能

### 登录
- 正确账号登录
- 错误密码提示
- 退出登录

账号：

```text
agent
Password123
```

### 订单模块
- 订单列表
- 按订单号或客户名称查询
- 按订单状态筛选
- 显示关联工单数量

### 工单模块
- 工单列表
- 查询和状态筛选
- 新建工单
- 查看工单详情
- 分配工单
- 转派工单
- 状态流转
- 添加备注
- 取消工单
- 关闭工单

## 项目结构

```text
site/                  可视化 CRM 网页
pages/                 Page Object 层
tests/                 Test Case 层
conftest.py            Fixture：启动本地网站
.github/workflows/     GitHub Actions CI
```

## Windows 安装

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m playwright install chromium
```

PowerShell 无法激活时：

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m playwright install chromium
```

## 可视化运行

```powershell
pytest --headed --browser chromium
```

仅运行工单测试：

```powershell
pytest tests/test_tickets.py --headed --browser chromium
```

调试模式：

```powershell
$env:PWDEBUG="1"
pytest tests/test_tickets.py --browser chromium
```

失败时保留 Trace 和 Screenshot：

```powershell
pytest --browser chromium --tracing retain-on-failure --screenshot only-on-failure
```

## 推荐实操顺序

1. 运行登录测试。
2. 运行订单查询测试。
3. 运行工单分配测试。
4. 修改按钮文字，让 Locator 故意失败。
5. 查看 Screenshot 和 Trace。
6. 修复 Locator。
7. 新增“取消工单”测试。
8. 将项目上传 GitHub，观察 Actions 自动运行。
