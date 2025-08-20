const form = $('#formAPI');
const submitBtn = $('#formSubmit');
const messageAlert = $('#messageAlert');
const resultDiv = $('#result');
const progressDiv = $('#progressBarDiv');
const progressFlavorText = $('#progressFlavorText');
const progressBar = $('#progressBar')
const progressParent = progressBar.parent();
const progressParentWidth = progressParent.width();
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
		$('html', 'body').removeClass('theme-transition');
	}, 2000);
	
});

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
			columns: [
				{ data: 'icon', title: 'Icon', width: '10%', render: function(data) {
					return '<img class="border border-secondary" src="' + data + '" height="48" width="48">';
				}},
				{ data: 'name', title: 'Name', width: '60%'},
				{ data: 'total_quantity', title: 'Quantity', width: '10%' },
				{ data: 'price', title: 'Price', width: '10%', render: function(copperPrice) {
					const gold = Math.floor(copperPrice / 10000);
					let silver = Math.floor((copperPrice % 10000) / 100).toString().padStart(2, '0');
					let copper = (copperPrice % 100).toString().padStart(2, '0');
					
					if (gold === 0) {
						if (silver === "00") {
							return copper + '<img src="copper.png">';
						}
						return silver + '<img src="silver.png">' + copper + '<img src="copper.png">';
					}
					return gold + '<img src="gold.png">' + silver + '<img src="silver.png">' + copper + '<img src="copper.png">';
				}},
				{ data: 'undercuts', title: 'Undercuts', width: '10%' }
			]
		} );
		
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
	const map = new Map();
    
    transactions.forEach(transaction => {
        const key = `${transaction.item_id}-${transaction.price}`;
        let item = items.filter(d => d.id === transaction.item_id);
		let icon = item[0].icon;
		let rarity = item[0].rarity;
		let name = "";
		switch(rarity) {
			case "Junk":
				name = '<span class="h5" style="color: #AAAAAA"><b>' + item[0].name + '</b></span>';
				break;
			case "Basic":
				name = '<span class="h5"><b>' + item[0].name + '</b></span>';
				break;
			case "Fine":
				name = '<span class="h5" style="color: #62A4DA">' + item[0].name + '</span>';
				break;
			case "Masterwork":
				name = '<span class="h5" style="color: #1a9306">' + item[0].name + '</span>';
				break;
			case "Rare":
				name = '<span class="h5" style="color: #fcd00b">' + item[0].name + '</span>';
				break;
			case "Exotic":
				name = '<span class="h5" style="color: #ffa405">' + item[0].name + '</span>';
				break;
			case "Ascended":
				name = '<span class="h5" style="color: #fb3e8d">' + item[0].name + '</span>';
				break;
			case "Legendary":
				name = '<span class="h5" style="color: #4C139D">' + item[0].name + '</span>';
				break;
			default:
				name = '' + item[0].name + '';
				break;
		}
		let listing = listings.filter(d => d.id === transaction.item_id);
		//console.log(listings);
		
		
		if (listing.length > 0) {
			var undercut = 0;
			const sortedSells = listing[0].sells.sort((a, b) => a.unit_price - b.unit_price);
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
		}
		
        if (!map.has(key)) {
            map.set(key, {
				icon: icon,
                item_id: transaction.item_id,
				name: name,
				rarity: rarity,
                price: transaction.price,
                total_quantity: 0,
				undercuts: undercut,
                transactions: []
            });
        }
        
        const group = map.get(key);
        group.total_quantity += transaction.quantity;
        group.transactions.push(transaction);
    });
	//console.log(map);

	// console.log("Oggetti trovati: ", items);
	return Array.from(map.values());

}



