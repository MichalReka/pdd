function addRowToCart(rowToAdd) {
    var rowObject = document.getElementById("productTable").rows[rowToAdd];
    var stringArr = [];
    var arrOfProducts = [];
    stringArr.push(rowObject.cells[0].innerHTML);
    stringArr.push(rowObject.cells[4].innerHTML);

    if (localStorage.getItem("productsInCart")) {
        arrOfProducts = JSON.parse(localStorage.getItem("productsInCart"));
    }
    arrOfProducts.push(stringArr);
    localStorage.setItem("productsInCart", JSON.stringify(arrOfProducts));
    alert("Poprawnie dodano wiersz z produktem " + rowObject.cells[0].innerHTML + " do koszyka");
}

function prepareCart() {
    var bodyRows = JSON.parse(localStorage.getItem("productsInCart"));
    if (bodyRows) {
        document.getElementById("emptyCart").style.display = "none";
        document.getElementById("cartContent").style.display = "block";
        document.getElementById("buyButton").style.display = "inline-block";
        var cartTable = document.getElementById("cartProducts");
        cartTable.innerHTML = "";
        var tableString = `<thead><tr>
        <th>Nazwa produktu</th>
        <th>Cena produktu</th>
        <th>Liczba sztuk</th>
        </tr></thead/><tbody>`;
        for (var i = 0; i < bodyRows.length; i++) {
            tableString = tableString + `<tr>
        <td>` + bodyRows[i][0] + `</td>
        <td id="cartItemPrice` + i + `">` + bodyRows[i][1] + `</td>
        <td><input type="number" min="1" value=1 id="cartItemQuantity` + i + `" onchange="sumPrice()"></td>
        </tr>`;
        }
        cartTable.innerHTML = tableString + "</tbody>";
        sumPrice();
    } else {
        document.getElementById("emptyCart").style.display = "block";
        document.getElementById("cartContent").style.display = "none";
        document.getElementById("buyButton").style.display = "none";
    }

}