
let offset=0;
const limit=10;
const limitPokemons=1260;


const contentCard=document.querySelector('#content-card')
const loadMoreButton = document.querySelector('#loadMoreButton')

const pokeFuncions={};



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

    pokemon.photo = pokeDetail['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];

    return pokemon
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
  <img src="${pokemon.photo}" class="card-img-top" alt="${pokemon.name}">
  <div class="card-body">
    <p class="card-text">${pokemon.name}</p>
    <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
  </div>
</div>`
}