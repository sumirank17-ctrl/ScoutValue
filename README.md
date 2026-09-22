# ScoutValue

ScoutValue is a frontend-only football transfer-value simulator designed to explore how player characteristics and market conditions can influence an indicative transfer valuation.

The application runs entirely in the browser. No server, database, API key, or backend deployment is required.

## Features

- 150-player football database
- Transfermarkt-derived player market-value records
- External player profile images
- Player selection and profile preview
- Contract runway adjustment
- Minutes played input
- Goals + assists input
- Current form adjustment
- League demand adjustment
- Market momentum adjustment
- Projected transfer value
- Indicative valuation range
- Percentage change against the recorded market value
- Model confidence indicator
- Valuation-factor breakdown
- Comparable-player shortlist
- Responsive dashboard interface
- Methodology and developer information page

## How it works

ScoutValue starts with the selected player's recorded market value and applies a series of transparent valuation factors.

The current browser model follows a multiplicative structure:

```text
Projected Value =
Base Market Value
× Age Factor
× Form Factor
× Availability Factor
× Production Factor
× Market Factor
× Contract Factor