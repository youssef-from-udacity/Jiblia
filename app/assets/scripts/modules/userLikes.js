import $ from 'jquery';
import ko, { observable, observableArray, computed } from 'knockout';
import * as ProductsAPI from './utils/ProductsAPI';



class UserLikes {
    constructor(glob) {
        this.global = glob
        this.loader = glob.loader
        this.profile = glob.userAccount.profile
        this.isLogin = glob.userAccount.isLogin
        this.backdrop = glob.modal.backdrop
        this.modalLikes = glob.modal.modalLikes
        this.modalResponse = glob.modal.modalResponse
        this.modalResponse2 = glob.modal.modalResponse2
        this.modalBasket = glob.modal.modalBasket
        this.productOrder = this.global.orderList.ProductOrder
        this.globalListProducts = null
        this.product = observable()
        this.value = observable()
        this.collections = observableArray([])
        this.titleFlag = observable(false);
        this.group = observable()
        this.groupTitle = observable()
        this.computeTitle = computed(function () {
            this.group() ? this.groupTitle(this.group().name()) : null;
        }, this)

    }
    setFocusFlag() {
        this.titleFlag(true);
    }

    getLikeStatus(data) {
        const self = this
        if (this.isLogin()) {
            if (data.like()) {
                self.collections().forEach(obj => {
                    obj.products(obj.products().filter(val => val.id !== data.id))
                })
                data.like(false)
                self.sendCollections.call(self)
            } else {
                this.product(data)
                this.modalLikes(true)
            }
        } else {
            this.modalResponse2.call(data, 'warning not connected')
        }
    }

    addCollection() {
        const self = this
        const obj = {}
        obj.name = observable(self.value()[0].toUpperCase() + self.value().slice(1));
        obj.products = observableArray([])
        obj.products.push(self.product())

        const objIndex = self.collections().findIndex(val => val.name() === obj.name())
        if (objIndex === -1) {
            self.product().like(true)
            self.collections.push(obj)
            self.sendCollections.call(self)
            this.backdrop(false)
            self.modalResponse2(`success Le produit a été ajouté à la collection "${self.collections()[self.collections().length - 1].name()}"`)
        } else {
            self.modalResponse2('error collection exist')
        }
    }

    changeCollectionTitle() {
        const self = this
        const objIndex = self.collections().findIndex(val => val.name() === self.groupTitle())
        if (objIndex === -1) {
            this.group().name(self.groupTitle())
            this.sendCollections.call(self)

        } else {
            self.modalResponse2('error collection exist')
        }
    }

    removeProductFromCollection(data) {
        const self = this
        data.like(false)
        self.group().products(self.group().products().filter((obj) => obj !== data))
        self.sendCollections.call(self)

    }
    removeCollection() {
        const self = this
        self.collections(self.collections().filter((obj) => obj.name() !== self.group().name()))
        self.group(false)
        self.sendCollections.call(self)
    }

    addCollectionToBasket() {
        const self = this
        self.group().products().forEach((obj) => obj.buy(true))
        self.modalResponse2(`success Les produits de la collection " ${self.group().name()} " ont été ajoutés à votre panier`)
        self.group(false)
        self.modalBasket(true)

    }

    addLikeToCollection(collection) {
        const self = this
        const objIndex = self.collections().findIndex(val => val.name === collection.name)

        if (objIndex !== -1) {
            self.product().like(true)
            self.collections()[objIndex].products.push(self.product())
            self.sendCollections.call(self)
            this.backdrop(false)
            self.modalResponse2(`success Le produit a été ajouté à la collection "${self.collections()[objIndex].name()}"`)

        }
    }

    sendCollections() {
        const self = this
        const profile = this.profile()
        const collectionArr = this.collections().map((obj) => {
            const collection = {
                name: obj.name(),
                products: obj.products()
            }
            collection.products = collection.products.map((item) => {
                return {
                    id: item.id,
                    title: item.title,
                    subtitle: item.subtitle,
                    price: item.price(),
                    imgURL: item.imgURL,
                    minOrder: item.minOrder,
                    quantity: item.quantity
                }
            })
            return collection;
        })

        this.loader(true)
        ProductsAPI.updateProfile(`clients/${profile.id}`, { collections: collectionArr }).then((res) => {
            if (res.ok) {

                setTimeout(() => self.loader(false), 500)
            } else {
                self.modalResponse('error network')
            }
        }).catch((error) => {
            self.modalResponse('error network')
            console.log(error)
        })
    }

    addLikeToProduct(item) {
        const self = this
        const ProductOrder = this.productOrder
        var product;
        this.globalListProducts = this.global.orderList.globalListProducts
        for (var i = 0; i < self.globalListProducts().length || i === 0; i++) {
            if (self.globalListProducts().length !== 0) {
                let observableObj = self.globalListProducts()[i]
                if (observableObj.id === item.id) {
                    observableObj.like(true)
                    return observableObj;
                }
            }
        }
        product = new ProductOrder(item);
        product.like(true)
        self.globalListProducts.push(product)
        return product;
    }

    getCollections() {
        const self = this
        const profile = this.profile()
        this.loader(true)
        ProductsAPI.getAll(`clients/${profile.id}`).then((res) => {
            if (res.ok) {
                self.loader(false)
                res.json().then(data => data).then((client) => {
                    const collections = client.collections.map((obj) => {
                        const collection = {
                            name: observable(obj.name)
                        }
                        collection.products = obj.products.map((item) => {
                            return self.addLikeToProduct.call(self, item)
                        })
                        collection.products = observableArray(collection.products)
                        return collection;
                    })
                    self.collections(collections)

                })
            } else {
                self.loader(false)
                setTimeout(self.getCollections, 1000)
            }
        }).catch((error) => {
            self.loader(false)
            self.modalResponse('error network')
            console.log(error)
        })

    }

}

export default UserLikes;

