document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("bazinCart")) || [];

  function updateCart() {
    document.getElementById("cart-count").textContent = cart.length;
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartModal = document.getElementById("cart-modal");

    if (cart.length === 0) {
      cartItems.innerHTML =
        '<p class="text-gray-500 text-center py-4">Votre panier est vide</p>';
      cartTotal.textContent = "XOF 0";
      if (cartModal.querySelector("#proceed-to-payment")) {
        cartModal
          .querySelector("#proceed-to-payment")
          .classList.add("cursor-not-allowed", "opacity-50");
      }
      localStorage.setItem("bazinCart", JSON.stringify(cart));
      return;
    }

    if (cartModal.querySelector("#proceed-to-payment")) {
      cartModal
        .querySelector("#proceed-to-payment")
        .classList.remove("cursor-not-allowed", "opacity-50");
    }

    let total = 0;
    cartItems.innerHTML = cart
      .map((item, index) => {
        total += parseFloat(item.price);
        return `
                <li class="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                        <p class="font-medium">${item.name}</p>
                        <p class="text-sm text-gray-500">XOF ${parseFloat(
                          item.price
                        ).toLocaleString("fr-FR")}</p>
                    </div>
                    <button class="remove-item text-red-500 hover:text-red-700" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </li>
            `;
      })
      .join("");

    cartTotal.textContent = `XOF ${total.toLocaleString("fr-FR")}`;
    localStorage.setItem("bazinCart", JSON.stringify(cart));

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        cart.splice(index, 1);
        updateCart();
      });
    });
  }

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productCard = btn.closest(".product-card");
      const productId = productCard.getAttribute("data-product-id");
      const productName = productCard.getAttribute("data-product-name");
      const productPrice = parseFloat(
        productCard.getAttribute("data-product-price")
      );

      const product = {
        id: productId,
        name: productName,
        price: productPrice,
      };

      cart.push(product);
      updateCart();

      // Show added notification
      const notification = document.createElement("div");
      notification.className =
        "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg";
      notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    <span>${product.name.toUpperCase()} ajouté au panier!</span>
                </div>
            `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    });
  });

  document.getElementById("cart-btn").addEventListener("click", () => {
    document.getElementById("cart-modal").classList.remove("hidden");
  });

  document.getElementById("close-cart").addEventListener("click", () => {
    document.getElementById("cart-modal").classList.add("hidden");
  });

  const continueShoppingBtn = document.getElementById("continue-shopping");
  const checkoutBtn = document.getElementById("proceed-to-payment");
  const phoneInput = document.getElementById("phone-number");

  function updateButtonStates() {
    const phoneNumberExists = phoneInput.value.trim() !== "";
    const buttons = [checkoutBtn, continueShoppingBtn];
    buttons.forEach((btn) => {
      if (btn) {
        if (phoneNumberExists) {
          btn.disabled = false;
          btn.classList.remove("opacity-50", "cursor-not-allowed");
        } else {
          btn.disabled = true;
          btn.classList.add("opacity-50", "cursor-not-allowed");
        }
      }
    });
  }

  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", () => {
      document.getElementById("cart-modal").classList.add("hidden");
    });
  }

  if (checkoutBtn) {
    // Disable buttons initially
    updateButtonStates();

    // Add event listener to phone input
    phoneInput.addEventListener("input", updateButtonStates);

    checkoutBtn.addEventListener("click", () => {
      const phoneNumber = phoneInput.value;
      if (cart.length > 0) {
        const csrftoken = document.querySelector(
          "[name=csrfmiddlewaretoken]"
        ).value;
        fetch("/process_order/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ cart: cart, phone: phoneNumber }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.status === "success") {
              alert("Commande passée avec succès!");
              cart = [];
              updateCart();
              document.getElementById("cart-modal").classList.add("hidden");
            } else {
              alert("Erreur: " + data.message);
            }
          })
          .catch((error) => {
            console.error("Erreur:", error);
            alert("Une erreur est survenue lors de la commande.");
          });
      } else {
        alert("Votre panier est vide!");
      }
    });
  }

  document.querySelectorAll(".slideshow").forEach((slideshow) => {
    const imgs = slideshow.querySelectorAll("img");
    if (imgs.length > 1) {
      slideshow.addEventListener("mouseover", () => {
        imgs[0].classList.remove("active");
        imgs[1].classList.add("active");
      });
      slideshow.addEventListener("mouseout", () => {
        imgs[1].classList.remove("active");
        imgs[0].classList.add("active");
      });
    }
  });

  updateCart();
});
