import $ from 'jquery';
import ko, { observable, observableArray, computed } from 'knockout';
import * as ProductsAPI from './utils/ProductsAPI';



class UserAccount {
    constructor(glob) {
        this.global = glob
        this.folder = glob.folder
        this.redirect = glob.redirect
        this.loader = glob.loader
        this.modalResponse = glob.modal.modalResponse
        this.modalBasket = glob.modal.modalBasket
        this.getCollections = null
        this.isTrue = observable(true)
        this.isLogin = observable();
        this.accountLogin = observable();
        this.userEmail = observable();
        this.userPassword = observable();
        this.profile = observable({ zone: { zone: '', cost: 0 } });
        this.selectedZone = observable({ zone: "" });
        this.zone = observableArray([
            { zone: "Abattoir", cost: 25 },
            { zone: "Adrar", cost: 25 },
            { zone: "Al Fiddiya", cost: 25 },
            { zone: "Al Qods", cost: 25 },
            { zone: "Al Wifaq", cost: 25 },
            { zone: "Anouar Souss", cost: 25 },
            { zone: "Amsernat", cost: 25 },
            { zone: "Charaf", cost: 25 },
            { zone: "Bensergao", cost: 25 },
            { zone: "Cité Suisse", cost: 25 },
            { zone: "Dcheira", cost: 25 },
            { zone: "Dakhla", cost: 25 },
            { zone: "El Farah", cost: 25 },
            { zone: "El Houda", cost: 25 },
            { zone: "El Massira", cost: 25 },
            { zone: "Erac- Bouargane", cost: 25 },
            { zone: "Essalam", cost: 25 },
            { zone: "Extension Dakhla", cost: 25 },
            { zone: "Extension X", cost: 25 },
            { zone: "Founty", cost: 25 },
            { zone: "Haut Founty", cost: 25 },
            { zone: "Hay Al Wafa", cost: 25 },
            { zone: "Hay Hassani", cost: 25 },
            { zone: "Hay Mohammadi", cost: 25 },
            { zone: "Ihchach", cost: 25 },
            { zone: "Iligh", cost: 25 },
            { zone: "Inzegan", cost: 25 },
            { zone: "Laazib", cost: 25 },
            { zone: "Les Amicales", cost: 25 },
            { zone: "Lkhyam 1", cost: 25 },
            { zone: "Lkhyam 2", cost: 25 },
            { zone: "Nahda", cost: 25 },
            { zone: "Quartier industriel", cost: 25 },
            { zone: "Riad Salam", cost: 25 },
            { zone: "Sidi Youssef", cost: 25 },
            { zone: "Taddart", cost: 25 },
            { zone: "Talborjte 1", cost: 25 },
            { zone: "Talborjte 2", cost: 25 },
            { zone: "Tassila", cost: 25 },
            { zone: "Tikiouine", cost: 25 },
            { zone: "Tilila", cost: 25 },
            { zone: "Universiapolis", cost: 25 },
            { zone: "Ville nouvelle", cost: 25 },
            { zone: "Zone touristique", cost: 25 },
            { zone: "Ait melloul", cost: 35 },
            { zone: "Anza", cost: 35 },
            { zone: "Drarga", cost: 35 },
            { zone: "Aghroud 1", cost: 45 },
            { zone: "Aghroud 2", cost: 45 },
            { zone: "Aourir", cost: 45 },
            { zone: "Imi Ouaddar", cost: 45 },
            { zone: "La source", cost: 45 },
            { zone: "Lunga village", cost: 45 },
            { zone: "Medraba", cost: 45 },
            { zone: "Taghazout", cost: 45 },
            { zone: "Tamraght", cost: 45 }
        ])
        this.transactions = observableArray()
        this.transaction = observable()
        this.cancelCommandTime = null
        this.modifyCommandTime = null
        this.modifyTheCommand = observable()
    }

    modifyPurchaseStatus() {
        const self = this
        const data = {}
        data.id = self.profile().id
        data.purchaseId = self.transaction().purchaseId
        data.date = self.transaction().date
        data.activeTime = self.transaction().activeTime
        data.totalBasket = self.transaction().totalBasket
        data.delivery = self.transaction().delivery
        data.total = self.transaction().total
        data.textarea = self.transaction().textarea
        data.agreement = self.transaction().agreement
        data.status = 'Annulée'
        data.products = self.transaction().products

        this.loader(true)
        ProductsAPI.purchase(data).then((res) => {
            if (res.ok) {
                self.loader(false)
                self.getUserPurchaseData.call(self)
                self.modalResponse('success order was successfully canceled.')

            } else {
                self.loader(false)
                self.modalResponse('error network')
            }
        }).catch((error) => {
            self.loader(false)
            self.modalResponse('error network')
            console.log(error)
        })
    }

    getDate(time) {
        const d = new Date(...time)
        const obj = {}
        obj.cancelCommandTime = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0)).getTime()
        obj.modifyCommandTime = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 6, 0)).getTime()
        return obj
    }

    independentObservable() {
        return {
            observable: observable()
        };
    };

    signIn(form) {
        var self = this;
        this.getCollections = this.global.userLikes.getCollections
        var data = $(form).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        this.loader(true)
        ProductsAPI.login(data).then((res) => {
            if (res.ok) {
                res.json().then((response) => {
                    const index = self.zone().findIndex((obj) => obj.zone === response.profile.zone);
                    index !== -1 ? response.profile.zone = self.zone()[index] : null;
                    localStorage.setItem('token', response.access_token)
                    if (self.redirect()) {
                        self.folder(self.redirect())
                        self.redirect('')
                    } else {
                        self.folder('')
                    }
                    self.loader(false)
                    self.isLogin(true)
                    self.profile(response.profile)
                    self.modalResponse('success login')
                    self.getCollections.call(self.global.userLikes)
                })
            } else {
                self.loader(false)
                self.modalResponse('error email or password')
            }
        }).catch((error) => {
            self.modalResponse('error network')
            console.log(error)
        })

    }

    register(form) {
        var self = this;
        var data = $(form).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        this.loader(true)
        ProductsAPI.register(data).then((res) => {
            if (res.ok) {
                localStorage.setItem('token', res.json().access_token)
                self.folder('mon-compte/login')
                self.loader(false)
                self.modalResponse('success register')
            } else {
                self.loader(false)
                self.modalResponse('error email exist')
            }
        }).catch((error) => {
            self.modalResponse('error network')
            console.log(error)
        })

    }

    updateUserData() {
        const self = this
        const profile = this.profile()
        this.loader(true)
        ProductsAPI.updateProfile(`clients/${profile.id}`, profile).then((res) => {
            if (res.ok) {
                self.folder('mon-compte/mes-informations')
                self.loader(false)
                self.modalResponse('success update')
            } else {
                self.modalResponse('error network')
            }
        }).catch((error) => {
            self.modalResponse('error network')
            console.log(error)
        })

    }

    redoCommand() {
        const self = this
        const ProductOrder = this.global.orderList.ProductOrder
        var product;
        this.globalListProducts = this.global.orderList.globalListProducts
        self.globalListProducts().forEach((item) => item.buy(false))
        self.transaction().products.forEach((item) => {
            for (var i = 0; i < self.globalListProducts().length; i++) {
                if (self.globalListProducts().length !== 0) {
                    let observableObj = self.globalListProducts()[i]
                    if (observableObj.id === item.id) {
                        observableObj.order(item.order)
                        observableObj.buy(true)
                        return observableObj;
                    }
                }
            }
            item.buy = true
            product = new ProductOrder(item);
            self.globalListProducts.push(product)
            return product;
        })

        self.modalBasket(true)
        self.folder('')



    }

    getUserPurchaseData() {
        const self = this
        const profile = this.profile()
        this.loader(true)
        ProductsAPI.getAll(`clients/${profile.id}`).then((res) => {
            if (res.ok) {
                self.loader(false)
                res.json().then(data => data).then((client) => {
                    client.transactions.forEach((transaction) => {
                        const getTime = this.getDate.call(self, transaction.date)
                        transaction.cancelCommandTime = getTime.cancelCommandTime
                        transaction.modifyCommandTime = getTime.modifyCommandTime
                    })
                    client.transactions = client.transactions.sort(function (a, b) { return b.purchaseId - a.purchaseId });


                    self.transactions(client.transactions)
                })
            } else {
                self.loader(false)
                self.modalResponse('error network')
            }
        }).catch((error) => {
            self.loader(false)
            self.modalResponse('error network')
            console.log(error)
        })

    }

    updateUserPassword(form) {
        const self = this
        var data = $(form).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        data.id = this.profile().id
        this.loader(true)
        ProductsAPI.reset(data).then((res) => {
            if (res.ok) {
                self.loader(false)
                self.modalResponse('success update password')
            } else {
                self.modalResponse('error password mismatched')
            }
        }).catch((error) => {
            self.modalResponse('error network')
            console.log(error)
        })
    }

}

export default UserAccount;

