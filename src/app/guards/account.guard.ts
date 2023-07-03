import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AccountGuard {
    public constructor(private router: Router, private authService: AuthService) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isAuthenticated) {
            if (this.authService.isAdmin) {
                this.router.navigateByUrl("/admin/main");

                return true;
            }

            return true;
        }
        this.router.navigateByUrl("/login");

        return false;
    }
}