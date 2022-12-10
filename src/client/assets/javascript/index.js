// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
}

const Rocket_league_racer ={
	"Racer 1": "Aftershock",
    "Racer 2": "Vulcan",
    "Racer 3": "Batmobile 2016",
    "Racer 4": "Octane",
    "Racer 5": "Dominus",
}

const Rocket_league_map = {
    "Track 1": "Wasteland",
    "Track 2": "AquaDome",
    "Track 3": "Neo Tokyo",
    "Track 4": "Champions Field",
    "Track 5": "Mannfield",
    "Track 6": "DFH Stadium",
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function(event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
		}

		// Podracer form field
		if (target.matches('.card.podracer')) {
			handleSelectPodRacer(target)
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate()
		}

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
	// render starting UI
	

	// TODO - Get player_id and track_id from the store
	const race_player_id = store.player_id
	const race_track_id = store.track_id

	// const race = TODO - invoke the API call to create the race, then save the result
	try{
	const race_id = await createRace(race_player_id, race_track_id)

	renderAt('#race', renderRaceStartView(race_id.Track))

	store.race_id = parseInt(race_id.ID) - 1;
	// For the API to work properly, the race id should be race id - 1
	// The race has been created, now start the countdown
	// TODO - call the async function runCountdown
	await runCountdown()
	// TODO - call the async function startRace
	await startRace(store.race_id)
	// TODO - call the async function runRace
	const race_run = await runRace(store.race_id)
	console.log('Race run:', race_run)
	
	
	}
	catch(err){
		console.log(err)
	}
	
	// TODO - update the store with the race id
	

}

async function runRace(raceID) {
	return new Promise(resolve => {
	// TODO - use Javascript's built in setInterval method to get race info every 500ms
	return new Promise(resolve => {
		const race_interval = setInterval(async () =>{
			try{
			const info = await getRace(raceID)
			console.log(info)
			if(info.status === "in-progress"){
				renderAt("#leaderBoard", raceProgress(info.positions));
			}
			else if(info.status === 'finished'){
				clearInterval(race_interval);
				renderAt("#race", resultsView(info.positions));
				resolve(info);
			}
		}
		catch(err){
			console.log(err)
		}
		}, 500)
	}).catch(err => console.log(err))
	/* 
		TODO - if the race info status property is "in-progress", update the leaderboard by calling:
		renderAt('#leaderBoard', raceProgress(res.positions))
	*/
	/* 
		TODO - if the race info status property is "finished", run the following:

		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(res.positions)) // to render the results view
		reslove(res) // resolve the promise
	*/
	})
	// remember to add error handling for the Promise
}

async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3

		return new Promise(resolve => {
			// TODO - use Javascript's built in setInterval method to count down once per second

			const count_down_interval = setInterval(() => {
				if(timer !== 0){
					console.log(timer);
					document.getElementById('big-numbers').innerHTML = --timer
				}
				else{
					clearInterval(count_down_interval);
					resolve()
					return;
				}
			}, 1000)
			// run this DOM manipulation to decrement the countdown for the user
			

			// TODO - if the countdown is done, clear the interval, resolve the promise, and return

		})
	} catch(error) {
		console.log(error);
	}
}

function handleSelectPodRacer(target) {
	console.log("selected a pod", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected racer to the store
	store.player_id = target.id;
}

function handleSelectTrack(target) {
	console.log("selected a track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected track id to the store
	store.track_id = target.id
	
}

function handleAccelerate() {
	console.log("accelerate button clicked")
	// TODO - Invoke the API call to accelerate
	accelerate(store.race_id)
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${Rocket_league_racer[driver_name]}</h3>
			<p>Top speed: ${top_speed}</p>
			<p>Acceleration: ${acceleration}</p>
			<p>Handling: ${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<h3>${Rocket_league_map[name]}</h3>
		</li>
	`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track, racers) {
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {
	let userPlayer = positions.find(e => e.id == store.player_id)
	userPlayer.driver_name += " (you)"
	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:3001'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints 

async function getTracks() {
	// GET request to `${SERVER}/api/tracks`
	try{
		let tracks = await fetch(`${SERVER}/api/tracks`); 
		tracks = tracks.json();
		return tracks;
	}
	catch(err){
		console.log("problem getting the tracks")
	}
}

async function getRacers() {
	// GET request to `${SERVER}/api/cars`
	try{
	let cars = await fetch(`${SERVER}/api/cars`)
	cars = cars.json();
	return cars
}
catch(err){
	console.log(err);
}
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }
	
	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with createRace request::", err))
}

async function getRace(id) {
	// GET request to `${SERVER}/api/races/${id}`
	const raceId = parseInt(id)
	try{
		const info = await fetch(`${SERVER}/api/races/${raceId}`, {
			method: "GET",
			dataType: "jsonp",
			...defaultFetchOpts(),
		})
		return info.json();
	}
	catch{
		(err => console.log("Probelm getting the race", err))
	}
	}

async function startRace(id) {
	const raceId = parseInt(id)
	try{
		const info = await fetch(`${SERVER}/api/races/${raceId}/start`, {
			method: 'POST',
			dataType: 'jsonp',
			...defaultFetchOpts(),	
		})
		return info
	}

	catch{
		(err => console.log("Problem with getRace request::", err))
		}
}

async function accelerate(id) {
	// POST request to `${SERVER}/api/races/${id}/accelerate`
	// options parameter provided as defaultFetchOpts
	// no body or datatype needed for this request
	const raceId = parseInt(id)

	try{
		await fetch(`${SERVER}/api/races/${raceId}/accelerate`, {
			method: 'POST',
			...defaultFetchOpts()
		})
	}
	catch(err){
		console.log(err)
	}
}
