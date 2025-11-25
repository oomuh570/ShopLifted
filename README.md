# ShopLifted
*A Single-Page Fashion Storefront built with HTML, Tailwind CSS, and JavaScript.*

---

## Live Project Link

Click to view the final project: **[ShopLifted](https://oomuh570.github.io/ShopLifted/)**

---

## Project Overview
**ShopLifted** is a fully responsive **Single-Page Application (SPA)** that allows users to browse fashion products, view detailed information, and manage a persistent shopping cart — all without leaving a single HTML page.

Developed as part of **COMP 3612 (Assignment 2)**, this project demonstrates:
- Modular JavaScript development  
- Dynamic DOM manipulation  
- JSON data integration  
- SPA-style view switching  
- Persistent client-side storage  
- Clean UI design using TailwindCSS  

---

## Application Features

### Home View
- Clean landing page introducing the brand
- Direct links to Men’s and Women’s sections

### Men / Women Views
- Gender-specific introductory pages
- Clicking a tile auto-applies filters in Browse View

### Browse View
- Dynamic grid of product results
- Filters by gender, category, color, and size
- Sorting options (A–Z, Z–A, price, category)
- “Add to Bag” button on each product card
- Real-time filter chips

### Single Product View
- Displays main product details:
  - Image / placeholder color
  - Name, price, and description
  - Sizes and colors
- Related products (by name similarity)
- Breadcrumb navigation
- Add-to-cart functionality

### Shopping Cart View
- Displays current bag contents  
- Item removal  
- Shipping type + destination selection  
- Tax, subtotal, and total calculation  
- Checkout:
  - Shows toast message
  - Clears cart
  - Returns user to Home View  
- Persisted using **localStorage**

### About Dialog
- Modal with project summary
- Team members (with GitHub links)
- Repository link
- Image credits  

---

## Technologies Used

| Technology       | Purpose |
|------------------|---------|
| **HTML5**        | SPA structure & view containers |
| **Tailwind CSS** | Utility-based, responsive UI styling |
| **JavaScript (ES6)** | View switching, filtering logic, rendering |
| **JSON**         | Product data source |
| **localStorage** | Persistent shopping cart |
| **GitHub Pages** | Hosting & deployment |

---

## Data Handling

Product data is fetched via:

```js
fetch("products.json")
  .then(response => response.json())
  .then(data => {
    // dynamic rendering logic
  });
```
---

## Partners

This project was completed collaboratively by:

### Ochihai Omuha  
GitHub: https://github.com/oomuh570  

### Tarun Jaswal  
GitHub: https://github.com/tjasw549

---
