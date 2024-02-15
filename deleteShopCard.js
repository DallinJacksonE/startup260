//Dallin Jackson 2/14/24
//kayliescreations.biz

{/* <select class="form-select" aria-label="Default select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select> 
<button type="button" class="btn btn-danger">Danger</button>


<div class="d-grid gap-2 col-6 mx-auto">
  <button class="btn btn-primary" type="button">Button</button>
  <button class="btn btn-primary" type="button">Button</button>
</div>
*/}


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

        // Get the container where delete selector will be
        let container = document.getElementById('deleteSelector');
        container.className = "d-grid gap-2 col-6 mx-auto";
        let selector = document.createElement('select');
        selector.className = 'form-select';
        selector.ariaLabel = 'Default select';

        let baseOption = document.createElement('option');
        baseOption.textContent = 'Choose card to delete';

        selector.appendChild(baseOption)

        data.forEach(cardData => {
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

        container.appendChild(button);

    })
    .catch(error => {
        console.error('Error:', error);
    });
