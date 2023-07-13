
let offset=0;
const limit=12;
const limitPokemons=1010;

const contentCard=document.querySelectorAll('#content-card')
const loadMoreButton = document.querySelector('#loadMoreButton')
const search= document.querySelector('#search')
const contentBottom= document.querySelector('.pagination');
const contentElements= document.querySelector('#contentElements');


const pokeFuncions={};

// Evento para buscar pokemons en la NavBar.


search.addEventListener('submit',(a) =>{

  a.preventDefault()

 const name=document.querySelector('#input-search').value.toLowerCase();
console.log(name)

const cards=document.querySelectorAll('#cards')

for (let i = 0; i < cards.length; i++) {
    cards[i].remove();
}

contentCard.innerHTML = '';

console.log(cards)
contentBottom.innerHTML = '';



loadPokemon(name)


})


// pokeFuncions.getPokemons(offset, limit).then((pokemons = []) => {
//   const newHtml = pokemons.map(createCard).join('')
//   contentCard.innerHTML += newHtml

pokeFuncions.getPokemon=(name) => {

  const url=`https://pokeapi.co/api/v2/pokemon/${name}`;

  return fetch(url)
  .then(response => response.json())
  .then(data => data)
  .then(ObteneryAsignarValores)
  .catch(err => console.error('No se encontro el elemento', name, err))
}





pokeFuncions.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
      .then((response) => response.json())
      .then(ObteneryAsignarValores)
}

function ObteneryAsignarValores(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail['sprites']['other']['dream_world']['front_default'];
    pokemon.photo2 = pokeDetail['sprites']['front_default']

    return pokemon
}



pokeFuncions.getPokemons=(offset, limit) => {

  const url=`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}}`;

  return fetch(url)
  .then(response => response.json())
  .then(data=> data.results)
  .then(pokemons => pokemons.map(pokeFuncions.getPokemonDetail))
  .then((detailRequests) => Promise.all(detailRequests))
  .then((pokemonsDetails) => pokemonsDetails)
  .catch(error => {
    console.error('Error:', error);
    location.reload()
  });
}

//Insertar cartas en el DOM



async function loadPokemonItens(offset, limit) {

  try{

    let pokemons=[]
    pokemons=await pokeFuncions.getPokemons(offset, limit)

    console.log(pokemons)

      const newHtml =pokemons.map(createCard)
      console.log(typeof(newHtml))
      console.log(newHtml.length)

      console.log('prueba 106')
      // console.log(contentCard.length)

      let prueba=0;

      for(let i=0;i<newHtml.length;i++){

        // contentCard[i].innerHTML=newHtml[prueba];



        if(prueba<=2){
            contentCard[prueba].innerHTML+=newHtml[i]
        }
        else{
          prueba=0

          contentCard[prueba].innerHTML+=newHtml[i]
        }
        prueba+=1;
        // prueba+=ss

        // console.log(newHtml[prueba])

        console.log(prueba)

      }

      

      const cards=document.querySelectorAll('#cards');

      console.log(cards)

    cards.forEach(pruebaidea2);
    console.log('Después del forEach');
  }

  catch (error){
    console.log('la cagaste mi rey', error)

  }

      
}

function pruebaidea2(card){

      card.addEventListener('click', () => {


      const specificChildElement = card.querySelector('.card-text');
      let textoDelPokemon=specificChildElement.textContent.match(/[a-zA-Z]/g);
      let resultado=textoDelPokemon.join('');
      let a=resultado.toLowerCase()

      console.log(a)

      pokeFuncions.getPokemon(a).then(pokemon => { 
        
        const newHtml = createModal(pokemon)
        let newElement = document.createElement('div');
        newElement.innerHTML = newHtml;
        contentElements.appendChild(newElement)
        
        let myModal = document.querySelector('#exampleModal');
        console.log(myModal)
       let modal = new bootstrap.Modal(myModal);
       modal.show();

       myModal.addEventListener('hidden.bs.modal', function () {
        myModal.remove();
      });
        ;})




    //   pokeFuncions.getPokemon(textoDelPokemon).then(pokemon => {
    //   const newHtml = createModal(pokemon)
    //   contentElements.innerHTML += newHtml
    //   console.log('si funciona')
    // }).catch((err)=>console.log('ERROR'))
      // loadPokemon(textoDelPokemon,createCard,contentCard);
      // loadPokemon(`${textoDelPokemon}`,createModal,contentElements)
      console.log(a);




      })

}

// function pruebaFuncion(callback,arg1,arg2,arg3){

//   console.log('haber')
//   callback(arg1,arg2,arg3)
//   console.log('se ejecuto el callback')

// }

// Insertar una sola carta o modal al DOM

function loadPokemon(name) {
    pokeFuncions.getPokemon(name).then(pokemon => {
      const newHtml = createCard(pokemon)
      contentCard[1].innerHTML += newHtml
      console.log('si funciona')
      const cards=document.querySelectorAll('#cards');
      console.log(cards)
    cards.forEach(pruebaidea2);
    })

}

// loadPokemonItens(offset, limit)
loadPokemonItens(offset, limit)


// loadPokemon(textoDelPokemon,createModal,contentElements)
  
// const myModal = document.querySelector('#exampleModal')
// console.log('funciona')
// console.log(myModal)



// async function miFuncion() {
//       await 



//     }


// miFuncion()


loadMoreButton.addEventListener('click', () => {
  offset += limit
  const qtdRecordsWithNexPage = offset + limit

  if (qtdRecordsWithNexPage >= limitPokemons) {
      const newLimit = limitPokemons - offset
      loadPokemonItens(offset, newLimit)

      loadMoreButton.parentElement.removeChild(loadMoreButton)
  } else {

      loadPokemonItens(offset, limit)

  }
})



function createCard(pokemon){
  return  `  <div id="cards" class="card" style="width: 18rem;">
  <img src="${pokemon.photo}" onerror="this.src='${pokemon.photo2}'" class="card-img-top" alt="${pokemon.name}">
  <div class="card-body">
    <p class="card-text">#${pokemon.number}${' '}${pokemon.name.toUpperCase()}</p>
    <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type.toUpperCase()}</li>`).join('')}
                </ol>
  </div>
</div>`
}


function createModal(pokemon){
  return ` <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">${pokemon.name}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <img src="${pokemon.photo}" onerror="this.src='${pokemon.photo2}'" class="card-img-top" alt="${pokemon.name}">
      <p class="card-text">${pokemon.name}</p>
    <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
      </div>
    </div>
  </div>
</div>`
}
