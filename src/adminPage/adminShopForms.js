//Dallin Jackson 2/14/24
//kayliescreations.biz


export async function setUpForms() {
let shopCardsJson;
fetch('/api/getShopCards')
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
}

export async function deleteShopCard() {

    let selector = document.querySelector('select');
    let selectedOption = selector.options[selector.selectedIndex];
    let cardId = {cardID : selectedOption.id};

    let response = await fetch('/api/deleteShopCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardId)
        });

    console.log('Deleted Shop Card: ', response.status);
    rebuildShopDeleteForm();
}


export async function rebuildShopDeleteForm() {

    let response = await fetch('/api/getShopCards');
    let data = await response.json();
    console.log('Got shop Cards to rebuild Delete Form: ', data);
    let shopCardsJson = data;

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
    button.onclick = () => deleteShopCard();
    container.appendChild(button);
}

export function buildShopCardForm() {
    let container = document.getElementById('newShopCardForm');
    container.innerHTML = '';

    let form = document.createElement('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        addShopCard();
    });

    let header = document.createElement('h4');
    header.textContent = 'Upload a New Item to Shop';
    form.appendChild(header);

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

    let div7 = document.createElement('div');
    div7.className = 'mb-3';
    form.appendChild(div7);

    let formcheckDiv = document.createElement('div');
    formcheckDiv.className = 'form-check form-switch';
    div7.appendChild(formcheckDiv);

    let formcheckInput = document.createElement('input');
    formcheckInput.className = 'form-check-input';
    formcheckInput.type = 'checkbox';
    formcheckInput.role = 'switch';
    formcheckInput.id = 'flexSwitchCheckDefault';
    formcheckDiv.appendChild(formcheckInput);

    let formcheckLabel = document.createElement('label');
    formcheckLabel.className = 'form-check-label';
    formcheckLabel.htmlFor = 'flexSwitchCheckDefault';
    formcheckLabel.textContent = 'Ready to Ship';
    formcheckDiv.appendChild(formcheckLabel);
    
    
    let div6 = document.createElement('div');
    div6.className = 'mb-3';
    form.appendChild(div6);

    let pictureLabel = document.createElement('label');
    pictureLabel.className = 'form-label';
    pictureLabel.textContent = 'Picture (No files greater than 600KB, pictures must be cropped in a 3:4 ratio) ';
    let compressionLink = document.createElement('a');
    compressionLink.href = 'https://imagecompressor.com/';
    compressionLink.textContent = 'Compress Image here (down to 45% of original size)';

    pictureLabel.appendChild(compressionLink);

    div6.appendChild(pictureLabel);


    let pictureInput = document.createElement('input');
    pictureInput.className = 'form-control';
    pictureInput.placeholder = 'Picture';
    pictureInput.required = true;
    pictureInput.type = 'file';
    pictureInput.name = 'picture';
    pictureInput.accept = '.png, .jpg, .jpeg';
    pictureInput.id = 'pictureFile';
    div6.appendChild(pictureInput);

    let button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.textContent = 'Add Shop Card'
    button.style.margin = '.5em';
    form.appendChild(button);

    container.appendChild(form);
}


async function addShopCard() {

    //TODO: make sure that the picture is uploaded to the server and the path is stored in the shop card

    let title = document.getElementById('title').value;
    let price = document.getElementById('price').value;
    let description = document.getElementById('exampleFormControlTextarea1').value;
    let itemID = document.getElementById('itemID').value;
    let readyToShip = document.getElementById('flexSwitchCheckDefault').checked;
    let pictureInput = document.getElementById('pictureFile');
    let pictureFile = pictureInput.files[0];
    let pictureFileName = pictureFile.name;
    

    let newCard = {
        "cardId": itemID,
        "title": title,
        "price": price,
        "description": description,
        "readyToShip": readyToShip,
        "picture": "pics/creations/" + pictureFileName
    }

    console.log('New Shop Card: ', newCard);

    //add shop card to database

    let response = await fetch('/api/createShopCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
        });
    
    
    console.log("New shop card data update call: ", response.status);


    //add picture to server
    let formData = new FormData();
    formData.append('picture', pictureFile);
    console.log('Form Data: ', formData);

    let pictureResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });

    if (!pictureResponse.ok) {
        console.error('Error during file upload:', await pictureResponse.text());
    } else {
        let pictureData = await pictureResponse.json();
        console.log('Picture upload response: ', pictureData);
    }

    //rebuild the form
    rebuildShopDeleteForm();
    buildShopCardForm();
}