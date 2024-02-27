//Dallin Jackson 2/14/24
//kayliescreations.biz

let shopCardsJson;
fetch('/shopCards.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        shopCardsJson = data;
        console.log('Shop Cards: ', shopCardsJson);
        buildShopCardForm(shopCardsJson);
        rebuildShopDeleteForm(shopCardsJson);

    })
    .catch(error => {
        console.error('Error:', error);
    });


function deleteShopCard(shopCardsJson) {
    let selector = document.querySelector('select');
    let selectedOption = selector.options[selector.selectedIndex];
    let cardId = selectedOption.id;

    let cardToDelete = shopCardsJson.find(card => card['cardId'] === cardId);
    let index = shopCardsJson.indexOf(cardToDelete);
    shopCardsJson.splice(index, 1);

    fetch('/shopCards.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopCardsJson),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            rebuildShopDeleteForm(shopCardsJson);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function rebuildShopDeleteForm(shopCardsJson) {
    let container = document.getElementById('deleteSelector');
    container.innerHTML = '';

    let selector = document.createElement('select');
    selector.className = 'form-select';
    selector.ariaLabel = 'Default select';

    let baseOption = document.createElement('option');
    baseOption.textContent = 'Choose card to delete';

    selector.appendChild(baseOption)

    shopCardsJson.forEach(cardData => {
        let id = cardData['cardId'];
        let title = cardData['title'];

        let newOption = document.createElement('option');
        newOption.textContent = title;
        newOption.id = id;

        selector.appendChild(newOption);
    })

    container.appendChild(selector);

    //build a button to submit
    let button = document.createElement('button');
    button.className = 'btn btn-danger';
    button.textContent = 'Delete Shop Card'
    button.type = 'button'
    button.style.margin = '.5em';
    button.onclick = () => deleteShopCard(shopCardsJson);
    container.appendChild(button);
}


{/* <form>
                <h4>Upload a New Item to Shop</h4>
                <div class="mb-3">
                    <label class="form-label">Admin Password</label>
                    <input type="password" class="form-control" placeholder="Kronos" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input type="text" class="form-control" placeholder="Unique Name" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Price</label>
                    <input type="text" class="form-control" placeholder="$$$" required>
                </div>
                <div class="mb-3">
                    <label for="exampleFormControlTextarea1" class="form-label">Product Description</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">itemID: Needs to be Unique</label>
                    <input type="text" class="form-control" placeholder="strawberryCow" required>
                </div>
            </form> */}

function buildShopCardForm(shopCardsJson) {
    let container = document.getElementById('newShopCardForm');
    container.style.padding = '1em';
    container.innerHTML = '';

    let form = document.createElement('form');
    let header = document.createElement('h4');
    header.textContent = 'Upload a New Item to Shop';
    form.appendChild(header);

    let div1 = document.createElement('div');
    div1.className = 'mb-3';
    form.appendChild(div1);

    let label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = 'Admin Password';
    div1.appendChild(label);

    let passwordInput = document.createElement('input');
    passwordInput.className = 'form-control';
    passwordInput.placeholder = 'Admin Password';
    passwordInput.required = true;
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    div1.appendChild(passwordInput);

    let div2 = document.createElement('div');
    div2.className = 'mb-3';
    form.appendChild(div2);

    let titleLabel = document.createElement('label');
    titleLabel.className = 'form-label';
    titleLabel.textContent = 'Title';
    div2.appendChild(titleLabel);

    let titleInput = document.createElement('input');
    titleInput.className = 'form-control';
    titleInput.placeholder = 'Title';
    titleInput.required = true;
    titleInput.type = 'text';
    titleInput.id = 'title';
    div2.appendChild(titleInput);

    let div3 = document.createElement('div');
    div3.className = 'mb-3';
    form.appendChild(div3);

    let priceLabel = document.createElement('label');
    priceLabel.className = 'form-label';
    priceLabel.textContent = 'Price';
    div3.appendChild(priceLabel);

    let priceInput = document.createElement('input');
    priceInput.className = 'form-control';
    priceInput.placeholder = 'Price';
    priceInput.required = true;
    priceInput.type = 'text';
    priceInput.id = 'price';
    div3.appendChild(priceInput);

    let div4 = document.createElement('div');
    div4.className = 'mb-3';
    form.appendChild(div4);

    let descriptionLabel = document.createElement('label');
    descriptionLabel.className = 'form-label';
    descriptionLabel.textContent = 'Product Description';
    div4.appendChild(descriptionLabel);

    let descriptionInput = document.createElement('textarea');
    descriptionInput.className = 'form-control';
    descriptionInput.placeholder = 'Product Description';
    descriptionInput.required = true;
    descriptionInput.id = 'exampleFormControlTextarea1';
    descriptionInput.rows = 3;
    div4.appendChild(descriptionInput);

    let div5 = document.createElement('div');
    div5.className = 'mb-3';
    form.appendChild(div5);

    let idLabel = document.createElement('label');
    idLabel.className = 'form-label';
    idLabel.textContent = 'itemID: Needs to be Unique';
    div5.appendChild(idLabel);

    let idInput = document.createElement('input');
    idInput.className = 'form-control';
    idInput.placeholder = 'itemID: Needs to be Unique';
    idInput.required = true;
    idInput.type = 'text';
    idInput.id = 'itemID';
    div5.appendChild(idInput);
    
    let div6 = document.createElement('div');
    div6.className = 'mb-3';
    form.appendChild(div6);

    let pictureLabel = document.createElement('label');
    pictureLabel.className = 'form-label';
    pictureLabel.textContent = 'Picture';
    div6.appendChild(pictureLabel);

    let pictureInput = document.createElement('input');
    pictureInput.className = 'form-control';
    pictureInput.placeholder = 'Picture';
    pictureInput.required = true;
    pictureInput.type = 'file';
    pictureInput.name = 'pictureFIle';
    pictureInput.id = 'pictureFile';
    div6.appendChild(pictureInput);

    let button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.textContent = 'Add Shop Card'
    button.type = 'submit'
    button.style.margin = '.5em';
    button.onclick = () => addShopCard(shopCardsJson);
    form.appendChild(button);

    container.appendChild(form);
}

/**
 * takes the inputs from the shop card form and adds a new shop card to the shopCardsJson
 * 
 * @param {*} shopCardsJson 
 */
function addShopCard(shopCardsJson) {

    let password = document.getElementById('password').value;
    let title = document.getElementById('title').value;
    let price = document.getElementById('price').value;
    let description = document.getElementById('exampleFormControlTextarea1').value;
    let itemID = document.getElementById('itemID').value;
    let pictureFile = document.getElementById('pictureFile').value;

    if (password !== 'Kronos') {
        alert('Incorrect Password');
        return;
    }

    let newCard = {
        "cardId": itemID,
        "title": title,
        "price": price,
        "description": description,
        "picture": pictureFile,
        "stock": 1
    }

    shopCardsJson.push(newCard);

    fetch('/shopCards.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopCardsJson),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            rebuildShopDeleteForm(shopCardsJson);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}