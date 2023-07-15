
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
  // .then(promis=>console.log(promis))
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

    pokemon.Hp = pokeDetail.stats[0].base_stat;
    pokemon.statAttack =pokeDetail.stats[1].base_stat;
    pokemon.statDefense =pokeDetail.stats[2].base_stat;
    pokemon.statSpeed =pokeDetail.stats[5].base_stat;
    

    pokemon.height =pokeDetail.height;
    pokemon.weight =pokeDetail.weight;

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
      let textoDelPokemon=specificChildElement.textContent.match(/[a-zA-Z-]/g);
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
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <div class="pokeInfoGeneral">
      <img src="${pokemon.photo}" onerror="this.src='${pokemon.photo2}'" class="card-img-top" alt="${pokemon.name}">
      <p class="card-text">${pokemon.name.toUpperCase()}</p>
      <ol class="types">
      ${pokemon.types.map((type) => `<li class="type ${type}">${type.toUpperCase()}</li>`).join('')}
  </ol>
      </div>
      <div class="pokeInfoSpecific">
      <h3>Information Fisic</h3>
      <div class="pokeInfo">
      <div class="box-fisic">
      <div class="box-items-fisic">
      <p class='title-items-fisic'>HEIGHT</p>
      <p>${pokemon.height}</p>
      </div>
      <div class="box-items-fisic">
      <p class='title-items-fisic'>WEIGHT</p>
      <p>${pokemon.weight}</p>
      </div>
      </div>
      <h3>Stats</h3>
      <div class="box-stats">
      <div class="box-bar">
      <p>HP</p>
      <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${pokemon.Hp}%;" aria-valuenow="${pokemon.Hp}" aria-valuemin="0" aria-valuemax="250">${pokemon.Hp}%</div>
      </div>  
      </div>
      <div class="box-bar">
      <p>ATTACK</p>
      <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${pokemon.statAttack}%;" aria-valuenow="${pokemon.statAttack}" aria-valuemin="0" aria-valuemax="250">${pokemon.statAttack}%</div>
      </div>  
      </div>
      <div class="box-bar">
      <p>DEFENSE</p>
      <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${pokemon.statDefense}%;" aria-valuenow="${pokemon.statDefense}" aria-valuemin="0" aria-valuemax="250">${pokemon.statDefense}%</div>
      </div>  
      </div>
      <div class="box-bar">
      <p>SPEED</p>
      <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: ${pokemon.statSpeed}%;" aria-valuenow="${pokemon.statSpeed}" aria-valuemin="0" aria-valuemax="250">${pokemon.statSpeed}%</div>
      </div>  
      </div>
      </div>
                </div>
                </div>
      </div>
    </div>
  </div>
</div>`
}
