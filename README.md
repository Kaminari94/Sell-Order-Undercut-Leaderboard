# Kaminari's Magical Sell Offer Leaderboard

A lightweight web application for Guild Wars 2 traders that analyzes sell orders and identifies undercut competition in the trading post.

[![GW2 Trading](https://img.shields.io/badge/Guild%20Wars%202-Trading%20Post-blue)](https://img.shields.io/badge/Guild%20Wars%202-Trading%20Post-blue)
![jQuery](https://img.shields.io/badge/jQuery-3.7.1-green)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.7-purple)

## Features

- **API Integration**: Fetches real-time data from the official Guild Wars 2 API.
- **Undercut Analysis**: Identifies sell orders priced lower than your listings. 
- **Visual Display**: Color-coded item names based on rarity (Junk to Legendary)
- **Currency Formatting**: Displays prices in proper gold/silver/copper format.
- **Responsive Design**: Works on desktop and mobile devices.
- **Dark/Light Theme**: Toggle between themes for comfortable viewing.

## How It Works

The application:
1. Connects to the GW2 API using your API key
2. Fetches your current sell orders
3. Retrieves market data for all your listed items
4. Calculates undercut quantities (items priced below yours)
5. Displays everything in a sortable, searchable table

## Installation

No installation required! Simply:
1. Download all files to a folder
2. Open `rotsono.html` in your web browser
3. Enter your GW2 API key and click "Fetch Data"

