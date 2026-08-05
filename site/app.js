const loginButton = document.querySelector("#login-button");

// 页面加载后，先隐藏登录按钮
loginButton.classList.add("hidden");

// 5 秒后显示登录按钮，用于练习 Playwright Auto Waiting
setTimeout(() => {
  loginButton.classList.remove("hidden");
}, 5000);


const orders = [
  { id: "ORD-2001", customer: "Alice Chen", amount: 199.00, status: "PAID" },
  { id: "ORD-2002", customer: "Tom Wang", amount: 459.50, status: "SHIPPED" },
  { id: "ORD-2003", customer: "Mia Li", amount: 88.00, status: "COMPLETED" }
];

const tickets = [
  {
    id: "TK-1001",
    orderId: "ORD-2001",
    customer: "Alice Chen",
    type: "退款申请",
    assignee: "Agent A",
    status: "PENDING",
    notes: ["客户反馈商品存在质量问题"]
  },
  {
    id: "TK-1002",
    orderId: "ORD-2002",
    customer: "Tom Wang",
    type: "物流异常",
    assignee: "Agent B",
    status: "PROCESSING",
    notes: ["正在联系物流服务商"]
  },
  {
    id: "TK-1003",
    orderId: "ORD-2003",
    customer: "Mia Li",
    type: "一般咨询",
    assignee: "Agent A",
    status: "RESOLVED",
    notes: ["已向客户解释订单状态"]
  },
  {
    id: "TK-1004",
    orderId: "ORD-2002",
    customer: "Tom Wang",
    type: "商品问题",
    assignee: "Supervisor",
    status: "PROCESSING",
    notes: []
  }
];

const statusText = {
  PAID: "已支付",
  SHIPPED: "已发货",
  COMPLETED: "已完成",
  PENDING: "待处理",
  PROCESSING: "处理中",
  RESOLVED: "已解决",
  CANCELLED: "已取消",
  CLOSED: "已关闭"
};

let currentTicket = null;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1800);
}

function updateMetrics() {
  $("#order-count").textContent = orders.length;
  $("#ticket-count").textContent = tickets.length;
  $("#processing-count").textContent =
    tickets.filter(ticket => ticket.status === "PROCESSING").length;
  $("#pending-count").textContent =
    tickets.filter(ticket => ticket.status === "PENDING").length;
}

function renderOrders(rows = orders) {
  const body = $("#order-body");
  body.innerHTML = "";
  $("#order-empty").classList.toggle("hidden", rows.length > 0);

  rows.forEach(order => {
    const ticketCount = tickets.filter(
      ticket => ticket.orderId === order.id
    ).length;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer}</td>
      <td>$${order.amount.toFixed(2)}</td>
      <td>
        <span class="status-badge">
          ${statusText[order.status]}
        </span>
      </td>
      <td>${ticketCount}</td>
    `;

    body.appendChild(tr);
  });
}

function renderTickets(rows = tickets) {
  const body = $("#ticket-body");
  body.innerHTML = "";
  $("#ticket-empty").classList.toggle("hidden", rows.length > 0);

  rows.forEach(ticket => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${ticket.id}</td>
      <td>${ticket.orderId}</td>
      <td>${ticket.customer}</td>
      <td>${ticket.type}</td>
      <td>${ticket.assignee}</td>
      <td>
        <span class="status-badge">
          ${statusText[ticket.status]}
        </span>
      </td>
      <td>
        <button
          class="table-action detail-button"
          data-ticket-id="${ticket.id}"
          type="button"
        >
          查看详情
        </button>
      </td>
    `;

    body.appendChild(tr);
  });

  $$(".detail-button").forEach(button => {
    button.addEventListener("click", () => {
      openTicketDetail(button.dataset.ticketId);
    });
  });

  updateMetrics();
}

function switchModule(moduleName) {
  $$(".module").forEach(section => {
    section.classList.add("hidden");
  });

  $(`#${moduleName}-module`).classList.remove("hidden");

  $$(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.module === moduleName
    );
  });
}

$("#login-button").addEventListener("click", () => {
  const username = $("#username").value.trim();
  const password = $("#password").value;
  const message = $("#login-message");

  if (username !== "agent" || password !== "Password123") {
    message.textContent = "用户名或密码错误";
    return;
  }

  $("#login-view").classList.add("hidden");
  $("#main-view").classList.remove("hidden");
  $("#welcome-text").textContent = `欢迎，${username}`;
  message.textContent = "";

  updateMetrics();
  renderOrders();
  renderTickets();
});

$("#logout-button").addEventListener("click", () => {
  $("#main-view").classList.add("hidden");
  $("#login-view").classList.remove("hidden");
  $("#password").value = "";
});

$$(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    switchModule(button.dataset.module);
  });
});

$("#order-search-button").addEventListener("click", () => {
  $("#order-loading").classList.remove("hidden");

  setTimeout(() => {
    const keyword = $("#order-search").value.trim().toLowerCase();
    const status = $("#order-status-filter").value;

    const rows = orders.filter(order => {
      const textMatched =
        !keyword ||
        order.id.toLowerCase().includes(keyword) ||
        order.customer.toLowerCase().includes(keyword);

      const statusMatched =
        status === "ALL" || order.status === status;

      return textMatched && statusMatched;
    });

    renderOrders(rows);
    $("#order-loading").classList.add("hidden");
  }, 5000);
});

$("#ticket-search-button").addEventListener("click", () => {
  $("#ticket-loading").classList.remove("hidden");

  setTimeout(() => {
    const keyword = $("#ticket-search").value.trim().toLowerCase();
    const status = $("#ticket-status-filter").value;

    const rows = tickets.filter(ticket => {
      const textMatched =
        !keyword ||
        ticket.id.toLowerCase().includes(keyword) ||
        ticket.orderId.toLowerCase().includes(keyword) ||
        ticket.customer.toLowerCase().includes(keyword);

      const statusMatched =
        status === "ALL" || ticket.status === status;

      return textMatched && statusMatched;
    });

    renderTickets(rows);
    $("#ticket-loading").classList.add("hidden");
  }, 600);
});

function openTicketDetail(ticketId) {
  currentTicket = tickets.find(ticket => ticket.id === ticketId);

  refreshTicketDetail();

  $("#ticket-detail-dialog").showModal();
}

function refreshTicketDetail() {
  $("#detail-ticket-id").textContent = currentTicket.id;
  $("#detail-order-id").textContent = currentTicket.orderId;
  $("#detail-customer").textContent = currentTicket.customer;
  $("#detail-type").textContent = currentTicket.type;
  $("#detail-assignee").textContent = currentTicket.assignee;
  $("#detail-status").textContent = statusText[currentTicket.status];

  $("#ticket-operation-message").textContent = "";

  const noteList = $("#note-list");
  noteList.innerHTML = "";

  currentTicket.notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
    noteList.appendChild(li);
  });
}

$("#assign-button").addEventListener("click", () => {
  currentTicket.assignee = $("#assign-user").value;

  refreshTicketDetail();

  $("#ticket-operation-message").textContent =
    `已分配给 ${currentTicket.assignee}`;

  renderTickets();
});

$("#transfer-button").addEventListener("click", () => {
  currentTicket.assignee = $("#transfer-user").value;
  currentTicket.status = "PROCESSING";

  refreshTicketDetail();

  $("#ticket-operation-message").textContent =
    `已转派给 ${currentTicket.assignee}`;

  renderTickets();
});

$("#transition-button").addEventListener("click", () => {
  currentTicket.status = $("#transition-status").value;

  refreshTicketDetail();

  $("#ticket-operation-message").textContent =
    `状态已更新为 ${statusText[currentTicket.status]}`;

  renderTickets();
});

$("#add-note-button").addEventListener("click", () => {
  const note = $("#ticket-note").value.trim();

  if (!note) {
    $("#ticket-operation-message").textContent = "请输入备注";
    return;
  }

  currentTicket.notes.push(note);

  $("#ticket-note").value = "";

  refreshTicketDetail();

  $("#ticket-operation-message").textContent = "备注添加成功";
});

$("#cancel-ticket-button").addEventListener("click", () => {
  currentTicket.status = "CANCELLED";

  refreshTicketDetail();

  $("#ticket-operation-message").textContent = "工单已取消";

  renderTickets();
});

$("#close-ticket-button").addEventListener("click", () => {
  currentTicket.status = "CLOSED";

  refreshTicketDetail();

  $("#ticket-operation-message").textContent = "工单已关闭";

  renderTickets();
});

$("[data-close-dialog='ticket-detail-dialog']").addEventListener(
  "click",
  () => {
    $("#ticket-detail-dialog").close();
  }
);

$("#create-ticket-button").addEventListener("click", () => {
  const orderSelect = $("#new-ticket-order");

  orderSelect.innerHTML = "";

  orders.forEach(order => {
    const option = document.createElement("option");

    option.value = order.id;
    option.textContent = `${order.id} - ${order.customer}`;

    orderSelect.appendChild(option);
  });

  $("#new-ticket-description").value = "";
  $("#create-ticket-message").textContent = "";

  $("#create-ticket-dialog").showModal();
});

$("[data-close-dialog='create-ticket-dialog']").addEventListener(
  "click",
  () => {
    $("#create-ticket-dialog").close();
  }
);

$("#save-ticket-button").addEventListener("click", () => {
  const orderId = $("#new-ticket-order").value;
  const type = $("#new-ticket-type").value;
  const description = $("#new-ticket-description").value.trim();

  const order = orders.find(item => item.id === orderId);

  if (!description) {
    $("#create-ticket-message").textContent = "请输入问题描述";
    return;
  }

  const id = `TK-${1000 + tickets.length + 1}`;

  tickets.push({
    id,
    orderId,
    customer: order.customer,
    type,
    assignee: "Agent A",
    status: "PENDING",
    notes: [description]
  });

  $("#create-ticket-dialog").close();

  renderTickets();

  showToast(`工单 ${id} 创建成功`);
});

updateMetrics();
renderOrders();
renderTickets();