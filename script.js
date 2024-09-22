// Savat va mahsulotlar haqida ma'lumot
let cartItems = [];
const products = [
  {
    id: 1,
    name: "Milter yog' 1liter",
    price: 22000,
    img: "./img/milterYog.jpg",
  },
  {
    id: 2,
    name: "Mayonez “Provansal” 67 % 770 gr",
    price: 19900,
    img: "./img/milterMoyonez.jpg",
  },
  {
    id: 3,
    name: "Milter Mayonez 'Provansal 67 %', 190 g",
    price: 10000,
    img: "./img/milterMoyanez.jpg",
  },
  {
    id: 4,
    name: "Milter sous Chili 200gm",
    price: 7000,
    img: "./img/milterChili.jpg",
  },
];

// HTML elementlarini olish
const cartCountElement = document.querySelector(".cart-count");
const cartItemsElement = document.querySelector(".cart-items");
const cartModal = document.querySelector(".cart-modal");
const closeCartButton = document.querySelector(".close-cart");

// Mahsulotlar sonini yangilash
function updateCartCount() {
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalCount;
}

// Savatni yangilash funksiyasi
function updateCart() {
  cartItemsElement.innerHTML = "";
  cartItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.quantity} ta`;
    cartItemsElement.appendChild(li);
  });
  updateCartCount();
}

// Savatga mahsulot qo'shish
function addToCart(productId, quantity) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cartItem = cartItems.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cartItems.push({ ...product, quantity });
  }
  updateCart();
}

// Mahsulot kartochkalari uchun hodisalar qo'shish
document.querySelectorAll(".card").forEach((card, index) => {
  const productId = products[index].id;
  const quantityElement = card.querySelector(".quantity");
  let quantity = 0;

  card.querySelector(".btnPlus").addEventListener("click", () => {
    quantity++;
    quantityElement.textContent = quantity;
  });

  card.querySelector(".btnMinus").addEventListener("click", () => {
    if (quantity > 0) {
      quantity--;
      quantityElement.textContent = quantity;
    }
  });

  card.querySelector(".btnAddToCart").addEventListener("click", () => {
    if (quantity > 0) {
      addToCart(productId, quantity);
      quantity = 0;
      quantityElement.textContent = quantity;
    }
  });
});

// Savat oynasini ochish va yopish
document.querySelector(".cart-btn").addEventListener("click", () => {
  cartModal.style.display = "flex";
});

closeCartButton.addEventListener("click", () => {
  cartModal.style.display = "none";
});
