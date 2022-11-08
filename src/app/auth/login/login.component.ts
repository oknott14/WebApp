import { Component } from '@angular/core'
import { AuthService } from '../auth.service';
//import { Time } from '@angular/common'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading = false;
    time: string = ""
    offset: any;
    constructor(private authService: AuthService){}

    login(form: any) {
        //if (form.invalid)
        //    return
        this.authService.login(form.value.email, form.value.password);
    }
}