# Braden’s Straight Teeth

## 👉 [**Open the website**](https://mcgee2262.github.io/BradenStraightTeeth/)

https://mcgee2262.github.io/BradenStraightTeeth/

*Fossils from the Carolina Coast.*

A demo website for a shark tooth shop on Oak Island, North Carolina, owned by Braden Dowling (Owner & CEO).
This is a concept site: the address, reviews and prices are examples, and no orders or payments are processed.

## Pages
- `index.html`: home with Tooth of the Week and a real-size tooth comparator
- `shop.html`: full catalog with filters; `tooth.html?id=…` for each tooth
- `cart.html`: demo cart (saved in the visitor's browser)
- `guide.html`: species ID guide, Oak Island hunting tips and a quiz
- `about.html`, `visit.html`

## Editing teeth
All products live in `js/data.js`. Add an entry to `PRODUCTS` with a `species` (`meg`, `gw`, `otodus`, `angust`, `mako`, `tiger`, `bull`, `sandtiger`, `hemi`, `lemon`) and a `color` (`black`, `gray`, `tan`, `brown`, `bluegray`, `cream`), and the tooth illustration is drawn for you.

## Running locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.
