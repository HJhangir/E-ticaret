import { Ecommerce } from "./Ecommerce.js";

export class EcommerceLibrary {
  constructor() {
    this.productlist = [];
    this.basketList = [];
  }

  async getEcommerce() {
    try {
      const response = await fetch(`https://fakestoreapi.com/products`);
      const data = await response.json();
      this.productlist = this.convertDataToproduct(data);
      this.convertproductlistToHTML();
    } catch (err) {
      console.log("APIdan error gelir", err);
    }
  }

  async searchproductsFromInternet(keyword) {
    try {
      const response = await fetch(`https://fakestoreapi.com/products?title=${keyword}`);
      const data = await response.json();
      const product = this.convertDataToproduct(data);

      const matchingproduct = product.filter((products) =>
        products.title.toLowerCase().includes(keyword.toLowerCase())
      );

      this.convertproductlistToHTML(matchingproduct);
    } catch (err) {
      console.error("Arama işlemi başarısız oldu:", err);
      this.convertproductlistToHTML([]);
    }
  }

  convertDataToproduct(melumatlar) {
    return melumatlar.map(
      (birMelumat) =>
        new Ecommerce(
          birMelumat.category,
          birMelumat.title,
          birMelumat.price,
          birMelumat.image
        )
    );
  }

  convertproductlistToHTML(product = this.productlist) {
    const productlistDiv = document.getElementById("products-list");

    productlistDiv.innerHTML = "";

    if (product.length === 0) {
      productlistDiv.innerHTML = `<p class="mehsul-tapilmadi">Məhsul tapılmadı:(</p>`;
      return;
    }

    product.forEach((kino) => {
      const cardElement = this.createCardElement(kino);
      productlistDiv.appendChild(cardElement);
    });
  }

  createCardElement(products) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const cardBodyElement = document.createElement("div");
    cardBodyElement.classList.add("card-body");

    const imageElement = document.createElement("img");
    imageElement.classList.add("card-img-top");
    imageElement.src = products.image;
    imageElement.alt = products.title;

    const categoryElement = document.createElement("h5");
    categoryElement.classList.add("card-title");
    categoryElement.innerText = products.category;

    const titleElement = document.createElement("h5");
    titleElement.classList.add("card-title");
    titleElement.innerText = products.title;

    const priceElement = document.createElement("button");
    priceElement.classList.add("card-price");
    priceElement.innerHTML = `<i class="fa-solid fa-money-bill">\n${products.price}</i>`;
    priceElement.addEventListener("click", () => {
      this.addToBasket(products);
    });

    cardBodyElement.appendChild(imageElement);
    cardBodyElement.appendChild(categoryElement);
    cardBodyElement.appendChild(titleElement);
    cardBodyElement.appendChild(priceElement);

    cardElement.appendChild(cardBodyElement);

    return cardElement;
  }

  countproductsInBasket(products) {
    return this.basketList.filter((item) => item.title === products.title).length;
  }

  addToBasket(products) {
    const existingproducts = this.basketList.find((item) => item.title === products.title);

    if (existingproducts) {
      existingproducts.quantity++;
    } else {
      products.quantity = 1;
      this.basketList.push(products);
    }

    this.convertBasketListToHTML();
    this.calculateTotalPrice();
  }

  convertBasketListToHTML() {
    const basketListDiv = document.getElementById("basket-list");
    basketListDiv.innerHTML = "";

    if (this.basketList.length === 0) {
      basketListDiv.innerHTML = `<p class="alert alert-warning">Səbət boşdur.</p>`;
      return;
    }

    this.basketList.forEach((products, index) => {
      const basketItem = document.createElement("li");
      basketItem.innerHTML = `
        <span>${products.title} - (${products.price}) - ${products.quantity}x</span>
        <button class="remove-from-basket" data-index="${index}">Məhsulu sil</button>
      `;
      basketListDiv.appendChild(basketItem);
    });
  }

  removeFromBasket(index) {
    if (index >= 0 && index < this.basketList.length) {
      const productsToRemove = this.basketList[index];

      if (productsToRemove.quantity > 1) {
        productsToRemove.quantity--;
      } else {
        this.basketList.splice(index, 1);
      }

      this.convertBasketListToHTML();
      this.calculateTotalPrice();
    }
  }

  clearBasket() {
    this.basketList = [];
    this.convertBasketListToHTML();
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    const totalPrice = this.basketList.reduce((total, products) => total + parseFloat(products.price) * products.quantity, 0);
    const totalPriceElement = document.getElementById("total-price");
    totalPriceElement.innerText = `Ümumi Qiymət: ${totalPrice.toFixed(2)}`;
  }

  searchproductlistener() {
    const inputElement = document.getElementById("products-search-input");
    const searchButton = document.getElementById("search-button");

    searchButton.addEventListener("click", async (event) => {
      event.preventDefault();

      const searchedTitle = inputElement.value.trim();

      if (searchedTitle === "") {
        this.convertproductlistToHTML(this.productlist);
        return;
      }

      await this.searchproductsFromInternet(searchedTitle);
    });

    inputElement.addEventListener("input", async () => {
      const searchedTitle = inputElement.value.trim();

      if (searchedTitle === "") {
        this.convertproductlistToHTML(this.productlist);
        return;
      }

      await this.searchproductsFromInternet(searchedTitle);
    });
  }

  start() {
    this.getEcommerce();
    this.searchproductlistener();


    const clearBasketButton = document.getElementById("clear-basket-button");
    clearBasketButton.addEventListener("click", () => {
      this.clearBasket();
    });

    const basketListDiv = document.getElementById("basket-list");
    basketListDiv.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-from-basket")) {
        const index = parseInt(event.target.dataset.index);
        this.removeFromBasket(index);
      }
    });
  }
}
