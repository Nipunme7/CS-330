function changeValue(value, price){
    let input_element = document.querySelector(`#quantity_input_${value}`);
    let quantity_element = document.querySelector(`#quantity_display_${value}`)
    quantity_element.innerText = `Quantity : ${input_element.value}`;


    let total_element = document.querySelector(`#total_display_${value}`)
    total_element.innerText = `$ ${Number(price * input_element.value).toFixed(2)}`
}

function order_process(){
    let parent_element = document.createElement("div");
    parent_element.setAttribute("class", "alert alert-warning alert-dismissible fade show")
    parent_element.setAttribute("role", "alert")
    parent_element.innerText = "Order processed"
    let button  = document.createElement("button")
    button.setAttribute("style", "float:right;")
    button.innerText = 'X'
    button.addEventListener("click", () => {document.querySelector(".alert").remove()})
    parent_element.appendChild(button)
    document.querySelector("#checkout_body").appendChild(parent_element)
}