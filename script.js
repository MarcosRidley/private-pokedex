// import fetch from 'node-fetch';
let allCards = [];

async function fetchAllPokemon() {
	const allPokes = await (
		await fetch('https://pokeapi.co/api/v2/pokemon?limit=898&offset=0')
	).json();
	const resolvedPromises = await Promise.all(
		allPokes.results.map((item) => fetchPokemon(item.name))
	);
	resolvedPromises.forEach(async (item) => {
		const result = await item.json();
		createPokemonCard(result);
	});
}

function fetchPokemon(nomePokemon) {
	return fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`);
}

function editPokemonModal(pokemon) {
	document.getElementById('staticBackdropLabel').textContent = pokemon.name;
	const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = ""
  const imagesDiv = document.createElement('div');
  modalBody.appendChild(imagesDiv)
	const frontImage = document.createElement('img');
	const backImage = document.createElement('img');
	const ShinyFrontImage = document.createElement('img');
	const ShinyBackImage = document.createElement('img');
	frontImage.src = pokemon.sprites.front_default;
	backImage.src = pokemon.sprites.back_default;
	ShinyFrontImage.src = pokemon.sprites.front_shiny;
	ShinyBackImage.src = pokemon.sprites.back_shiny;
	[frontImage, backImage, ShinyFrontImage, ShinyBackImage].forEach((image) => imagesDiv.appendChild(image));
	if (pokemon.name !== 'arceus') {
		if (pokemon.types[1]) {
			createTyping(
				pokemon.types[0].type.name,
				pokemon.types[1].type.name,
				modalBody
			);
		} else {
			createTyping(pokemon.types[0].type.name, false, modalBody);
		}
	}
}

function createPokemonCard(pokemon) {
	const cardContainer = document.querySelector('#container-cards');
	const pokemonCard = document.createElement('button');
	pokemonCard.setAttribute('data-bs-toggle', 'modal');
	pokemonCard.setAttribute('data-bs-target', '#staticBackdrop');
	pokemonCard.classList.add('cards');
	const pokemonName = document.createElement('h4');
	pokemonName.textContent = pokemon.name;
	const pokemonPicture = document.createElement('img');
	pokemonPicture.src = pokemon.sprites.front_default;
	const pokemonId = document.createElement('small');
	pokemonId.textContent = `#${pokemon.id}`;
	pokemonCard.appendChild(pokemonName);
	pokemonCard.appendChild(pokemonPicture);
	pokemonCard.appendChild(pokemonId);
	if (pokemon.name !== 'arceus') {
		if (pokemon.types[1]) {
			createTyping(
				pokemon.types[0].type.name,
				pokemon.types[1].type.name,
				pokemonCard
			);
		} else {
			createTyping(pokemon.types[0].type.name, false, pokemonCard);
		}
	} else {
		createArceusTyping;
	}
  pokemonCard.addEventListener('click', () => {editPokemonModal(pokemon)})
	cardContainer.appendChild(pokemonCard);
}

function createTyping(type1, type2, whereToAppend) {
	const firstType = document.createElement('p');
	const typeContainer = document.createElement('div');
	typeContainer.classList.add('type-container');
	firstType.textContent = type1;
	firstType.classList.add(type1, 'type');
	typeContainer.appendChild(firstType);
	if (type2) {
		const secondType = document.createElement('p');
		secondType.textContent = type2;
		secondType.classList.add(type2, 'type');
		typeContainer.appendChild(secondType);
	}
	whereToAppend.appendChild(typeContainer);
}

function createArceusTyping(card) {
	const firstType = document.createElement('p');
	firstType.textContent = 'Any';
	firstType.classList.add('arceus', 'type');
	card.appendChild(firstType);
}

async function createAllPokeList() {
	try {
		fetchAllPokemon();
	} catch (error) {
		console.log('Ocorreu um erro: ', error.message);
	}
}

window.onload = createAllPokeList;

function filterPokemon(event) {
	if (allCards.length === 0) allCards = document.querySelectorAll('.cards');
	const input = event.target.value.toLowerCase();
	document.querySelectorAll('.cards').length === allCards.length
		? allCards.forEach((card) => card.parentElement.removeChild(card))
		: [...document.querySelectorAll('.cards')].forEach((card) =>
				card.parentElement.removeChild(card)
		  );
	const cardFilter = [...allCards].filter(
		(card) =>
			card.children[0].textContent.includes(input) ||
			card.children[2].textContent.includes(input)
	);
	cardFilter.forEach((card) =>
		document.querySelector('#container-cards').appendChild(card)
	);
	if (input.length === 0) {
		allCards.forEach((card) =>
			document.querySelector('#container-cards').appendChild(card)
		);
	}
}

document
	.querySelector('#container-pesquisa input')
	.addEventListener('keyup', filterPokemon);
