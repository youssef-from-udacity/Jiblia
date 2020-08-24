import $ from 'jquery';
import ko, { observable, observableArray, computed } from 'knockout';
import * as ProductsAPI from './utils/ProductsAPI';
import Util from './utils/util';




class Checkout {
    constructor(global) {
        this.loader = global.loader;
        this.folder = global.folder;
        this.orderList = global.orderList;
        this.userAccount = global.userAccount;
        this.modalRequestError = global.modal.modalRequestError
        this.parent = document.querySelector('.checkout__date-picker__slider__dates');
        this.active = observable('#checkout-step1')
        this.monthsNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
        this.daysNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
        this.timeSpan = ['12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00']
        this.success = observableArray()
        this.rightArrow = observable(0)
        this.leftArrow = observable(14)
        this.factor = observable(1)
        this.datePicker = observableArray()
        this.showTimeSpan = observable()
        this.data = observable({ reservedTimes: observableArray(), activeTime: observable(0), dayName: 'lundi', day: 10, monthName: 'octobre', date: [2020, 5, 20], })
        this.textarea = observable('')
        this.agreement = observable('first')
        this.total = computed(function () {
            return parseInt(this.orderList.total()) + parseInt(this.userAccount.profile().zone.cost);
        }, this)
    }

    hideElement(element, removeElementFromSuccess) {
        const scrollHeight = document.querySelector(element).scrollHeight;
        $(element).css('height', scrollHeight);
        setTimeout(function () {
            $(element).css({
                height: '0',
                margin: '0 !important',
                padding: '0 !important'
            });
        }, 50);
        this.success.push(element)
        if (removeElementFromSuccess) {
            this.success(this.success().filter((item) => item !== element))
        }
    }

    showElement(element) {
        const transitionDuration = Util.getTransitionDurationFromElement($(element));
        const scrollHeight = document.querySelector(element).scrollHeight;
        $(element).css({
            height: scrollHeight,
            margin: '',
            padding: ''
        })
        setTimeout(() => $(element).css({ height: '' }), transitionDuration);

        this.active(element)
        this.success(this.success().filter((item) => item !== element))
    }

    slideTo(direction) {
        const windowWidth = $(window).width()
        const parent = this.parent;
        var factor;
        if (windowWidth > 710) {
            factor = 5
        }
        if (windowWidth > 600 && windowWidth <= 710) {
            factor = 4
        }
        if (windowWidth > 425 && windowWidth <= 600) {
            factor = 3
        }
        if (windowWidth > 0 && windowWidth <= 426) {
            factor = 2
        }
        const child = parent.firstElementChild
        const oldLeftMargin = parseInt(child.style.marginLeft, 10) ? parseInt(child.style.marginLeft, 10) : 0;
        this.factor(factor)
        if (direction === 'left') {
            child.style.marginLeft = `${oldLeftMargin + factor * child.offsetWidth}px`
            this.leftArrow(this.leftArrow() + factor)
            this.rightArrow(this.rightArrow() - factor)

        } else {
            child.style.marginLeft = `${oldLeftMargin - factor * child.offsetWidth}px`
            this.rightArrow(this.rightArrow() + factor)
            this.leftArrow(this.leftArrow() - factor)
        }
    }

    getCalendarAPI() {
        var self = this;
        this.loader(true);

        ProductsAPI.getAll('calendar').then((res) => {
            var productsCash
            if (res.ok) {
                res.json().then(data => data).then((calendar) => {
                    self.getDate(calendar)
                    self.loader(false)
                })
            } else {
                self.modalRequestError(true)
            }

        }).catch((error) => {
            self.modalRequestError('network')
            console.log(error)
        })
    }

    getDate(calendar) {
        const monthsNames = this.monthsNames
        const daysNames = this.daysNames
        const server = calendar
        const arrayOfDates = []
        for (var i = 0; i < server.length; i++) {
            const date = new Date(...server[i].day)
            var obj = {}
            obj.monthName = monthsNames[date.getMonth()]
            obj.dayName = daysNames[date.getDay()]
            obj.day = date.getDate()
            obj.reserved = server[i].dayIsReserved
            obj.reservedTimes = observableArray(server[i].reservedTimes)
            obj.activeTime = observable(true)
            obj.date = server[i].day
            arrayOfDates.push(obj)
        }
        this.datePicker(arrayOfDates)
    }

    sendPurchase() {
        const self = this
        var arr = this.orderList.globalListProducts().filter((item) => item.buy())
        const data = {}
        data.id = this.userAccount.profile().id
        data.date = this.data().date
        data.activeTime = this.data().activeTime()
        data.totalBasket = parseInt(this.orderList.total())
        data.delivery = parseInt(this.userAccount.profile().zone.cost)
        data.total = data.totalBasket + data.delivery
        data.textarea = this.textarea()
        data.agreement = this.agreement()
        data.products = arr.map(element => {
            return {
                id: element.id,
                order: element.order(),
                imgURL: element.imgURL,
                quantity: element.quantity,
                subtitle: element.subtitle,
                title: element.title,
                price: parseInt(element.price()),
            }
        });

        this.loader(true)
        ProductsAPI.purchase(data).then((res) => {
            if (res.ok) {
                self.loader(false)
                self.folder('checkout/commande-envoyee')
            } else {
                self.loader(false)
                self.modalRequestError('network')
            }
        }).catch((error) => {
            self.loader(false)
            self.modalRequestError('network')
            console.log(error)
        })
    }

}

export default Checkout;

