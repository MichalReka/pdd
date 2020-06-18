var selectedOptions = "";
var selectedCategory;
var selectedGrade;
var productNamesArray = [];
var noProducts = 0;
var jsonTable;
$.getJSON("data.json", function (json) {
    jsonTable = json;
    console.log(jsonTable);
});

function viewSelection() {
    var displaySelect = document.getElementsByClassName("displayOptions");
    var option;
    for (option of displaySelect) {
        if (option.selected) {
            if (option.value == "list") {
                document.getElementById("productTableDiv").style.display = "block";
                document.getElementById("productGallery").style.display = "none";
            } else if (option.value == "grid") {
                document.getElementById("productTableDiv").style.display = "none";
                document.getElementById("productGallery").style.display = "block";
            }
            break;
        }
    }
}

function jsonToProductTable() {
    var productTable = document.getElementById("productTableDiv");
    if (productTable.classList.contains("empty")) {
        productTable.classList.remove("empty");
    }
    for (var i = 0; i < jsonTable.length; i++) {
        var options = "";
        for (var option of jsonTable[i].product_options) {
            options = options + option + ",";
        }
        options.slice(-1);
        noProducts++;
        productNamesArray.push(jsonTable[i].product_name);
        var nettoPrice=(jsonTable[i].product_price - parseFloat((jsonTable[i].product_price * jsonTable[i].product_vat / 100))).toFixed(2);
        var newRow = `
            <tr id="row` + noProducts + `">
                <td id="name` + noProducts + `">` + jsonTable[i].product_name + `</td>
                <td>` + jsonTable[i].product_code + `</td>
                <td>` + nettoPrice + `</td>
                <td>` + jsonTable[i].product_vat + `</td>
                <td>` + jsonTable[i].product_price + `</td>
                <td>` + jsonTable[i].product_category + `</td>
                <td>` + options + `</td>
                <td>` + jsonTable[i].product_grade + `</td>
                <td><a id="productPhotoRow`+noProducts+`" href="` + jsonTable[i].image_source + `" data-toggle="lightbox" data-type="image">Pokaż zdjęcie</a></td>
                <td>
                    <label type="button" class="btn btn-success" onclick="addRowToCart(` + noProducts + `)">Dodaj do koszyka</label>
                    <label type="button" class="btn btn-secondary" onclick="editRow(` + noProducts + `)">Edytuj</label>
                    <label type="button" class="btn btn-danger" onclick="deleteRow(` + noProducts + `)">Usuń</label>
                </td>
            </tr>`;
        $("#productTable tbody").append(newRow);
        var newCard = `
        <div class="col-md-4 col-lg-3" id="productCard`+noProducts+`">
        <div class="card border-0 transform-on-hover" >
            
	        <img src="`+jsonTable[i].image_source+`" alt="Zdjecie produktu" class="img-fluid card-img-top" onerror="this.onerror=null;this.src='noimage.jpg';">
            <div class="card-body">
                <h5>`+jsonTable[i].product_name+`</h5>
                <p class="text-muted card-text">Cena: `+nettoPrice+` (`+jsonTable[i].product_price+`)</p>
        </div>
        </div>
        `;
        $("#productGalleryContent").append(newCard);
        $("#productTable").trigger("update");
    }
}

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

function sumPrice() {
    var sumPrice = 0;
    var tableRows = document.getElementById("cartProducts").rows;
    var radioButtons = document.getElementsByName("deliveryRadio");
    for (var i = 0; i < tableRows.length - 1; i++) {
        var cartItemPrice = document.getElementById("cartItemPrice" + i).innerHTML;
        var cartItemQuantity = document.getElementById("cartItemQuantity" + i).value;
        sumPrice = sumPrice + parseFloat(cartItemPrice) * cartItemQuantity;
    }
    for (var radioButton of radioButtons) {
        if (radioButton.checked) {
            sumPrice = sumPrice + parseFloat(radioButton.value);
            break;
        }
    }
    document.getElementById("sumPrice").innerHTML = parseFloat(sumPrice).toFixed(2);
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
    document.getElementById("productPhoto").value = $("#productPhotoRow"+rowToEdit).attr("href");

}

function deleteRow(rowToDelete) {
    var nameToDelete = document.getElementById("name" + rowToDelete).innerHTML;
    var index = productNamesArray.indexOf(nameToDelete);
    alert("Poprawnie usunięto wiersz z produktem " + productNamesArray[index]);
    delete productNamesArray[index];
    $('#productCard'+rowToDelete).remove();
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
    var productName = document.getElementById("name" + rowToEdit).innerHTML;
    var index = productNamesArray.indexOf(productName);
    var oldName = productNamesArray[index];
    productNamesArray[index] = "";
    if (validateProductForm()) {
        var card=document.getElementById("productCard"+rowToEdit);
        var row = document.getElementById("productTable").rows[rowToEdit];
        row.cells[0].innerHTML = document.getElementById("productName").value;
        row.cells[1].innerHTML = document.getElementById("productCode").value;
        row.cells[2].innerHTML = document.getElementById("productNetto").value;
        row.cells[3].innerHTML = document.getElementById("productVat").value;
        row.cells[4].innerHTML = document.getElementById("productBrutto").value;
        row.cells[5].innerHTML = selectedCategory;
        row.cells[6].innerHTML = selectedOptions;
        row.cells[7].innerHTML = selectedGrade
        row.cells[8].innerHTML = `<a href="`+document.getElementById("productPhoto").value+`">Pokaż zdjęcie</a>`;
        card.innerHTML=`<div class="card border-0 transform-on-hover" >
        <img src="`+document.getElementById("productPhoto").value+`" alt="Zdjecie produktu" class="img-fluid card-img-top" onerror="this.onerror=null;this.src='noimage.jpg';">
        <div class="card-body">
            <h5>`+document.getElementById("productName").value+`</h5>
            <p class="text-muted card-text">Cena: `+document.getElementById("productNetto").value+` (`+document.getElementById("productBrutto").value+`)</p>
        </div>`;
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
        noProducts++;
        var newRow = `
            <tr id="row` + noProducts + `">
                <td id="name` + noProducts + `">` + productName.value + `</td>
                <td>` + productCode.value + `</td>
                <td>` + productNetto.value + `</td>
                <td>` + productVat.value + `</td>
                <td>` + productBrutto.value + `</td>
                <td>` + selectedCategory + `</td>
                <td>` + selectedOptions + `</td>
                <td>` + selectedGrade + `</td>
                <td><a id="productPhotoRow`+noProducts+`" href="` + productPhoto.value + `" data-toggle="lightbox" data-type="image">Pokaż zdjęcie</a></td>
                <td>
                    <label type="button" class="btn btn-success" onclick="addRowToCart(` + noProducts + `)">Dodaj do koszyka</label>
                    <label type="button" class="btn btn-secondary" onclick="editRow(` + noProducts + `)">Edytuj</label>
                    <label type="button" class="btn btn-danger" onclick="deleteRow(` + noProducts + `)">Usuń</label>
                </td>
            </tr>`;

        $("#productTable tbody").append(newRow);
        $("#productTable").trigger("update");
        var newCard = `
        <div class="col-md-4 col-lg-3" id="productCard`+noProducts+`">
        <div class="card border-0 transform-on-hover" >
            
	        <img src="`+productPhoto.value+`" alt="Zdjecie produktu" class="img-fluid card-img-top" onerror="this.onerror=null;this.src='noimage.jpg';">
            <div class="card-body">
                <h5>`+ productName.value+`</h5>
                <p class="text-muted card-text">Cena: `+productNetto.value+` (`+productBrutto.value+`)</p>
        </div>
        </div>
        `;
        $("#productGalleryContent").append(newCard);
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
    var ifError = false;
    if (productImg.value == "") {
        feedback.innerHTML = "Podaj nazwe obrazka";
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