import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Jwt } from '../models/jwt.model';
import { LoginRequest } from '../models/loginRequest.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterRequest } from '../models/registerRequest.model';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url: string = "auth";
    public account?: Account;
    public isAuthenticated: boolean = false;
    public isAdmin: boolean = false;

    public constructor(private http: HttpClient) { }

    public login(loginRequest: LoginRequest): Observable<Jwt> {
        return this.http.post<Jwt>(`${environment.apiUrl}/${this.url}/login`, loginRequest);
    }

    public register(registerRequest: RegisterRequest): Observable<Jwt> {
        return this.http.post<Jwt>(`${environment.apiUrl}/${this.url}/register`, registerRequest);
    }

    public getAccountData(): Observable<Account> {
        return this.http.get<Account>(`${environment.apiUrl}/${this.url}/userData`, this.getOptions());
    }

    public validateAdmin(): Observable<any> {
        return this.http.get(`${environment.apiUrl}/${this.url}/adminProtected`, this.getOptions());
    }

    public confirmEmail(userId: string, token: string): Observable<any>{
		return this.http.get<any>(`${environment.apiUrl}/${this.url}/confirmEmail?userId=${userId}&token=${encodeURIComponent(token)}`);
	}

    public resetPassword(username: string): Observable<any>{
		return this.http.get<any>(`${environment.apiUrl}/${this.url}/resetPassword?username=${username}`);
	}

    public confirmResetPassword(userId: string, token: string, newPassword: string): Observable<any>{
		return this.http.get<any>(`${environment.apiUrl}/${this.url}/confirmResetPassword?userId=${userId}&token=${encodeURIComponent(token)}&newPassword=${newPassword}`);
	}

    public loginAsUser(jwt: Jwt): void {
        console.log("LOGIN AS USER");
        this.isAuthenticated = true;
        this.saveJwtToLocalStorage(jwt);
    }

    public loginAsAdmin(jwt: Jwt): void {
        this.isAuthenticated = true;
        this.isAdmin = true;
        this.saveJwtToLocalStorage(jwt);
    }

    public logout(): void {
        this.isAuthenticated = false;
		this.isAdmin = false;
        localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("refreshTokenExpired");
    }

    private saveJwtToLocalStorage(jwt: Jwt) {
        console.log("SAVE JWT");
        console.log(jwt);

        localStorage.setItem("token", jwt.token!);
        localStorage.setItem("refreshToken", jwt!.refreshToken!.token!);
        localStorage.setItem("refreshTokenExpired", jwt!.refreshToken!.expired!);
    }

    private getOptions() {
		return {
			headers: new HttpHeaders({
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			})
		}
	}
}
