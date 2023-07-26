export class Ecommerce {
  constructor(category, title, price, image) {
    this.image = image;
    this.category = category;
    this.title = title;
    this.price = price;
    this.quantity = 1;
  }

  getInfo() {
    return `${this.title} - (${this.price}) `;
  }

  getPosterUrl() {
    return `https://fakestoreapi.com/img/${this.image}`;
  }
}