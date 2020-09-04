import ko, { observable, observableArray, computed } from 'knockout';


class ProductOrder {
    constructor(obj) {
        this.id = obj.id
        this.title = obj.title
        this.subtitle = obj.subtitle
        this.quantity = obj.quantity
        this.imgURL = obj.imgURL
        this.minOrder = parseInt(obj.minOrder)
        this.buy = observable(obj.buy);
        this.order = observable(parseInt(obj.order ? obj.order : obj.minOrder));
        this.like = observable(obj.like);
        this.price = observable(parseInt(obj.price).toFixed(2));
        this.basket = computed(function () {
            if (this.buy()) {
                return (this.order() * this.price()).toFixed(2);
            } else {
                this.order(this.minOrder)
                return 0;
            }
        }, this);
    }

    decrement() {
        this.order() > this.minOrder ? this.order(this.order() - 1) : null;
    }

    increment() {
        this.order(this.order() + 1);
    }
}

class OrderList {
    constructor(glob) {
        var self = this
        this.arrOfProducts = null;
        this.ProductOrder = ProductOrder
        this.listProducts = observableArray([])
        this.globalListProducts = observableArray([])
        this.toLocalStorage = computed(function () {
            const productsCashToJson = ko.toJSON(this.globalListProducts)
            this.globalListProducts().length ? localStorage.setItem('globalListProducts', productsCashToJson) : null

        }, this)
        this.purchasedProducts = observableArray([]);
        this.productsCount = computed(function () {
            const arr = this.globalListProducts().filter((product) => product.buy());

            setTimeout(() => self.purchasedProducts(arr), 300)
            return arr.length;
        }, this);

        this.total = computed(function () {
            const arr = this.purchasedProducts().map((val) => val.basket() * 1)
            return arr.length ? arr.reduce((a, b) => a + b).toFixed(2) : null;
        }, this);
        this.loadLocalStorage()
    }

    loadLocalStorage() {
        if (!this.globalListProducts().length && localStorage.globalListProducts && Array.isArray(JSON.parse((localStorage.globalListProducts)))) {
            this.globalListProducts(JSON.parse(localStorage.globalListProducts).map((item) => new ProductOrder(item)))
        }
    }
    clearPurchaseProducts() {
        this.purchasedProducts().forEach((product) => product.buy(false))
    }
    updateProductGallery() {
        const self = this
        var product = null

        if (this.arrOfProducts) {
            const mappedList = this.arrOfProducts.map((item) => {
                for (var i = 0; i < self.globalListProducts().length; i++) {
                    let obj = self.globalListProducts()[i]
                    if (obj.id === item.id) {
                        return obj;
                    }
                }
                product = new ProductOrder(item);
                self.globalListProducts.push(product)
                return product;


            });
            this.listProducts(mappedList)
        }
    }
}

export default OrderList;

