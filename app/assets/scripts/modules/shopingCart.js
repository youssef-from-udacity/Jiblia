import $ from 'jquery'
import ko, { observable, observableArray, computed } from 'knockout';
import * as ProductsAPI from './utils/ProductsAPI';


class ProductOrder {
    constructor(obj) {
        this.id = obj.id
        this.title = obj.title
        this.subtitle = obj.subtitle
        this.quantity = obj.quantity
        this.imgURL = obj.imgURL
        this.order = observable(parseInt(obj.minOrder));
        this.like = observable(obj.like);
        this.price = observable(parseInt(obj.price).toFixed(2));
        this.buy = observable();
        this.basket = computed(function () {
            return this.buy() ? (this.order() * this.price()).toFixed(2) : 0;
        }, this);
    }

    decrement() {
        this.order() > 1 ? this.order(this.order() - 1) : null;
    }

    likeOrdisLike2() {
        this.purchased(!this.purchased());
    }
    increment() {
        this.order(this.order() + 1);
    }
}

class OrderList {
    constructor() {
        this.arrOfProducts = null;
        this.listProducts = observableArray([])
        this.productBasket = observableArray([]);
        this.productsPurchased = observableArray([]);
        this.toggleAnimation = observable()
        this.productsCount = computed(function () {
            this.toggleOnOff(this.toggleAnimation);
            const arr = this.listProducts().filter((arrOfProducts) => arrOfProducts.buy());
            this.productsPurchased(arr)
            return arr.length;
        }, this);

        this.total = computed(function () {
            const arr = this.productBasket().map((val) => val() * 1)
            return arr.length ? arr.reduce((a, b) => a + b) : null;
        }, this);
        this.addObservables();
        this.addBinding();
        this.getProductsAPI();
    }
    getProductsAPI() {
        ProductsAPI.getAll().then((products) => {
            this.arrOfProducts = products.grocery;
            this.addObservables();
        })
    }

    addBinding() {
        ko.bindingHandlers.animateUpdate = {
            //On initialization, check to see if bound element should be hidden by default
            'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var show = ko.utils.unwrapObservable(valueAccessor());
                if (!show) {
                    element.style.display = 'none';
                }
            },
            //On update, see if fade in/fade out should be triggered. Factor in current visibility 
            'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var show = ko.utils.unwrapObservable(valueAccessor());
                var isVisible = !(element.style.display == "none");

                if (show && !isVisible) {
                    $(element).addClass("run-animation");
                    setTimeout(() => $(element).removeClass("run-animation"), 200);
                } else if (!show && isVisible) {
                    $(element).addClass("run-animation");
                    setTimeout(() => $(element).removeClass("run-animation"), 200);
                }
            }
        }
    }

    toggleOnOff(item) {
        item(!item());
    }

    addObservables() {
        if (this.arrOfProducts) {
            const mappedList = this.arrOfProducts.map((element) => {
                const product = new ProductOrder(element);
                this.productBasket.push(product.basket);
                return product;
            })
            this.listProducts(mappedList)
        }
    }
}

ko.applyBindings(new OrderList());

