
let offset=0;
const limit=10;
const limitPokemons=1010;

const contentCard=document.querySelector('#content-card')
const loadMoreButton = document.querySelector('#loadMoreButton')
const search= document.querySelector('#search')
const contentBottom=document.querySelector('.pagination');
const contentElements=document.querySelector('#contentElements');

const pokeFuncions={};


search.addEventListener('submit',(a) =>{

a.preventDefault()

 const name=document.querySelector('#input-search').value;


 contentCard.innerHTML = '';
contentBottom.innerHTML = '';

loadPokemon(name,createCard)

})


async function watchResults(data){

  const newHTML=await data
  console.log(newHTML)
}


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


function loadPokemon(name,createCard) {

      pokeFuncions.getPokemon(name).then((pokemons) => {
        const newHtml = createCard(pokemons)
        contentCard.innerHTML += newHtml
  })
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
  });
}

//Insertar cartas en el DOM

function loadPokemonItens(offset, limit) {
  pokeFuncions.getPokemons(offset, limit).then((pokemons = []) => {
      const newHtml = pokemons.map(createCard).join('')
      contentCard.innerHTML += newHtml
  })
}

loadPokemonItens(offset, limit)


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
  return  `  <div class="card" style="width: 18rem;">
  <img src="${pokemon.photo}" onerror="this.src='${pokemon.photo2}'" class="card-img-top" alt="${pokemon.name}">
  <div class="card-body">
    <p class="card-text">${pokemon.name}</p>
    <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
  </div>
</div>`
}

function createModal(pokemon){
  return ` <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">${pokemon.id}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <img src="${pokemon.photo}" onerror="this.src='${pokemon.photo2}'" class="card-img-top" alt="${pokemon.name}">
      <p class="card-text">${pokemon.name}</p>
    <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary">Guardar cambios</button>
      </div>
    </div>
  </div>
</div>`
}