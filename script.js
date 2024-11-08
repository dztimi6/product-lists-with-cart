"use script";

const emptyCart = document.querySelector(".empty");
const fullCart = document.querySelector(".full-cart");
const numberField = document.querySelector("input");
const orderSize = document.querySelector(".order-size");
const quantity = document.querySelector(".quantity");
const totalPrise = document.querySelector(".total-prise");
const dessert = document.querySelector("desserts");
const dessertImgs = document.querySelectorAll(".dessert-img");
const dessertContainer = document.querySelector(".desserts-container");
const cartList = document.querySelector(".order-details");
const orderList = document.querySelector(".confirmed-order");
const body = document.querySelector("body");
const main = document.querySelector("main");
const overlay = document.querySelector(".overlay");
const successPage = document.querySelector(".success-page");
let total = document.querySelector(".order-size");
let orderTotal = document.querySelector(".total-price");

const addToCartBtn = document.querySelector(".cart-btn");
const counterBtn = document.querySelectorAll(".counter");
const minusBtn = document.querySelector(".minus");
const plusBtn = document.querySelector(".plus");
const removeItemBtn = document.querySelector(".remove-item-icon");
const ConfirmOrderBtn = document.querySelector(".order-btn");
const checkOutBtn = document.querySelector(".check-out-btn");

let dessertLists = [];
let carts = [];
// Function to update the number field
const updateNumber = function (increment, inputVal) {
  let currentValue = parseInt(inputVal.value);
  // Check if decrementing would result in a negative value
  if (currentValue + increment >= 0) {
    inputVal.value = currentValue + increment;
  }
};

const addBorder = function (btn) {
  btn.previousElementSibling.lastElementChild.style.border =
    "1.5px solid var(--red)";
};

const hideElement = function (el) {
  el.classList.toggle("hidden");
};

body.addEventListener("click", (e) => {
  // console.log(e.target);
  cartBtnClicked = e.target;
  if (cartBtnClicked.classList.contains("cart-btn")) {
    body.classList.add("show-cart");
    hideElement(cartBtnClicked.nextElementSibling);
    hideElement(cartBtnClicked);
    emptyCart.style.display = "none";
    cartBtnClicked.nextElementSibling.firstElementChild.nextElementSibling.value = 1;
    addBorder(cartBtnClicked);
  } else if (cartBtnClicked.classList.contains("cart-img")) {
    body.classList.add("show-cart");
    hideElement(cartBtnClicked.parentElement);
    emptyCart.style.display = "none";
    hideElement(cartBtnClicked.parentElement.nextElementSibling);
    cartBtnClicked.parentElement.nextElementSibling.firstElementChild.nextElementSibling.value = 1;
    addBorder(cartBtnClicked.parentElement);
  }
});

// Remove item from cart
cartList.addEventListener("click", (e) => {
  let clickedPosition = e.target;
  let dessertId = clickedPosition.parentElement.dataset.id;
  if (clickedPosition.classList.contains("remove-item-icon")) {
    removeItemFromCart(dessertId);
  } else if (clickedPosition.classList.contains("remove-item-img")) {
    dessertId = clickedPosition.parentElement.parentElement.dataset.id;
    console.log(dessertId);
    removeItemFromCart(dessertId);
  }
});

// Function to remove item from cart
const removeItemFromCart = (dessertId) => {
  let positionDessertInCart = carts.findIndex(
    (value) => value.dessertId == dessertId
  );
  carts.splice(positionDessertInCart, 1);
  addToCartToHtml();
};

// add dessert data to html
const addDataToHtml = () => {
  dessertContainer.innerHTML = "";
  if (dessertLists.length > 0) {
    dessertLists.forEach((dessert) => {
      let newDessert = document.createElement("div");
      newDessert.classList.add("desserts");
      newDessert.dataset.id = dessert.id;
      newDessert.innerHTML = `
          <div class="dessert-img">
            <picture>
              <!-- for mobile -->
              <source
                media="(max-width:480px)"
                srcset="${dessert.image.mobile}"
              />
              <!-- for tablet -->
              <source
                media="(max-width:768px)"
                srcset="${dessert.image.tablet}"
              />
              <!-- for desktop -->
              <img
                src="${dessert.image.desktop}"
                alt="waffle-img"
              />
            </picture>
            <button class="cart-btn">
              <div class="cart-img btn">
                <img
                class="btn"
                  src="./assets/images/icon-add-to-cart.svg"
                  alt="cart-img"
                />
               Add To Cart
              </div>
            </button>

            <div class="counter hidden">
              <button class="sign minus flex">
                <img
                  class="minus-img"
                  src="./assets/images/icon-decrement-quantity.svg"
                  alt="decrement sign"
                />
              </button>
              <input type="text" id="cart-counter-value" value="0" readonly />
              <button class="sign plus flex">
                <img
                  class="plus-img"
                  src="./assets/images/icon-increment-quantity.svg"
                  alt="increment sign"
                />
              </button>
            </div>
          </div>
          <p class="name">${dessert.category}</p>
          <p class="category">${dessert.name}</p>
          <p class="price">$${dessert.price.toFixed(2)}</p>
      `;
      dessertContainer.appendChild(newDessert);
    });
  }
};

// Event-listener to know when the add to cart button is clicked
dessertContainer.addEventListener("click", (e) => {
  let positionClick = e.target;
  let dessertId = positionClick.parentElement.parentElement.dataset.id;
  if (positionClick.classList.contains("cart-btn")) {
    addToCart(dessertId);
    OrderListHtml();
  } else if (positionClick.classList.contains("cart-img")) {
    dessertId =
      positionClick.parentElement.parentElement.parentElement.dataset.id;
    addToCart(dessertId);
    OrderListHtml();
  }
});

// function to increase quantity of dessert
const addToCart = (dessertId) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.dessertId == dessertId
  );
  if (carts.length <= 0) {
    carts = [
      {
        dessertId: dessertId,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      dessertId: dessertId,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity += 1;
  }
  addToCartToHtml();

  // addCartToMemory();
};

// const addCartToMemory = () => {
//   localStorage.setItem("cart", JSON.stringify(carts));
// };

// add data to the cart section
const addToCartToHtml = () => {
  cartList.innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("ordered-desserts");
      newCart.classList.add("flex");
      newCart.dataset.id = cart.dessertId;
      let positionDessert = dessertLists.findIndex(
        (value) => value.id == cart.dessertId
      );
      let info = dessertLists[positionDessert];
      newCart.innerHTML = `
           <div class="order">
              <p class="category">${info.name}</p>
              <div class="quantity-section">
                <p class="quantity">${cart.quantity}x</p>
                <div class="price-section">
                  <p class="unit-price">@ $${info.price.toFixed(2)}</p>
                  <p class="quantity-price">$${(
                    cart.quantity * info.price
                  ).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <button class="remove-item-icon flex">
              <img
                class="remove-item-img"
                src="./assets/images/icon-remove-item.svg"
                alt="remove-item-icon"
              />
            </button>`;
      totalPrice += cart.quantity * info.price;
      cartList.appendChild(newCart);
    });
  }
  total.innerHTML = totalQuantity;
  totalPrise.innerHTML = `$${totalPrice.toFixed(2)}`;

  if (carts.length >= 7) {
    fullCart.style.inset = "0 0 0 auto";
  }

  if (carts.length >= 3) {
    orderList.style.height = "30vh";
  }

  if (carts.length == 0) {
    body.classList.remove("show-cart");
    fullCart.classList.add("hidden");
    emptyCart.classList.remove("hidden");
  } else {
    body.classList.add("show-cart");
    fullCart.classList.remove("hidden");
    emptyCart.classList.add("hidden");
  }
};

//section to confirm order
const OrderListHtml = () => {
  orderList.innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("checkout-section");
      // newCart.classList.add("flex");
      newCart.dataset.id = cart.dessertId;
      let positionDessert = dessertLists.findIndex(
        (value) => value.id == cart.dessertId
      );
      let info = dessertLists[positionDessert];
      newCart.innerHTML = `
              <div class="flex check-out">
              <div class="order-info">
                <div class="thumbnail-img">
                  <img
                    src=${info.image.thumbnail}
                    alt="image-${info.name}-thumbnail"
                  />
                </div>
                <div>
                  <div class="category single-line-ellipsis">${info.name}</div>
                  <div class="quantity-section">
                    <p class="quantity">${cart.quantity}x</p>
                    <p class="unit-price">@ $${info.price.toFixed(2)}</</p>
                  </div>
                </div>
              </div>

              <p class="quantity-price">$${(cart.quantity * info.price).toFixed(
                2
              )}</p>
            </div>
            <hr />`;
      totalPrice += cart.quantity * info.price;
      orderList.appendChild(newCart);
    });
  }
  total.innerHTML = totalQuantity;
  orderTotal.innerHTML = `$${totalPrice.toFixed(2)}`;
};

// event-lisetener to know when to increase quantity or reduce quantity
dessertContainer.addEventListener("click", (e) => {
  let positionClick = e.target;
  let dessertId =
    positionClick.parentElement.parentElement.parentElement.dataset.id;
  let type = "minus";
  // console.log(dessert_id, dessertId);
  if (positionClick.classList.contains("minus")) {
    updateNumber(-1, positionClick.nextElementSibling);
    changeQuantity(dessertId, type);
  } else if (positionClick.classList.contains("plus")) {
    type = "plus";
    updateNumber(1, positionClick.previousElementSibling);
    changeQuantity(dessertId, type);
  } else if (positionClick.classList.contains("minus-img")) {
    dessertId =
      positionClick.parentElement.parentElement.parentElement.parentElement
        .dataset.id;
    updateNumber(-1, positionClick.parentElement.nextElementSibling);
    changeQuantity(dessertId, type);
  } else if (positionClick.classList.contains("plus-img")) {
    dessertId =
      positionClick.parentElement.parentElement.parentElement.parentElement
        .dataset.id;
    type = "plus";
    updateNumber(1, positionClick.parentElement.previousElementSibling);
    changeQuantity(dessertId, type);
  }
});

// function to change quantity if dessert
const changeQuantity = (dessertId, type) => {
  let positionDessertInCart = carts.findIndex(
    (value) => value.dessertId == dessertId
  );
  if (positionDessertInCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionDessertInCart].quantity += 1;
        break;

      default:
        let valueChange = carts[positionDessertInCart].quantity - 1;
        if (valueChange > 0) {
          carts[positionDessertInCart].quantity = valueChange;
        } else {
          carts.splice(positionDessertInCart, 1);
        }
        break;
    }
  }
  // addCartToMemory();
  addToCartToHtml();
};

// event-listener to add effect to dessert images
dessertContainer.addEventListener("click", (e) => {
  let positionClick = e.target;
  if (positionClick.classList.contains("minus")) {
    if (positionClick.nextElementSibling.value == 0) {
      hideElement(positionClick.parentElement);
      hideElement(positionClick.parentElement.previousElementSibling);
      positionClick.parentElement.parentElement.firstElementChild.lastElementChild.style.border =
        "none";
    }
  } else if (positionClick.classList.contains("plus")) {
    if (positionClick.previousElementSibling.value == 0) {
      hideElement(positionClick.parentElement);
      hideElement(positionClick.parentElement.previousElementSibling);
      positionClick.parentElement.parentElement.firstElementChild.lastElementChild.style.border =
        "none";
    }
  } else if (positionClick.classList.contains("minus-img")) {
    if (positionClick.parentElement.nextElementSibling.value == 0) {
      hideElement(positionClick.parentElement.parentElement);
      hideElement(
        positionClick.parentElement.parentElement.previousElementSibling
      );
      positionClick.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.style.border =
        "none";
    }
    dessertId =
      positionClick.parentElement.parentElement.parentElement.parentElement
        .dataset.id;
  } else if (positionClick.classList.contains("plus-img")) {
    if (positionClick.parentElement.previousElementSibling.value == 0) {
      hideElement(positionClick.parentElement.parentElement);
      hideElement(
        positionClick.parentElement.parentElement.previousElementSibling
      );
      positionClick.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.style.border =
        "none";
    }
    dessertId =
      positionClick.parentElement.parentElement.parentElement.parentElement
        .dataset.id;
  }
});

const compareId = (dessertId) => {
  let dessertList = dessertContainer.children;
  let dessertChildren = [...dessertList];
  dessertChildren.forEach((child) => {
    if (child.dataset.id == dessertId) {
      child.firstElementChild.firstElementChild.lastElementChild.style.border =
        "none";
      hideElement(child.firstElementChild.children[1]);
      hideElement(child.firstElementChild.lastElementChild);
    }
  });
};

body.addEventListener("click", (e) => {
  let positionClick = e.target;
  let dessertId = positionClick.parentElement.dataset.id;
  if (positionClick.classList.contains("remove-item-icon")) {
    compareId(dessertId);
  } else if (positionClick.classList.contains("remove-item-img")) {
    dessertId = positionClick.parentElement.parentElement.dataset.id;
    console.log(dessertId);
    console.log(positionClick.parentElement.parentElement);
    compareId(dessertId);
  }
});

ConfirmOrderBtn.addEventListener("click", (e) => {
  OrderListHtml();
  overlay.classList.toggle("hidden");
  successPage.classList.toggle("hidden");
  window.scrollTo(0, 0);
});

checkOutBtn.addEventListener("click", (e) => {
  overlay.classList.toggle("hidden");
  successPage.classList.toggle("hidden");
  location.reload();
});

const initApp = () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      dessertLists = data;
      addDataToHtml();

      // // get cart from memory
      // if (localStorage.getItem("cart")) {
      //   carts = JSON.parse(localStorage.getItem("cart"));
      //   addToCartToHtml();
      // }
    })
    .catch((error) => console.error(error));
  setTimeout(() => {
    body.style.display = "block";
    // main.style.display = "block";
  }, 200);
};

initApp();
