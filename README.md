# 🧾 Bewell POS System

A responsive Point of Sale (POS) system for Bewell, designed for smooth usage across Notebook, Tablet, and Mobile devices. The system enables efficient cart management, flexible discounting, and seamless checkout experience.

---

## ✅ Features

### 🛍️ Product Component (30 points)

- Displays products with responsive layout:
  - **Notebook/Tablet:** 6 products per row
  - **Mobile:** 4 products per row
- Supports **searching products** by name or product code
- Includes a **checkout preview area** for reviewing selected items
- Allows **adding products to cart** for payment processing

### 💳 Checkout Component (40 points)

- All price calculations use **2 decimal places** (e.g., `1000.00`, `999.55`)
- Supports discounts per product:
  - **Fixed amount:** e.g., `100 Baht`, `500 Baht`
  - **Percentage-based:** e.g., `3%`, `5%`, `10%`
  - Example: A 100 Baht discount on a 1000 Baht item updates the display to `900.00`
- Supports **marking items as “deliver later”**, which separates them into a new entry
- Allows **removing products from the cart**
- Displays **final payment summary**, including:
  - Total price after item-level discounts (excluding VAT)
  - **7% VAT** breakdown
  - Additional **end-of-bill discount input**
  - Final total amount payable

### 🎨 Design and UX/UI (30 points)

- Focuses on intuitive UI and efficient cashier workflow
- UX enhancements include:
  - Color schemes, fonts, padding, and icon usage
  - Component layout and alignment for ease of use
  - Flow optimizations to reduce user error and speed up operations

---
