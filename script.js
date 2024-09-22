document.addEventListener("DOMContentLoaded", function () {
  const cartBtn = document.querySelector(".cart-btn");
  const cartModal = document.querySelector(".cart-modal");
  const closeCart = document.querySelector(".close-cart");
  const cartItems = document.querySelector(".cart-items");
  const cartCount = document.querySelector(".cart-count");

  let cart = [];
  const botToken = "7885084406:AAHokrNIPMZ_nkUdjgc5_cE6olmgpsVeZuI"; // Bot token
  const chatId = "6407200891"; // Olingan chat ID

  // "+" va "-" tugmachalari uchun event listener
  document.querySelectorAll(".btnPlus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const quantitySpan = btn.nextElementSibling;
      let quantity = parseInt(quantitySpan.textContent, 10);
      quantity++;
      quantitySpan.textContent = quantity;
    });
  });

  document.querySelectorAll(".btnMinus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const quantitySpan = btn.previousElementSibling;
      let quantity = parseInt(quantitySpan.textContent, 10);
      if (quantity > 0) {
        quantity--;
        quantitySpan.textContent = quantity;
      }
    });
  });

  // "Savatga qo'shish" tugmasi
  document.querySelectorAll(".btnAddToCart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productCard = btn.parentElement;
      const productName = productCard.querySelector("h2").textContent;
      const productPriceString = productCard
        .querySelector("b")
        .textContent.replace(/[^\d]/g, "");
      const productPrice = parseInt(productPriceString, 10);
      const quantity = parseInt(
        productCard.querySelector(".quantity").textContent,
        10
      );

      if (quantity > 0) {
        const product = {
          name: productName,
          quantity: quantity,
          price: productPrice,
          totalPrice: productPrice * quantity,
        };

        const existingProductIndex = cart.findIndex(
          (item) => item.name === product.name
        );
        if (existingProductIndex !== -1) {
          cart[existingProductIndex].quantity += product.quantity;
          cart[existingProductIndex].totalPrice += product.totalPrice;
        } else {
          cart.push(product);
        }

        updateCart();
        productCard.querySelector(".quantity").textContent = "0"; // Reset quantity
      }
    });
  });

  function updateCart() {
    cartItems.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} (${item.quantity} x ${item.price} so'm) = ${item.totalPrice} so'm`;
      cartItems.appendChild(li);
      totalItems += item.quantity;
      totalPrice += item.totalPrice;
    });

    cartCount.textContent = totalItems;

    const totalLi = document.createElement("li");
    totalLi.textContent = `Jami: ${totalPrice} so'm`;
    cartItems.appendChild(totalLi);

    // Buyurtma yuborish tugmasi
    const orderButton = document.createElement("button");
    orderButton.textContent = "Buyurtmani Yuborish";
    orderButton.classList.add("order-button");
    cartItems.appendChild(orderButton);

    orderButton.addEventListener("click", function () {
      const address = prompt("Manzilingizni kiriting:");
      if (address) {
        sendOrderToTelegram(address);
      }
    });
  }

  function sendOrderToTelegram(address) {
    let message = `📦 Yangi buyurtma:\n\nManzil: ${address}\n\n`;
    cart.forEach((item) => {
      message += `${item.name} - ${item.quantity} dona - ${item.totalPrice} so'm\n`;
    });
    message += `\nJami summa: ${cart.reduce(
      (total, item) => total + item.totalPrice,
      0
    )} so'm`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert("Buyurtma muvaffaqiyatli yuborildi!");
          cart = []; // Clear cart
          updateCart();
          cartModal.style.display = "none"; // Close cart modal
        } else {
          alert("Buyurtmani yuborishda xatolik yuz berdi!");
        }
      })
      .catch((error) => {
        console.error("Xato:", error);
        alert("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      });
  }

  closeCart.addEventListener("click", function () {
    cartModal.style.display = "none";
  });

  cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
  });
});
