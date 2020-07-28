import ko, { observable, observableArray, computed } from 'knockout';
import * as ProductsAPI from './utils/ProductsAPI';
import OrderList from './shopingCart';



class Modal {
    constructor() {
        var self = this
        this.lock = null
        this.products = null
        this.navbarList = navbarList
        this.backdrop = observable(0)
        this.modalNavbar = observable()
        this.modalNavbarHeader = observable()
        this.modalNavbarSection = observableArray()
        this.modalNavbarSectionTitle = observable()
        this.modalBasket = observable()
        this.modalClose = computed(function () {

            if (!this.backdrop() && this.lock) {
                this.modalNavbar(false)
                this.modalBasket(false)
                this.lock = false

            }
            if (this.modalBasket() || this.modalNavbar()) {
                this.backdrop(true)
                this.lock = true
            }

        }, this);
    }
    openNavbarModal(data) {
        var arr = ProductsAPI.productsCash().filter((obj) => obj().id === data.path)
        arr = arr.length ? arr[0]().productsList : null;
        const modalNavbar = this.modalNavbar
        this.modalNavbarHeader(data)
        this.modalNavbarSection(arr)
        this.backdrop(true)
        modalNavbar(true)
    }

    getProductsAPI(obj) {
        var obj = obj
        this.modalNavbarSectionTitle(obj.title)
        ProductsAPI.getAll().then((products) => {
            OrderList.arrOfProducts = products.filter((item) => item.id === obj.path)[0].productsList
            OrderList.updateProductGalley();
        })
    }



}

const navbarList = [{
    title: 'Bébé',
    icon: 'icon-baby',
    path: 'baby'
},
{
    title: 'Hygiène et beauté',
    icon: 'icon-hygiene',
    path: 'hygiene'
},
{
    title: 'Entretien',
    icon: 'icon-maintenance',
    path: 'maintenance'
},
{
    title: 'Animaux',
    icon: 'icon-animals',
    path: 'animals'
},
{
    title: 'Boissons',
    icon: 'icon-drinks',
    path: 'drinks'
},
{
    title: 'Diététique et sans gluten',
    icon: 'icon-dietetic',
    path: 'dietetic'
},
{
    title: 'Epicerie',
    icon: 'icon-grocery-2',
    path: 'grocery'
},
{
    title: 'Petit Déjeuner',
    icon: 'icon-breakfast',
    path: 'breakfast'
},
{
    title: 'Produits laitiers',
    icon: 'icon-dairy',
    path: 'dairy'
},
{
    title: 'Charcuterie',
    icon: 'icon-delicatessen',
    path: 'delicatessen'
},
{
    title: 'Boulangerie',
    icon: 'icon-bakery',
    path: 'bakery'
},
{
    title: 'Le marché',
    icon: 'icon-market',
    path: 'market'
},
{
    title: 'Viandes',
    icon: 'icon-meat',
    path: 'meat'
}];

export default Modal;