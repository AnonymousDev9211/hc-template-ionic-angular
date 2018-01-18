import { Component } from '@angular/core';
import { IonicPage, NavController, Loading } from 'ionic-angular';
import { LoginModel } from "../../models/login.model";
import { WidgetUtils } from "../../shared/widget.util";

import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HcService} from "hc-lib/hc.service";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  companyLogo: string;

  constructor(private navCtrl: NavController, private dialog: WidgetUtils, public hcService: HcService) {
    this.companyLogo =  '../../assets/imgs/hc.png';
  }

  getAuthToken(username, password){
    if(localStorage.getItem('baseUrl') == null) {
      this.dialog.showToast('Please Enter Tenant URL before logging in');
    }
    else {
      this.dialog.showLoading('Logging In...');
      this.hcService.doLogin(localStorage.getItem('baseUrl'), username, password)
        .subscribe((data: HttpResponse<LoginModel>) => {
            if (data.status != 200) {
              this.dialog.hideLoading();
              this.dialog.showToast(data);
            }
            else{
              localStorage.setItem('token', data.body.token);
              this.dialog.hideLoading();
              this.navCtrl.setRoot('HomePage', {data: data.body});
            }
            },
            (err: HttpErrorResponse) => {
                this.dialog.hideLoading();
              this.dialog.showToast(err.error._ERROR_MESSAGE_);
              console.log(err);
            }
        );
    }
  }

  showPrompt() {
    this.dialog.showPrompt();
  }

}
