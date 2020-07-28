import $ from 'jquery';
import ko, { observable, observableArray, computed } from 'knockout';
import * as ProductsAPI from './utils/ProductsAPI';


class UserAccount {
    constructor(folder) {
        this.folder = folder
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
    postData(form, b, c, d) {
        var self = this;
        var data = $(form).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        ProductsAPI.login(data).then((res) => {
            if (res.ok) {
                localStorage.setItem('token', res.json().access_token)
                self.folder('')
            } else {

            }
        })
    }

}
export default UserAccount;

