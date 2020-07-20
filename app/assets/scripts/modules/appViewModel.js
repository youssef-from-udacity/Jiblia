import ko, { observable, observableArray, computed } from 'knockout';
import OrderList from './shopingCart';
import Modal from './modal';
import * as ProductsAPI from './utils/ProductsAPI';


class AppViewModel {
    constructor() {
        this.modal = new Modal();
        this.orderList = OrderList;
        this.getProductsAPI();
        this.addBinding();
    }
    addBinding() {
        ko.bindingHandlers.scaleUpAnimation = {
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
                    element.classList.add("run-animation")
                    setTimeout(() => element.classList.remove("run-animation"), 200);
                } else if (!show && isVisible) {
                    element.classList.add("run-animation");
                    setTimeout(() => element.classList.remove("run-animation"), 200);
                }
            }
        }

        ko.bindingHandlers.toggleClick = {
            init: function (element, valueAccessor) {
                var value = valueAccessor();

                ko.utils.registerEventHandler(element, "click", function () {
                    value(!value());
                });
            }
        };

    }
    getProductsAPI() {
        ProductsAPI.getAll('/products').then((products) => {
            var productsCash
            products.forEach((item) => {
                productsCash = ProductsAPI.productsCash().filter((obj) => obj().id === item.id)
                !productsCash.length ? ProductsAPI.productsCash.push(observable(item)) : null;

            });
        })
    }
}
// Activates knockout.js
ko.applyBindings(new AppViewModel());

