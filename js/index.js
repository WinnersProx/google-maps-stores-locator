
let map;
let markers = [];
let infoWindow;
const searchIcon = document.querySelector('.search-input .search-icon');
const searchInput = document.querySelector('.search-input input');

function initMap() {
	const coords = new google.maps.LatLng(-33.91722, 151.23064);
	
	infoWindow = new google.maps.InfoWindow();

	map = new google.maps.Map(
		document.querySelector('#map'), { 
			zoom: 11, 
			center: coords,
			mapTypeId: "roadmap",
			markers
		}
	);
	fetchStores(stores);
}

function showStoresMarkers() {
	const bounds = new google.maps.LatLngBounds();
	for([index, store] of stores.entries()){
		const latLng = new google.maps.LatLng(
			store["coordinates"]["latitude"],
			store["coordinates"]["longitude"]
		);
		bounds.extend(latLng);
		createMarker(latLng, store.name, store.addressLines[0], store.phoneNumber, store.openStatusText, index+1);
	}
	map.fitBounds(bounds);
}

function createMarker(position, name, address, phoneNumber, status, index) {
	let html = `
		<div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${status}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                ${address}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
	`;
	const mIndex = Math.round(Math.random([0,1]));
	const icon = mIndex % 2 === 0 ? 'm1.png' : 'm2.png';
	const marker = new google.maps.Marker({ 
		position, 
		map,
		label: { text: String(index), color: 'white' },
		icon: `./icons/${icon}`
	});

	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.setContent(html);
		infoWindow.open(map, marker);
	});

	markers.push(marker);
}

function fetchStores($stores) {
	let html = ``;

	for([index, store] of $stores.entries()) {
		html += `
			<div class="store">
				<div class="store-info">
					<div class="store-name">${store.name}</div>
					<div class="store-count">${index + 1}</div>
				</div>
				<div class="address">
					${store.addressLines[0]}
				</div>
			</div>
		`;
	}

	document.querySelector('.stores-list').innerHTML = html;
	showStoresMarkers($stores);
	setStoreClickListener();

}

function searchStores() {
	const searchValue = searchInput.value;
	if(searchValue.trim() && searchValue.length >= 5) {
		const foundStores = stores.filter(store => searchValue === store.address.postalCode.substr(0, 5));
		clearLocations();
		fetchStores(foundStores);
	}
	else {
		alert("The zip code should have at list five digits");
		fetchStores(stores);
	}
}

function setStoreClickListener(){	
    const elements = document.querySelectorAll('.store');

    elements.forEach((el, index) => {
        el.addEventListener('click', () => {
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}

function clearLocations(){
    infoWindow.close();
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}


/**
 * Events
 */

searchIcon.addEventListener('click',e => {
	e.preventDefault();
	searchStores();
});

searchInput.addEventListener('keyup', e => {
	if(e.keyCode === 13) searchStores();
});