class item
{
    constructor(title, count, status)
    {
        this.title = title
        this.count = count
        this.status = status // true = purchased, false = not_purchased
    }
}

let items = new Array();
//localStorage.clear()

function initItems()
{
    if (localStorage.getItem("items"))
    {
        items = JSON.parse(localStorage.getItem("items"))
        console.log("Loaded items from localStorage")
    }
    else
    {
        console.log("No items in localStorage")
        items.push(new item("Помідори", 2, true))
        items.push(new item("Печиво", 2, false))
        items.push(new item("Сир", 1, false))
        console.log("Initialized default items")
    }
}
function changeCount(ind, val)
{
    console.log(ind + ":" + val)
    items[ind].count += val
    saveItems()
}

function deleteItem(ind)
{
    items.splice(ind, 1)
    saveItems()
}

function addItem()
{
    let newName = document.getElementById("addName").value
    console.log("Adding item " + newName)
    items.push(new item(newName, 1, false));
    saveItems()
}

function changeStatus(ind)
{
    console.log("Changing status of " + ind)
    items[ind].status = !items[ind].status
    saveItems()
}

function onEdit(ind) 
{
    let oldInput = document.getElementById(`editTitle${ind}`)
    let caretPos = oldInput.selectionStart
    let newName = oldInput.value
    console.log("Changing "+ind+" with name " + newName)
    items[ind].title = newName
    saveItems()
    let newInput = document.getElementById(`editTitle${ind}`)
    newInput.focus()
    newInput.setSelectionRange(caretPos,caretPos)
}

function saveItems()
{
    let res_list = "";
    let res_not_purchased_summary = ""
    let res_purchased_summary = ""
    let index = 0;
    items.forEach(it => {
        if (it.status)
        {
            res_list+=`
            <li class="product-list-item item-not-purchased}">
                <span class="product-name">${it.title}</span>
                <span class="quantity-display">${it.count}</span>
                <button class="btn btn-status" onclick="changeStatus(${index});" data-tooltip="Видалити з купленого">Не куплено</button>
            </li>
            `
            res_purchased_summary+=    `
            <span class="product-item bought" data-tooltip="${it.title}: куплено ${it.count} шт.">
                ${it.title} <span class="amount">${it.count}</span>
            </span>
            `
        }
        else
        {
            res_list+=`
            <li class="product-list-item item-not-purchased">
                <span class="product-name">${it.title}</span> 
                <input type="text" class="product-name-input" id="editTitle${index}" oninput="onEdit(${index});" value="${it.title}" data-tooltip="Редагувати назву товару">
                <div class="quantity-controls">
                    ${it.count == 1 ? `<button class="btn btn-quantity btn-minus disabled" data-tooltip="Зменшити кількість (мінімум 1)">-</button>` : `<button class="btn btn-quantity btn-minus" onclick="changeCount(${index},-1);" data-tooltip="Зменшити кількість">-</button>`}
                    <span class="quantity-value">${it.count}</span>
                    <button class="btn btn-quantity btn-plus" onclick="changeCount(${index},1);" data-tooltip="Збільшити кількість">+</button>
                </div>
                <button class="btn btn-status" onclick="changeStatus(${index});" data-tooltip="Купити">Куплено</button>
                <button class="btn btn-delete" onclick="deleteItem(${index});"">×</button>
            </li>
            `
            res_not_purchased_summary+=    `
            <span class="product-item" data-tooltip="${it.title}: залишилося ${it.count} шт.">
                ${it.title} <span class="amount">${it.count}</span>
            </span>
            `
        }
        index++;
    });
    document.getElementById('product_list').innerHTML = res_list;
    document.getElementById('summary-not-purchased').innerHTML = res_not_purchased_summary
    document.getElementById('summary-purchased').innerHTML = res_purchased_summary
    localStorage.setItem("items", JSON.stringify(items))
}
initItems();
saveItems();
