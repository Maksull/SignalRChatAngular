import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent {


    public constructor(private authService: AuthService, private router: Router){

    }

    public get account(): Account {
        return this.authService.account!;
    }

    public logout(): void {
        this.authService.logout();
        this.router.navigateByUrl("/login");
    }
}
