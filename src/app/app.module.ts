import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AccountComponent } from './components/account/account.component';
import { HeaderComponent } from './components/header/header.component';
import { ChatsComponent } from './components/chats/chats.component';

const angularMaterialModules: any[] = [MatIconModule, MatButtonModule, MatDividerModule, MatInputModule, MatCardModule, MatButtonToggleModule, MatToolbarModule]

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        AccountComponent,
        HeaderComponent,
        ChatsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        NgChartsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        angularMaterialModules,
        ReactiveFormsModule,
    ],
    exports: [angularMaterialModules],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
