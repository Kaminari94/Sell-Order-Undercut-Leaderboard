# Kaminari's Sell Offer Undercut Leaderboard

A lightweight web application for Guild Wars 2 traders which analyzes sell orders, identifying undercut competition in the trading post.

[Try it now!](https://kaminari94.github.io/Sell-Order-Undercut-Leaderboard/)

![GW2 Trading](https://img.shields.io/badge/Guild%20Wars%202-Trading%20Post-blue)
![jQuery](https://img.shields.io/badge/jQuery-3.7.1-green)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.7-purple)
![DataTables](https://img.shields.io/badge/DataTables-2.3.2-orange)

## Features

- **API Integration**: Fetches real-time data from the official Guild Wars 2 API.
- **Undercut Analysis**: Identifies sell orders priced lower than your listings. 
- **Visual Display**: Color-coded item names based on rarity (Junk to Legendary)
- **Currency Formatting**: Displays prices in proper gold/silver/copper format.
- **Responsive Design**: Works on desktop and mobile devices.
- **Dark/Light Theme**: Toggle between themes for comfortable viewing.

## How It Works

The application:
1. Connects to the GW2 API using your API key.
2. Fetches your current sell orders.
3. Retrieves market data for all your listed items.
4. Calculates undercut quantities (items priced below yours).
5. Displays everything in a sortable, searchable DataTable.

## Installation

No installation required! Simply:
1. Download all files to a folder
2. Open `index.html` in your web browser
3. Enter your GW2 API key and click "Fetch Data"

## API Key Requirements

Your GW2 API key must have the following permissions:
- **account** (required for authentication)
- **tradingpost** (required to access commerce endpoints)

Generate your API key at: [https://account.arena.net/applications](https://account.arena.net/applications)

## Usage

1. **Enter API Key**: Paste your GW2 API key in the input field.
2. **Fetch Data**: Click "Fetch Data" to retrieve your sell orders.
3. **Analyze Results**: 
   - View all your active sell orders.
   - See how many items are undercutting each listing.
   - Sort by any column to prioritize actions.

## Technical Details

### Built With
- **jQuery 3.7.1** - DOM manipulation and AJAX requests
- **Bootstrap 5.3.7** - Responsive UI components
- **DataTables 2.3.2** - Advanced table functionality

### API Endpoints Used
- `commerce/transactions/current/sells` - Your current sell orders.
- `items` - Item information and metadata.
- `commerce/listings` - Current market listings.

## Privacy & Security

- Your API key is used only for API requests to ArenaNet's servers.
- No data is stored or transmitted to third parties.
- All processing happens locally in your browser.

## Support

If you encounter issues:
1. Ensure your API key has the required permissions.
2. Check that you're not rate-limited by the GW2 API.
3. Verify all image files are in the same directory.

## License

This project is provided as-is for the Guild Wars 2 community.

## Disclaimer

This tool is not affiliated with or endorsed by ArenaNet or Guild Wars 2.
