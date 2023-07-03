import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AccountComponent } from './components/account/account.component';
import { LoginGuard } from './guards/login.guard';
import { AccountGuard } from './guards/account.guard';
import { ChatsComponent } from './components/chats/chats.component';
import { ChatsGuard } from './guards/chats.guard';

const routes: Routes = [
    { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
    { path: "login/:userId/:token", component: LoginComponent, canActivate: [LoginGuard] },
    { path: "login/confirmEmail/:userId/:token", component: LoginComponent, canActivate: [LoginGuard] },
    { path: "login/resetPassword/:userId/:token", component: LoginComponent, canActivate: [LoginGuard] },
    { path: "account", component: AccountComponent, canActivate: [AccountGuard] },
    { path: "chats", component: ChatsComponent, canActivate: [ChatsGuard] },
    { path: "**", component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [LoginGuard, AccountGuard, ChatsGuard]
})
export class AppRoutingModule { }
