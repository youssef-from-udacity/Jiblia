import ko, { observable, observableArray, computed } from 'knockout';
import * as ProductsAPI from './utils/ProductsAPI';
import OrderList from './shopingCart';



class Modal {
    constructor(folder, loader) {
        this.folder = folder
        this.loader = loader
        this.products = null
        this.navbarList = navbarList
        this.backdrop = observable(0)
        this.backdrop2 = observable(0)
        this.lock = null
        this.lock2 = null
        this.modalNavbar = observable()
        this.modalNavbarHeader = observable()
        this.modalNavbarSection = observableArray()
        this.modalNavbarSectionTitle = observable()
        this.modalBasket = observable()
        this.modalAccount = observable()
        this.modalResponse = observable()
        this.modalResponse2 = observable()
        this.modalLikes = observable()
        this.modalZone = observable()
        this.modalClose = computed(function () {

            if (!this.backdrop() && this.lock) {
                this.loader(false)
                this.modalNavbar(false)
                this.modalBasket(false)
                this.modalZone(false)
                this.modalLikes(false)
                this.modalAccount(false)
                this.modalResponse(false)
                this.lock = false
            }
            if (this.modalBasket() || this.modalNavbar() || this.modalAccount()
                || this.modalResponse() || this.modalZone() || this.modalLikes()) {
                this.backdrop(true)
                this.lock = true
            }

        }, this);

        this.modalClose2 = computed(function () {
            if (!this.backdrop2() && this.lock2) {
                this.modalResponse2(false)
                this.lock2 = false
            }
            if (this.modalResponse2()) {
                this.backdrop2(true)
                this.lock2 = true
            }
        }, this)
    }
    openModalAccount() {
        this.modalAccount(true)
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

        ProductsAPI.getAll('products').then((res) => {
            if (res.ok) {
                res.json().then(data => data).then((products) => {
                    const category = products.filter((item) => item.id === obj.target)[0]
                    this.folder('categorie-produit/' + obj.path)
                    OrderList.arrOfProducts = category.productsList
                    OrderList.updateProductGallery();
                })
            } else {
                self.modalResponse('error network')
            }

        }).catch((error) => {
            self.modalResponse('error network')
            console.log(error)
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