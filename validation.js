var selectedOptions = "";
var selectedCategory;
var selectedGrade;
var productNamesArray = [];
var noRows = 0;

function changeFilter(thisSelectedIndex) {
    switch (thisSelectedIndex) {
        case 0:
            $("#productTable").trigger("sorton", [
                [
                    [0, 0]
                ]
            ]);
            break;
        case 1:
            $("#productTable").trigger("sorton", [
                [
                    [0, 1]
                ]
            ]);
            break;
        case 2:
            $("#productTable").trigger("sorton", [
                [
                    [4, 0]
                ]
            ]);
            break;
        case 3:
            $("#productTable").trigger("sorton", [
                [
                    [4, 1]
                ]
            ]);
            break;
        case 4:
            $("#productTable").trigger("sorton", [
                [
                    [7, 0]
                ]
            ]);
            break;
        case 5:
            $("#productTable").trigger("sorton", [
                [
                    [7, 1]
                ]
            ]);
            break;
    }
}

function addRowToCart(rowToAdd) {
    var rowObject = document.getElementById("productTable").rows[rowToAdd];
    var stringArr = [];
    var arrOfProducts = [];
    /*
    for (var i = 0; i < rowObject.cells.length - 1; i++) {
        stringArr.push(rowObject.cells[i].innerHTML);
    }
    */
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
    var cartTable = document.getElementById("cartProducts");
    cartTable.innerHTML = "";
    var tableString = `<tr>
    <th>Nazwa produktu</th>
    <th>Cena produktu</th>
    <th>Liczba sztuk</th>
</tr>`;

    var bodyRows = JSON.parse(localStorage.getItem("productsInCart"));
    for (var i = 0; i < bodyRows.length; i++) {
        tableString = tableString + `<tr>
        <td>` + bodyRows[i][0] + `</td>
        <td>` + bodyRows[i][1] + `</td>
        <td><input type="number" min="1" value=1></td>
        </tr>`;
    }
    cartTable.innerHTML = tableString;

}

function editRow(rowToEdit) {
    var row = document.getElementById("productTable").rows[rowToEdit];
    document.getElementById("submitFormButton").innerHTML = "Edytuj";
    document.getElementById("submitFormButton").setAttribute("onClick", "editProduct(" + rowToEdit + ")");;
    document.getElementById("productName").value = row.cells[0].innerHTML;
    document.getElementById("productCode").value = row.cells[1].innerHTML;
    document.getElementById("productNetto").value = row.cells[2].innerHTML;
    document.getElementById("productVat").value = row.cells[3].innerHTML;
    document.getElementById("productBrutto").value = row.cells[4].innerHTML;
    document.getElementById("productCategory").value = row.cells[5].innerHTML;
    var optionsString = row.cells[6].innerHTML;
    var optionCheckboxList = document.getElementsByClassName("optionCheckbox");
    for (var optionCheckbox of optionCheckboxList) {
        if (optionsString.includes(optionCheckbox.value)) {
            optionCheckbox.checked = true;
        } else {
            optionCheckbox.checked = false;
        }
    }
    var radioList = document.getElementsByClassName("productGrade");
    for (var radioButton of radioList) {
        if (radioButton.value == row.cells[7].innerHTML) {
            radioButton.checked = true;
            break;
        }
    }
    document.getElementById("productPhoto").value = row.cells[8].innerHTML;

}

function deleteRow(rowToDelete) {
    var nameToDelete = document.getElementById("name" + rowToDelete).innerHTML;
    var index = productNamesArray.indexOf(nameToDelete);
    alert("Poprawnie usunięto wiersz z produktem " + productNamesArray[index]);
    delete productNamesArray[index];
    $('#productTable tbody #row' + rowToDelete).remove();
}

function clearForm() {
    document.getElementById("productName").value = "";
    document.getElementById("productCode").value = "";
    document.getElementById("productNetto").value = "";
    document.getElementById("productVat").value = "";
    document.getElementById("productBrutto").value = "";
    document.getElementById("productCategory").value = "";
    var optionCheckboxList = document.getElementsByClassName("optionCheckbox");
    for (var optionCheckbox of optionCheckboxList) {
        optionCheckbox.checked = false;
    }
    var radioList = document.getElementsByClassName("productGrade");
    for (var radioButton of radioList) {
        radioButton.checked = false;
    }
    document.getElementById("productPhoto").value = "";
}

function editProduct(rowToEdit) {
    var productName = document.getElementById("name" + rowToDelete).innerHTML;
    var index = productNamesArray.indexOf(productName);
    var oldName = productNamesArray[index];
    productNamesArray[index] = "";
    if (validateProductForm()) {
        var row = document.getElementById("productTable").rows[rowToEdit];
        row.cells[0].innerHTML = document.getElementById("productName").value;
        row.cells[1].innerHTML = document.getElementById("productCode").value;
        row.cells[2].innerHTML = document.getElementById("productNetto").value;
        row.cells[3].innerHTML = document.getElementById("productVat").value;
        row.cells[4].innerHTML = document.getElementById("productBrutto").value;
        row.cells[5].innerHTML = selectedCategory;
        row.cells[6].innerHTML = selectedOptions;
        row.cells[7].innerHTML = selectedGrade
        row.cells[8].innerHTML = document.getElementById("productPhoto").value;
        document.getElementById("submitFormButton").innerHTML = "Dodaj";
        document.getElementById("submitFormButton").setAttribute("onClick", "addNewProduct()");
        alert("Poprawnie zedytowano produkt!");
        $("#productTable").trigger("update");
        clearForm();
    } else {
        productNamesArray[index] = oldName;
    }
}

function addNewProduct() {
    if (validateProductForm()) {
        productNamesArray.push(productName.value);
        alert("Dodano pomyslnie produkt!");
        var productTable = document.getElementById("productTableDiv");
        if (productTable.classList.contains("empty")) {
            productTable.classList.remove("empty");

        }
        noRows++;
        var newRow = `
            <tr id="row` + noRows + `">
                <td id="name` + noRows + `">` + productName.value + `</td>
                <td>` + productCode.value + `</td>
                <td>` + productNetto.value + `</td>
                <td>` + productVat.value + `</td>
                <td>` + productBrutto.value + `</td>
                <td>` + selectedCategory + `</td>
                <td>` + selectedOptions + `</td>
                <td>` + selectedGrade + `</td>
                <td>` + productPhoto.value + `</td>
                <td>
                    <label type="button" class="btn btn-success" onclick="addRowToCart(` + noRows + `)">Dodaj do koszyka</label>
                    <label type="button" class="btn btn-secondary" onclick="editRow(` + noRows + `)">Edytuj</label>
                    <label type="button" class="btn btn-danger" onclick="deleteRow(` + noRows + `)">Usuń</label>
                </td>
            </tr>`;
        $("#productTable tbody").append(newRow);
        $("#productTable").trigger("update");
        clearForm();

    }
}

function validateProductForm() {
    var ifError = [];
    ifError.push(validateProductCode());
    ifError.push(validateProductName());
    ifError.push(validateProductNetto());
    ifError.push(validateProductVat());
    ifError.push(validateOptionCheckbox());
    ifError.push(validateProductGrade());
    ifError.push(validateProductCategory());
    ifError.push(validateImg());
    var currErrorCheck;
    for (currErrorCheck of ifError) {
        if (currErrorCheck == true) {
            return false;
        }
    }
    return true;

}

function validateProductName() {

    var productName = document.getElementById("productName");
    var feedback = document.getElementById("productNameFeedback");
    var objRegExp = /^([AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż] *)+$/;
    if (productName.value == "") {
        feedback.innerHTML = "Podaj nazwe towaru";
        feedback.classList.add("invalid-feedback");
        productName.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productName.classList.remove("is-valid");
        return true;
    } else if (productName.value.length > 10) {
        feedback.innerHTML = "Za dluga nazwa (max 10 znakow)";
        feedback.classList.add("invalid-feedback");
        productName.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productName.classList.remove("is-valid");
        return true;
    } else if (!objRegExp.test(productName.value)) {
        feedback.innerHTML = "Nieprawidłowy format nazwy - dopuszczalne tylko litery i spacje";
        feedback.classList.add("invalid-feedback");
        productName.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productName.classList.remove("is-valid");
        return true;
    } else if (productNamesArray.length) {
        if (productNamesArray.includes(productName.value)) {
            feedback.innerHTML = "Produkt ten został już wcześniej dodany, proszę podać inny produkt";
            feedback.classList.add("invalid-feedback");
            productName.classList.add("is-invalid");
            feedback.classList.remove("valid-feedback");
            productName.classList.remove("is-valid");
            return true;
        }
    }
    feedback.classList.remove("invalid-feedback");
    productName.classList.remove("is-invalid");
    feedback.classList.add("valid-feedback");
    productName.classList.add("is-valid");
    feedback.innerHTML = "";
    return false;
}

function validateProductCode() {
    var productCode = document.getElementById("productCode");
    var feedback = document.getElementById("productCodeFeedback");
    var objRegExp = /^[A-Za-z0-9]{2}-[A-Za-z0-9]{2}$/;
    var ifError = false;
    if (productCode.value == "") {
        feedback.innerHTML = "Podaj kod towaru";
        feedback.classList.add("invalid-feedback");
        productCode.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productCode.classList.remove("is-valid");
        ifError = true;
    } else if (!objRegExp.test(productCode.value)) {
        feedback.innerHTML = "Nieprawidłowy format - dopuszczalne tylko cyfry i litery, format: XX-XX";
        feedback.classList.add("invalid-feedback");
        productCode.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productCode.classList.remove("is-valid");
        ifError = true;
    } else {
        feedback.classList.remove("invalid-feedback");
        productCode.classList.remove("is-invalid");
        feedback.classList.add("valid-feedback");
        productCode.classList.add("is-valid");
        feedback.innerHTML = "";
        ifError = false;
    }
    return ifError;
}

function validateProductNetto(ifCompute = true) {
    var productNetto = document.getElementById("productNetto");
    var feedback = document.getElementById("productNettoFeedback");
    var objRegExp = /^[0-9]+(.[0-9][0-9])*/;
    var ifError = false;
    if (productNetto.value == "") {
        feedback.innerHTML = "Podaj cenę netto towaru";
        feedback.classList.add("invalid-feedback");
        productNetto.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productNetto.classList.remove("is-valid");
        ifError = true;
    } else if (!objRegExp.test(productNetto.value)) {
        feedback.innerHTML = "Nieprawidłowy format - dopuszczalne tylko cyfry w formacie 1234.56 lub 1234";
        feedback.classList.add("invalid-feedback");
        productNetto.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productNetto.classList.remove("is-valid");
        ifError = true;
    } else {
        feedback.classList.remove("invalid-feedback");
        productNetto.classList.remove("is-invalid");
        feedback.classList.add("valid-feedback");
        productNetto.classList.add("is-valid");
        feedback.innerHTML = "";
        ifError = false;
        var tempNetto = parseFloat(productNetto.value);
        tempNetto = tempNetto.toFixed(2);
        productNetto.value = String(tempNetto);
        if (ifCompute) {
            computeBrutto();
        }

    }
    return ifError;
}

function validateProductVat(ifCompute = true) {

    var productVat = document.getElementById("productVat");
    var feedback = document.getElementById("productVatFeedback");
    var objRegExp = /^[0-9]+$/;
    var ifError = false;
    if (productVat.value == "") {
        feedback.innerHTML = "Podaj VAT towaru";
        feedback.classList.add("invalid-feedback");
        productVat.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productVat.classList.remove("is-valid");
        ifError = true;
    } else if (objRegExp.test(productVat.value) == false || productVat.value.length > 2) {
        feedback.innerHTML = "Nieprawidłowy format - dopuszczalne tylko cyfry w formacie XX";
        feedback.classList.add("invalid-feedback");
        productVat.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productVat.classList.remove("is-valid");
        ifError = true;
    } else {
        feedback.classList.remove("invalid-feedback");
        productVat.classList.remove("is-invalid");
        feedback.classList.add("valid-feedback");
        productVat.classList.add("is-valid");
        feedback.innerHTML = "";
        ifError = false;
        if (ifCompute) {
            computeBrutto();
        }
    }
    return ifError;
}

function computeBrutto() {
    if (validateProductNetto(false) == false && validateProductVat(false) == false) {
        var productVat = parseFloat(document.getElementById("productVat").value);
        var productNetto = parseFloat(document.getElementById("productNetto").value);
        var productBrutto = productNetto + productVat * productNetto * 0.01;
        productBrutto = productBrutto.toFixed(2);
        document.getElementById("productBrutto").value = productBrutto;
    }
}

function validateOptionCheckbox() {
    var feedback = document.getElementById("optionFeedback");
    var optionCheckboxList = document.getElementsByClassName("optionCheckbox");
    var optionCheckbox;
    var howManyChecked = 0;
    selectedOptions = "";
    for (optionCheckbox of optionCheckboxList) {
        if (optionCheckbox.checked) {
            if (selectedOptions) {
                selectedOptions = selectedOptions + ",";
            }
            selectedOptions = selectedOptions + optionCheckbox.value;
            howManyChecked++;
        }
    }
    if (howManyChecked < 2) {
        feedback.classList.add("invalid-feedback");
        feedback.classList.remove("valid-feedback");

        feedback.innerHTML = "Zaznacz co najmniej dwie opcje";

        return true;
    } else {
        feedback.innerHTML = "";
        feedback.classList.remove("invalid-feedback");
        feedback.classList.add("valid-feedback");

        return false;
    }
}

function validateProductGrade() {
    var feedback = document.getElementById("radioFeedback");
    var radioList = document.getElementsByClassName("productGrade");
    var radioButton;
    for (radioButton of radioList) {
        if (radioButton.checked) {
            feedback.classList.add("valid-feedback");
            feedback.classList.remove("invalid-feedback");
            feedback.innerHTML = "";
            selectedGrade = radioButton.value;
            return false;
        }
    }
    feedback.classList.remove("valid-feedback");
    feedback.classList.add("invalid-feedback");
    feedback.innerHTML = "Proszę zaznaczyć ocenę produktu";
    return true;
}

function validateProductCategory() {
    var feedback = document.getElementById("categoryFeedback");
    var categoryList = document.getElementById("productCategory");
    var category;
    for (category of categoryList) {

        if (category.value == "0") {
            if (category.selected == true) {
                feedback.classList.remove("valid-feedback");
                feedback.classList.add("invalid-feedback");
                feedback.innerHTML = "Proszę zaznaczyć kategorie produktu";
                return true;
            }
        } else if (category.selected == true) {
            feedback.classList.add("valid-feedback");
            feedback.classList.remove("invalid-feedback");
            feedback.innerHTML = "";
            selectedCategory = category.value;
            return false;
        }
    }

}

function validateImg() {
    var productImg = document.getElementById("productPhoto");
    var feedback = document.getElementById("imgFeedback");
    var objRegExp = /\./;
    var ifError = false;
    if (productImg.value == "") {
        feedback.innerHTML = "Podaj nazwe obrazka";
        feedback.classList.add("invalid-feedback");
        productImg.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productImg.classList.remove("is-valid");
        ifError = true;
    } else if (!objRegExp.test(productImg.value)) {
        feedback.innerHTML = "Nieprawidłowy format nazwy";
        feedback.classList.add("invalid-feedback");
        productImg.classList.add("is-invalid");
        feedback.classList.remove("valid-feedback");
        productImg.classList.remove("is-valid");
        ifError = true;
    } else {
        feedback.innerHTML = "";
        feedback.classList.remove("invalid-feedback");
        productImg.classList.remove("is-invalid");
        feedback.classList.add("valid-feedback");
        productImg.classList.add("is-valid");
        ifError = false;
    }
}