import $ from 'jquery';
import ko, { observable, observableArray, computed } from 'knockout';
import * as ProductsAPI from './utils/ProductsAPI';


class UserAccount {
    constructor() {
        this.isLogin = observable();
        this.accountLogin = observable();
        this.userEmail = observable();
        this.userPassword = observable();
        this.formValid = observable();
    }
    isValid(formId, data, event) {
        const isValid = $(formId).parsley().isValid()
        this.formValid(isValid)
    }
    postData(form) {
        var data = $(form).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        ProductsAPI.login(data)
    }

}

window.userAccount = new UserAccount()
export default userAccount;

