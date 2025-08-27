const form = $('#formAPI');
const submitBtn = $('#formSubmit');
const inputAPI = $('#valueAPI')
const messageAlert = $('#messageAlert');
const resultDiv = $('#result');
const progressDiv = $('#progressBarDiv');
const progressFlavorText = $('#progressFlavorText');
const progressBar = $('#progressBar')
const progressParent = progressBar.parent();
const progressParentWidth = progressParent.width();
const storageName = "gw2_kami_trading_app";
const dataTable = $('#myTable');

$(document).ready(function() {
	if (window.innerWidth < 800) {
		inputAPI.css('width', '70%');
	}
})

window.addEventListener('resize', function(event) {
	if (window.innerWidth >= 800) {
		inputAPI.css('width', '100%');
	} else if (window.innerWidth < 800) {
		inputAPI.css('width', '70%');
	}
}) //Why? Because! Well, the above document.ready function does it for responsive design. If i resize browser to extremely small sizes then i will have an inputAPI textbox too big!

$("#themeToggle").on("click", function(event) {
	var tema = $('html').attr('data-bs-theme');
	
	$('html, body').addClass('theme-transition');
	if (tema === "dark") {
		$('html').attr('data-bs-theme', 'light');
		$("#themeToggle").html('<i class="bi bi-moon-fill"></i>');
	} else if (tema === "light") {
		$('html').attr('data-bs-theme', 'dark');
		$("#themeToggle").html('<i class="bi bi-brightness-high-fill"></i>');
	}
	
	setTimeout(function() {
		$('html, body').removeClass('theme-transition');
	}, 2000);
	
});

function formatTimeDifference(isoString) {
    const createdDate = new Date(isoString);
    const now = new Date();
    return now - createdDate; 
}

function saveToStorage(apiKey, tableData) {
    const storageData = {
        apiKey: apiKey,
        table: tableData,
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem(storageName, JSON.stringify(storageData));
        console.log("Data saved to localStorage");
		messageAlert.addClass('alert-success');
		messageAlert.removeClass('visually-hidden');
		messageAlert.html(`<div class="d-flex"><div class="flex-fill">Data saved to local storage.</div><div class="flex-fill text-end"><img src="poggies.png" height="48" width="48"></div></div>`);
		messageAlert.addClass("theme-transition");
		setTimeout(function() {
			messageAlert.addClass('visually-hidden');
			messageAlert.removeClass('theme-transition', 'alert-secondary');
		}, 6000);
	} catch (e) {
		messageAlert.addClass('alert-danger');
		messageAlert.removeClass('visually-hidden');
		messageAlert.html(`<div class="d-flex"><div class="flex-fill">Error while saving data: ${e}</div><div class="flex-fill text-end"><img src="sadge.png" height="48" width="48"></div></div>`);
		messageAlert.addClass("theme-transition");
		setTimeout(function() {
			messageAlert.addClass('visually-hidden');
			messageAlert.removeClass('theme-transition', 'alert-secondary');
		}, 6000);
	}
}

function loadFromStorage() {
    try {
        const data = localStorage.getItem(storageName);
		if (data) {
			messageAlert.addClass('alert-success');
			messageAlert.removeClass('visually-hidden');
			messageAlert.html(`<div class="d-flex"><div class="flex-fill">Data loaded from local storage.</div><div class="flex-fill text-end"><img src="rotsosilk.png" height="48" width="48"></div></div>`);
			messageAlert.addClass("theme-transition");
			setTimeout(function() {
				messageAlert.addClass('visually-hidden');
				messageAlert.removeClass('theme-transition', 'alert-secondary');
			}, 6000);
			return data ? JSON.parse(data) : null;
		}
    } catch (e) {
		messageAlert.addClass('alert-danger');
		messageAlert.removeClass('visually-hidden');
		messageAlert.html(`<div class="d-flex"><div class="flex-fill">Error while loading data: ${e}</div><div class="flex-fill text-end"><img src="sadge.png" height="48" width="48"></div></div>`);
		messageAlert.addClass("theme-transition");
		setTimeout(function() {
			messageAlert.addClass('visually-hidden');
			messageAlert.removeClass('theme-transition', 'alert-secondary');
		}, 6000);
		return null;
	}
}

function deleteStorage() {
	try {
		localStorage.removeItem(storageName);
		console.log("Storage data deleted.");
		messageAlert.addClass('alert-success');
		messageAlert.removeClass('visually-hidden');
		messageAlert.html(`<div class="d-flex"><div class="flex-fill">Data deleted from local storage.</div><div class="flex-fill text-end"><img src="dreamge.png" height="48" width="48"></div></div>`);
		messageAlert.addClass("theme-transition");
		setTimeout(function() {
			messageAlert.addClass('visually-hidden');
			messageAlert.removeClass('theme-transition', 'alert-secondary');
		}, 6000);
    } catch (e) {
		messageAlert.addClass('alert-danger');
		messageAlert.removeClass('visually-hidden');
		messageAlert.html(`<div class="d-flex"><div class="flex-fill">Error while deleting data: ${e}</div><div class="flex-fill text-end"><img src="sadge.png" height="48" width="48"></div></div>`);
		messageAlert.addClass("theme-transition");
		setTimeout(function() {
			messageAlert.addClass('visually-hidden');
			messageAlert.removeClass('theme-transition', 'alert-secondary');
		}, 6000);
	}
}

$(document).ready(function() {
        const oldData = loadFromStorage();
		messageAlert.addClass('visually-hidden');
        if (oldData && oldData.apiKey) {
            $('#valueAPI').val(oldData.apiKey);
        }
    });

$('#loadData').on('click', async function() {
	data = loadFromStorage();
	console.log(data);
})

$('#saveData').on('click', async function() {
	var table = dataTable.DataTable().data().toArray();
	var apiKey = inputAPI.val();
	saveToStorage(apiKey, table);
	//console.log(table);
})

$('#deleteData').on('click', async function() {
	const data = localStorage.getItem(storageName);
	if (data) {
		deleteStorage();
		console.log("Data from local storage deleted.");
	}
	return null;
})

$('#formAPI').on('submit', async function (event) {
    event.preventDefault();
    var apiKey = $('#valueAPI').val();
    submitBtn.prop('disabled', true);
    submitBtn.html('<i class="bi bi-arrow-repeat"></i> Loading...');
    
    try {
        const result = await fetchMonkeys(apiKey);
		const table = await processBananas(result);
		//console.log(result);
		//console.log(table);
        if ($.fn.DataTable.isDataTable('#myTable')) {
			$('#myTable').addClass('visually-hidden');
            $('#myTable').DataTable().destroy();
            $('#myTable').empty();
        }

        $('#myTable').html(`
            <thead>
                <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Undercuts</th>
                </tr>
            </thead>
            <tbody></tbody>
        `);
		$('#myTable').removeClass('visually-hidden');
		$('#myTable').DataTable( {
			data: table,
			responsive: true,
			columns: [
				{ data: 'icon', title: '<span class="d-lg-none"><i class="bi bi-image"></i></span><span class="d-none d-lg-inline"><i class="bi bi-image"></i> Icon</span>', width: '7%', render: function(data) {
					return '<img class="d-lg-none border border-secondary" src="' + data + '" height="32" width="32">' + '<img class="d-none d-lg-inline border border-secondary" src="' + data + '" height="48" width="48">';
				}},
				{ data: 'name', title: '<span class="d-lg-none"><i class="bi bi-quote"></i><span class="fs-6">Name</span></span><span class="d-none d-lg-inline"><i class="bi bi-quote"></i> Name</span>', width: '30%' },
				{ data: 'total_quantity', title: '<span class="d-lg-none"><i class="bi bi-box-seam"></i></span><span class="d-none d-lg-inline"><i class="bi bi-box-seam"></i> Q.ty</span>', width: '10.5%' },
				{ data: 'up_since', title: '<span class="d-lg-none"><i class="bi bi-calendar-date"></i></span><span class="d-none d-lg-inline"><i class="bi bi-calendar-date"></i> Since</span>', type:'num', className: 'dt-right', width: '9.66%', render: function(isoString) {
					millisec = formatTimeDifference(isoString);
					const timeUnits = [
						{ unit: 'Year', ms: 31536000000, max: 100 },
						{ unit: 'Month', ms: 2628000000, max: 12 },
						{ unit: 'Week', ms: 604800000, max: 4 },
						{ unit: 'Day', ms: 86400000, max: 7 },
						{ unit: 'Hour', ms: 3600000, max: 24 },
						{ unit: 'Minute', ms: 60000, max: 60 },
						{ unit: 'Second', ms: 1000, max: 60 }
					];
					const parts = [];
					let remainingMs = millisec;
					if (millisec < 0) return 'in the future';
					
					for (const { unit, ms, max } of timeUnits) {
						const value = Math.floor(remainingMs / ms);
						if (value > 0) {
							parts.push(`${value}${unit[0]}`);
							remainingMs -= value * ms;
							
							// Optional: stop after 2-3 components for readability
							if (parts.length >= 1) break;
						}
					}
					
					return parts.join(' ') || 'just now';
				}},
				{ data: 'price', title: '<span class="d-lg-none"><i class="bi bi-cash-coin"></i></span><span class="d-none d-lg-inline"><i class="bi bi-cash-coin"></i> Price</span>', width: '20.66%', render: function(copperPrice) {
					const gold = Math.floor(copperPrice / 10000);
					let silver = Math.floor((copperPrice % 10000) / 100).toString().padStart(2, '0');
					let copper = (copperPrice % 100).toString().padStart(2, '0');
					
					if (gold === 0) {
						if (silver === "00") {
							return copper + '<img class="d-none d-lg-inline" src="copper.png"><img class="d-lg-none" src="copper.png" height="16" width="16">';
						}
						return silver + '<img class="d-none d-lg-inline" img src="silver.png"><img class="d-lg-none" src="silver.png" height="16" width="16">' + copper + '<img class="d-none d-lg-inline" src="copper.png"><img class="d-lg-none" src="copper.png" height="16" width="16">';
					}
					return gold + '<img class="d-none d-lg-inline" src="gold.png"><img class="d-lg-none" src="gold.png" height="16" width="16">' + silver + '<img class="d-none d-lg-inline" img src="silver.png"><img class="d-lg-none" src="silver.png" height="16" width="16">' + copper + '<img class="d-none d-lg-inline" src="copper.png"><img class="d-lg-none" src="copper.png" height="16" width="16">';
				}}, //d-lg-none e d-none d-lg-inline
				{ data: 'delta', title: 'Δ', width: '9%', render: function(delta) {
					let direction = delta.direction;
					delta = delta.delta;
					if (direction) {
						delta = `<span class="text-success">${delta}</span> <i class="bi bi-arrow-up-circle text-success"></i>`;
					} else if (direction === false) {
						delta = `<span class="text-danger">+${delta}</span> <i class="bi bi-arrow-down-circle text-danger"></i>`;
					} else if (direction === null) {
						delta = `<span class="text-secondary">0</span> <i class="bi bi-dash-circle text-secondary"></i>`;
					}
					return delta;
				} },
				{ data: 'undercuts', title: '<span class="d-lg-none"><i class="bi bi-layer-forward"></i></span><span class="d-none d-lg-inline"><i class="bi bi-layer-forward"></i> Undercuts</span>', width: '13.16%' }
			], //<i class="bi bi-layer-forward"></i>
			order: [6, 'asc'], //Undercuts, ascending, from zero to heroooooooo
			columnDefs: [
				{
					targets: -1,
					className: 'no-wrap'
				}
			],
			layout: {
				topStart: ['buttons', 'pageLength']
			}
		} );
		saveToStorage(apiKey, table);
		
	} catch (error) {
        console.error('Error:', error);
    } finally {
        submitBtn.prop('disabled', false);
        submitBtn.html('<i class="bi bi-arrow-return-right"></i> Fetch Data');
    }
})

async function fetchMonkeys(apiKey) {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 72) {
        messageAlert.addClass('alert-danger');
		messageAlert.removeClass('visually-hidden');
        messageAlert.html('<div class="d-flex"><div class="flex-fill"><b>API Error:</b> API key must be a non-empty string.</div><div class="flex-fill text-end"><img src="sadge.png" height="48" width="48"></div></div>');
		progressDiv.addClass('visually-hidden');
        throw new Error('API key must be a non-empty string.');
    }

    const endpoint = 'commerce/transactions/current/sells';
	let page = 0;
	
    try {
		progressBar.removeClass('bg-success');
		messageAlert.addClass('visually-hidden');
		progressBar.removeClass('bg-danger');
		progressFlavorText.removeClass('alert-success');
		progressFlavorText.addClass('alert-secondary');
		progressDiv.removeClass('visually-hidden');
		const response = await fetch(`https://api.guildwars2.com/v2/${endpoint}?page=${page}&page_size=200&access_token=${apiKey}`);
        const total_pages = response.headers.get("x-page-total");
		let single_perc = (100 / total_pages).toFixed(2);
		messageAlert.addClass('visually-hidden');
		let result = await response.json();
		//progressFlavorText.html(`<b>Page ${page+1} of ${parseInt(total_pages)+1}:</b> Fetching Data from cute Quaggans Delivery Service API, this may take some time.`);
		progressBar.css('width', (single_perc * (page+1))+'%');

		// Process pages with controlled concurrency and rate limiting
        const CONCURRENT_REQUESTS = Math.min(total_pages, 5);
        const DELAY_BETWEEN_BATCHES = 50; 
        
        for (let batchStart = 1; batchStart <= total_pages; batchStart += CONCURRENT_REQUESTS) {
            const batchEnd = Math.min(batchStart + CONCURRENT_REQUESTS, total_pages);
            const batchPromises = [];
            
            for (let i = batchStart; i < batchEnd; i++) {
                batchPromises.push(
                    fetch(`https://api.guildwars2.com/v2/${endpoint}?page=${i}&page_size=200&access_token=${apiKey}`)
                        .then(async response => {
                            if (response.status === 429) {
                                // Rate limited - wait and retry
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                return fetch(`https://api.guildwars2.com/v2/${endpoint}?page=${i}&page_size=200&access_token=${apiKey}`)
                                    .then(retryResponse => {
                                        if (!retryResponse.ok) {
                                            throw new Error(`<div class="d-flex"><div class="flex-fill"><b>HTTP error! status: ${retryResponse.status}</div><div class="flex-fill text-end"><img src="sadge.png" height="48" width="48"></div></div>`);
                                        }
										let percentage = single_perc * (page+1);
										progressBar.css('width', (single_perc * (page+1))+'%');
                                        return retryResponse.json();
                                    });
                            }
                            if (!response.ok) {
                                throw new Error(`<div class="d-flex"><div class="flex-fill"><b>HTTP error!</b> status: ${response.status}</div><div class="flex-fill text-end"><img src="sadge.png" height="48" width="48"></div></div>`);
                            }
                            return response.json();
                        })
                );
            }
            const batchResults = await Promise.all(batchPromises);
            result = result.concat(batchResults.flat());
            
            // Update progress
            const currentProgress = Math.min(batchEnd, total_pages + 1);
            const percentage = (single_perc * CONCURRENT_REQUESTS) * (currentProgress / CONCURRENT_REQUESTS);
            progressBar.css('width', percentage + '%');
            progressFlavorText.html(`<div class="d-flex"><div class="flex-fill"><b>Batch ${(currentProgress / CONCURRENT_REQUESTS).toFixed(0)} of ${(total_pages / CONCURRENT_REQUESTS).toFixed(0)}:</b> Fetching Data from cute Quaggans Delivery Service API, this may take some time.</div><div class="flex-fill text-end"><img src="waitge.gif" height="48" width="48"></div></div>`);
		}
		if (result.length === 0) {
			progressBar.addClass('bg-success');
			progressFlavorText.html(`<div class="d-flex"><div class="flex-fill"><b>${(result.length)} Listings</b> loaded successfully from Quaggans Delivery Service API.  Showing results...<br>Wait, what results? You have nothing for sale!</div><div class="flex-fill text-end"><img src="dogekek.png" height="48" width="48"></div></div>`)
			return await result;
		}
		progressFlavorText.removeClass('alert-secondary');
		progressBar.addClass('bg-success');
		progressFlavorText.addClass('alert-success');
		progressFlavorText.html(`<div class="d-flex"><div class="flex-fill"><b>${(result.length)} Listings</b> loaded successfully from Quaggans Delivery Service API.  Showing results...</div><div class="flex-fill text-end"><img src="dreamge.png" height="48" width="48"></div></div>`)
        return await result;
    } catch (error) {
        messageAlert.addClass('alert-danger');
        messageAlert.html('<b>API Error:</b> ' + error.message);
        throw error;
    }
}

async function processBananas(transactions) {
	var apiKey = $('#valueAPI').val();
	const id_art = [...new Set(transactions.map(t => t.item_id))];
	const endpoint = '/items';
	const endpoint_listings = '/commerce/listings';
	const chunkSize = 200;
	const chunks = [];
    for (let i = 0; i < id_art.length; i += chunkSize) {
        chunks.push(id_art.slice(i, i + chunkSize));
    }
	
	const items = [];
	const listings = [];
	
	for (const chunk of chunks) {
		try {
			const response = await fetch(`https://api.guildwars2.com/v2${endpoint}?ids=${chunk.join(',')}&lang=en`);
			const chunkItems = await response.json();
			items.push(...chunkItems);
			
			// Add a small delay between requests to be gentle on the API
			await new Promise(resolve => setTimeout(resolve, 100));
		} catch (error) {
			console.error('Error fetching items:', error);
		}
	}
	for (const chunk of chunks) {
		try {
			const response = await fetch(`https://api.guildwars2.com/v2${endpoint_listings}?ids=${chunk.join(',')}`);
			const chunkListings = await response.json();
			listings.push(...chunkListings);
			
			// Add a small delay between requests
			await new Promise(resolve => setTimeout(resolve, 100));
		} catch (error) {
			console.error('Error fetching listings:', error);
		}
	}
	
	const itemsMap = new Map();
    for (const item of items) {
        itemsMap.set(item.id, item);
    }

    const listingsMap = new Map();
    for (const listing of listings) {
        listingsMap.set(listing.id, listing);
    }
	const map = new Map();
    var old_data = loadFromStorage();
	
	const oldDataMap = new Map();
    if (old_data && (apiKey === old_data.apiKey)) {
        for (const oldItem of old_data.table) {
            const oldKey = `${oldItem.item_id}-${oldItem.price}`;
            oldDataMap.set(oldKey, oldItem);
        }
    }
    for (const transaction of transactions) {
        const key = `${transaction.item_id}-${transaction.price}`;
        let item = itemsMap.get(transaction.item_id);
		if (!item) {
            console.warn(`Item with id ${transaction.item_id} not found.`);
            continue;
        }
		let icon = item.icon;
		let rarity = item.rarity;
		let name = "";
		
		let old_item = oldDataMap.get(key);
        
        if (!old_item) {
            old_item = { 'undercuts': 0 };
        }
		
		let up_since = transaction.created;
		// COLORS BY ITEM RARITY
		switch(rarity) {
			case "Junk":
				name = '<span class="d-lg-none fs-6" style="color: #AAAAAA">' + item.name + '</span><span class="d-none d-lg-flex h4" style="color: #AAAAAA">' + item.name + '</span>';
				break;
			case "Basic":
				name = '<span class="d-lg-none fs-6">' + item.name + '</span><span class="d-none d-lg-flex h4">' + item.name + '</span>';
				break;
			case "Fine":
				name = '<span class="d-lg-none fs-6" style="color: #62A4DA">' + item.name + '</span><span class="d-none d-lg-flex h4" style="color: #62A4DA">' + item.name + '</span>';
				break;
			case "Masterwork":
				name = '<span class="d-lg-none fs-6" style="color: #1a9306">' + item.name + '</span><span class="d-none d-lg-flex h4" style="color: #1a9306">' + item.name + '</span>';
				break;
			case "Rare":
				name = '<span class="d-lg-none fs-6" style="color: #fcd00b">' + item.name + '</span><span class="d-none d-lg-flex h4" style="color: #fcd00b">' + item.name + '</span>';
				break;
			case "Exotic":
				name = '<span class="d-lg-none fs-6" style="color: #ffa405">' + item.name + '</span><span class="d-none d-lg-flex h4" style="color: #ffa405">' + item.name + '</span>';
				break;
			case "Ascended":
				name = '<span class="d-lg-none fs-6" style="color: #fb3e8d">' + item.name + '</span><span class="d-none d-lg-flex h4" style="color: #fb3e8d">' + item.name + '</span>';
				break;
			case "Legendary":
				name = '<span class="d-lg-none fs-6" style="color: #6D1BE0">' + item.name + '</span><span class="d-none d-lg-flex h4" style="color: #6D1BE0">' + item.name + '</span>';
				break;
			default:
				name = '' + item.name + '';
				break;
		}
		const listing = listingsMap.get(transaction.item_id);
		let delta = 0;
		let undercut = 0;
		if (listing) {
			if (old_data) {
				var old_undercut = old_item.undercuts;
			} else {
				var old_undercut = 0;
			}
			const sortedSells = listing.sells.sort((a, b) => a.unit_price - b.unit_price);
			//console.log("sortedSells:" + JSON.stringify(sortedSells));
			for (const sell of sortedSells) {
				if (sell.unit_price < transaction.price) {
					undercut += sell.quantity;
					// DEBUG console.log(item[0].name + " sell.unit_price: " + sell.unit_price + " sell.quantity: " + sell.quantity + " transaction price: " + transaction.price);
				} else {
					// DEBUG console.log("undercut " + item[0].name + ": " + undercut);
					break;
				}
			}
			var direction = true;
			if (old_undercut > undercut) {
				direction = true; //true = up | false = down | null = no change
				delta = undercut - old_undercut;
			} else if (old_undercut < undercut ) {
				direction = false; //true = up | false = down | null = no change
				delta = undercut - old_undercut;
			} else {
				direction = null; //true = up | false = down | null = no change
				delta = 0;
			}
		}
		
        if (!map.has(key)) {
            map.set(key, {
				icon: icon,
                item_id: transaction.item_id,
				name: name,
				rarity: rarity,
				up_since: up_since, //NUOVO
                price: transaction.price,
                total_quantity: 0,
				delta: {'direction':direction, 'delta':delta}, //NUOVO
				undercuts: undercut,
                //transactions: []
            });
        }
        
        const group = map.get(key);
        group.total_quantity += transaction.quantity;
        //group.transactions.push(transaction);
    };
	//console.log(map);

	// console.log("Oggetti trovati: ", items);
	return Array.from(map.values());

}





