import $ from 'jquery';
import ko, { observable, observableArray, computed } from 'knockout';
import * as ProductsAPI from './utils/ProductsAPI';



class UserAccount {
    constructor(folder, loader, modal) {
        this.folder = folder
        this.loader = loader
        this.modalRequestError = modal.modalRequestError
        this.modalRequestSuccess = modal.modalRequestSuccess
        this.isTrue = observable(true)
        this.isLogin = observable();
        this.accountLogin = observable();
        this.userEmail = observable();
        this.userPassword = observable();
        this.profile = observable({});
    }

    independentObservable() {
        return {
            observable: observable()
        };
    };

    signIn(form) {
        var self = this;
        var data = $(form).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        this.loader(true)
        ProductsAPI.login(data).then((res) => {
            if (res.ok) {
                res.json().then((response) => {
                    localStorage.setItem('token', response.access_token)
                    self.folder('')
                    self.loader(false)
                    self.isLogin(true)
                    self.profile(response.profile)
                    self.modalRequestSuccess('login success')
                })
            } else {
                self.loader(false)
                self.modalRequestError('email or password')
            }
        }).catch((error) => {
            self.modalRequestError('network')
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
                self.modalRequestSuccess('register success')
            } else {
                self.loader(false)
                self.modalRequestError('email exist')
            }
        }).catch((error) => {
            self.modalRequestError('network')
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
                self.modalRequestSuccess('update success')
            } else {
                self.modalRequestError(true)
            }
        }).catch((error) => {
            self.modalRequestError('network')
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
                self.modalRequestSuccess('update password success')
            } else {
                self.modalRequestError('password mismatched')
            }
        }).catch((error) => {
            self.modalRequestError('network')
            console.log(error)
        })
    }

}

export default UserAccount;

