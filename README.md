# 🧵 Tailwind Threads  
*A Single-Page Fashion Storefront built with HTML, Tailwind CSS, and Vanilla JavaScript.*

---

## 📖 Project Overview
**Tailwind Threads** is a fully responsive **Single-Page Application (SPA)** that enables users to browse fashion products, view product details, and manage a persistent shopping cart — all within one HTML page.  
This project was developed as part of **COMP 3612 (Assignment 2)** to demonstrate front-end programming, design, and documentation skills.

The app emphasizes:
- Dynamic **view switching** without page reloads  
- **Asynchronous JSON data fetching**  
- **Persistent localStorage** for shopping-cart data  
- Modular, well-documented **JavaScript**

---

## 🧩 Application Features
### 🏠 Home View  
- Displays a landing section introducing the brand and quick links to Men’s / Women’s collections.

### 👕 Men / Women Views  
- Category pages that showcase gender-specific product types.  
- Clicking a category routes users to the **Browse View** for that selection.

### 🛍️ Browse View  
- Core product-browsing interface.  
- Filters and displays items by category, price, or other criteria.  
- Products are loaded dynamically from a compact **JSON data file** using the `fetch()` API.

### 🧥 Single Product View  
- Displays detailed information for a selected item (image, price, description, etc.).  
- Includes an “Add to Cart” button that updates the local cart.

### 🛒 Shopping Cart View  
- Shows items currently in the cart.  
- Supports item removal and quantity updates.  
- **Cart data persists** via the `localStorage` API.

### ℹ️ About Us Dialog / Popup  
- Modal window providing project details, author information, and asset credits.  
- Contains a link to the GitHub repository and deployed site.

---

## 🛠️ Technologies Used
| Technology | Purpose |
|-------------|----------|
| **HTML5** | Semantic structure and view containers |
| **Tailwind CSS** | Responsive and modern styling |
| **JavaScript (ES6+)** | Interactivity, routing, and DOM manipulation |
| **JSON** | External product-data source |
| **localStorage API** | Client-side cart persistence |
| **GitHub Pages** | Static hosting and deployment |

---

## 📦 Data Handling
- Product data is fetched asynchronously from a provided JSON file using the `fetch()` API.  
- This approach mirrors how a real SPA would consume a web API while keeping deployment simple.  

---
