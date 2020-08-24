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
        this.order = observable(parseInt(obj.order && this.buy() ? obj.order : obj.minOrder));
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
    constructor() {
        var self = this
        this.arrOfProducts = null;
        this.listProducts = observableArray([])
        this.globalListProducts = observableArray([])
        this.purchasedProducts = observableArray([]);
        this.productsCount = computed(function () {
            const arr = this.listProducts().filter((product) => {
                product.buy()
            });
            const arr2 = this.globalListProducts().filter((product) => product.buy());

            setTimeout(() => self.purchasedProducts(arr2), 300)
            return arr2.length;
        }, this);

        this.total = computed(function () {
            const arr = this.purchasedProducts().map((val) => val.basket() * 1)
            return arr.length ? arr.reduce((a, b) => a + b).toFixed(2) : null;
        }, this);
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

export default new OrderList();

