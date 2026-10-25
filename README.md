# Kharcha: Personal Expense Tracker

> Every rupee, accounted for.

Kharcha is a simple, fast personal expense ledger built with plain HTML, CSS and vanilla JavaScript. There is no framework, no build step and no backend. Open it in a browser and start tracking where your money goes.

**Live demo:** https://ammarwebstudio.github.io/kharcha-expense-tracker/

## Features

- **Add expenses** with a name, an amount (in Rs) and a category
- **Edit and delete** any expense
- **Search by name** and **filter by category**
- **Spending by category** with totals, percentages and progress bars
- **Summary cards** showing the total spent and the number of transactions, with an animated total
- **History of deleted expenses**, so nothing disappears by accident
- **Clear all** with a confirmation step (everything moves to History)
- **Dark and light theme**, which follows your system setting and remembers your choice
- **Saved in your browser** with `localStorage`, so your data is still there after a refresh
- **Input validation:** the name is required, the amount must be between 1 and 99,999,999, and a category must be chosen
- **Responsive layout** that works on desktop, tablet and phone
- **Accessible by design:** keyboard friendly, visible focus states, screen-reader announcements, `Esc` closes dialogs, and animations are reduced for people who prefer less motion

## Categories

Food, Transport, Shopping, Bills, Health, Entertainment, Education and Other.

## Built with

- HTML5
- CSS3 (custom properties, grid, flexbox, `color-mix()`, `:has()`)
- Vanilla JavaScript (ES6+)
- Browser `localStorage` for data
- [IBM Plex](https://fonts.google.com/specimen/IBM+Plex+Sans) fonts from Google Fonts

## Getting started

No installation is needed.

```bash
git clone https://github.com/Ammarwebstudio/kharcha-expense-tracker.git
cd kharcha-expense-tracker
```

Then open `index.html` in your browser, or right-click it in VS Code and choose **Open with Live Server**.

## Project structure

```
kharcha-expense-tracker/
├── index.html   # Page structure and dialogs
├── style.css    # Design tokens, layout, themes and animations
└── script.js    # App logic: add, edit, delete, filter, history, storage
```

## How your data is stored

Everything stays in your own browser. Nothing is sent to a server.

| Key               | What it holds                     |
| ----------------- | --------------------------------- |
| `myExpenses`      | Your current expenses             |
| `deletedexpenses` | Your deleted-expense history      |
| `kharchaTheme`    | Your chosen theme (dark or light) |

Because the data lives in the browser, clearing your site data removes it, and it is not shared between different browsers or devices.

## Browser support

Works in recent versions of Chrome and Edge (111+), Safari (16.2+) and Firefox (121+).

## Ideas for the future

- Export expenses to CSV
- Date field and a month-by-month view
- Monthly budget limits
- Charts
- Restore an expense from History

## Author

Built by [Muhammad Ammar](https://github.com/Ammarwebstudio).
