const addBtn = document.querySelector('.btn_add');
const addTodoText = document.querySelector('.add_todo_text');

const tab = document.querySelector('.tab');
const tabList = document.querySelectorAll('.tab li');

const list = document.querySelector('.list');
const undoCount = document.querySelector('.list_footer p');


// 先取出localStorageData的資料渲染在畫面上
let localStorageData = JSON.parse(localStorage.getItem("todoData"));
let todoData = (localStorageData !== null) ? localStorageData : [];

// 預設渲染的 tab 資料是 all
let tabType = "all";

renderData();

// 渲染資料
function renderData() {
    let allTodoStr = '';
    todoData.forEach(function(item, index) {
        let isChecked = item.isDone ? "checked" : "";
        let oneTodoStr = `
                <li>
                    <label class="checkbox" for="">
                        <input type="checkbox" data-index="${index}" ${isChecked}/>
                        <span>${item.text}</span>
                    </label>
                    <a href="#" class="delete" data-index="${index}"></a>
                </li>
            `;
        if ((item.isDone === true) && (tabType === "all" || tabType === "done")) {
            allTodoStr += oneTodoStr;
        } else if ((item.isDone === false) && (tabType === "all" || tabType === "undone")) {
            allTodoStr += oneTodoStr;
        }
    });
    list.innerHTML = allTodoStr;

    const undoData = todoData.filter(function(item) {
        return item.isDone === false;
    });

    undoCount.textContent = ` ${undoData.length} 個待完成項目`;
}

// 新增todo
addBtn.addEventListener("click", function(e) {
    e.preventDefault();
    if (addTodoText.value.trim() === "") return alert("記得輸入代辦事項喔！");

    let oneTodo = {
        text: addTodoText.value.trim(),
        isDone: false
    };
    todoData.push(oneTodo);
    // 放進localStorage
    localStorage.setItem("todoData", JSON.stringify(todoData));
    renderData();

    addTodoText.value = "";
});

// 刪除一筆todo or 切換 未完成/已完成狀態
list.addEventListener("click", function(e) {
    // console.log(e.target.closest("li"));
    let todoIndex = e.target.getAttribute("data-index");
    if ((e.target.nodeName === "A" ) && (e.target.getAttribute("class") === "delete")) {
        // 刪除一筆todo
        e.preventDefault();
        // 取出待辦事項的文字
        const todoText = e.target.parentNode.children[0].getElementsByTagName("span")[0].textContent;
        if (confirm(`確定刪除\n"${todoText}"\n這筆代辦事項？`) === true) {
            todoData.splice(todoIndex,1);
        }
    } else {
        // 點擊刪除按鈕以外的地方就切換 未完成/已完成狀態
        todoData[todoIndex].isDone = !todoData[todoIndex].isDone;
    }
    localStorage.setItem("todoData", JSON.stringify(todoData));
    renderData();
});

// 刪除所有已完成事項
const clearDoneBtn = document.querySelector(".btn_clear_done");
clearDoneBtn.addEventListener("click", function(e) {
    e.preventDefault();
    // filter 未完成事項
    const undoData = todoData.filter(function(item) {
        return item.isDone === false;
    });
    // filter 已完成事項
    const doneData = todoData.filter(function(item) {
        return item.isDone === true;
    });
    if (doneData.length === 0) return alert("目前沒有已完成的事項喔！");
    if (confirm(`確定清除所有已完成的待辦事項？`) === true) {
        todoData = undoData;
    }
    localStorage.setItem("todoData", JSON.stringify(todoData));
    renderData();
});

// tab切換
tab.addEventListener("click", function(e) {
    tabList.forEach(function(item) {
        item.classList.remove("active");
    });
    e.target.classList.add("active");

    // tab切換
    tabType = e.target.getAttribute('data-tab');

    renderData();
});