import ko, { observable, observableArray, computed } from 'knockout';
import OrderList from './shopingCart';
import UserAccount from './userAccount';
import Modal from './modal';
import FormValidation from './formValidation';
import Checkout from './checkout';
import * as ProductsAPI from './utils/ProductsAPI';
import Sammy from 'sammy';


class AppViewModel {
    constructor() {
        this.folder = observable('');
        this.loader = observable();
        this.location = computed(function () {
            location.hash = this.folder();
        }, this)
        this.modal = new Modal(this.folder, this.loader);
        this.userAccount = new UserAccount(this.folder, this.loader, this.modal);
        this.orderList = OrderList;
        this.formValidation = new FormValidation();
        this.checkout = new Checkout(this);
        this.getProductsAPI();
        this.addBinding();
        this.sammyRoute();
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
        ProductsAPI.getAll('products').then((res) => {
            var productsCash
            if (res.ok) {
                res.json().then(data => data).then((products) => {
                    products.forEach((item) => {
                        productsCash = ProductsAPI.productsCash().filter((obj) => obj().id === item.id)
                        !productsCash.length ? ProductsAPI.productsCash.push(observable(item)) : null;
                    });
                })
            } else {
                self.modalRequestError(true)
            }

        }).catch((error) => {
            self.modalRequestError('network')
            console.log(error)
        })
    }
    sammyRoute() {
        const self = this;
        Sammy(function () {
            this.get('#:folder/:subfolder', function () {
                self.folder(`${this.params.folder}/${this.params.subfolder}`);
            });
            this.get('#:folder', function () {
                self.folder(this.params.folder);
            });
            this.notFound = function () { };
        }).run();

    }
}

window.appViewModel = new AppViewModel()
// Activates knockout.js
ko.applyBindings(appViewModel);

