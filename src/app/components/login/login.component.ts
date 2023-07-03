import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/models/account.model';
import { Jwt } from 'src/app/models/jwt.model';
import { LoginRequest } from 'src/app/models/loginRequest.model';
import { RegisterRequest } from 'src/app/models/registerRequest.model';
import { AuthService } from 'src/app/services/auth.service';
import { compareTwoValidator } from 'src/app/validators/compareTwo.validator';
import { emailValidator } from 'src/app/validators/email.validator';
import { phoneNumberValidator } from 'src/app/validators/phoneNumber.validator';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    public isLoginRegister: boolean = false;
    public isLogin: boolean = false;
    public isRegister: boolean = false;
    public isSubmitted: boolean = false;
    public isRegisted: boolean = false;
    public isResetPassword: boolean = false;
    public isResetPasswordSent: boolean = false;
    public isConfirmResetPassword: boolean = false;
    public isPasswordChanged: boolean = false;
    public isConfirmEmail: boolean = false;
    public isEmailConfirmed: boolean = false;

    public hide: boolean = true;
    public errors: string[] = [];

    public loginForm?: FormGroup;
    public registerForm?: FormGroup;
    public resetPasswordForm?: FormGroup;
    public confirmResetPasswordForm?: FormGroup;

    public constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
        let isConfirmResetPassword: boolean = this.router.url.includes("resetPassword");
        let isConfirmEmail: boolean = this.router.url.includes("confirmEmail");

        let userId: string = this.activatedRoute.snapshot.params["userId"];
        let token: string = this.activatedRoute.snapshot.params["token"];

        console.log(isConfirmEmail);
        console.log(isConfirmResetPassword);


        if (userId != undefined && token != undefined) {
            if (isConfirmResetPassword) {
                this.confirmResetPassword();
            } else if (isConfirmEmail) {
                this.confirmEmail(userId, token);
            }
        } else {
            this.loginRegister();
        }
    }

    public confirmResetPassword(): void {
        this.confirmResetPasswordForm = this.generateConfirmResetPasswordForm();

        this.isConfirmResetPassword = true;
    }

    public confirmEmail(userId: string, token: string): void {
        this.isConfirmEmail = true;

        this.authService.confirmEmail(userId, token)
            .subscribe({
                next: () => {
                    this.isEmailConfirmed = true;
                },
                error: (err: HttpErrorResponse) => {
                    this.addErrors(err);
                }
            });
    }

    public loginRegister(): void {
        this.isLoginRegister = true;
        this.isLogin = true;
        this.isRegister = false;

        this.loginForm = this.generateLoginForm();
        this.registerForm = this.generateRegisterForm();
    }

    public toggleLogin(): void {
        this.isLogin = true;
        this.isRegister = false;
        this.errors = [];
    }
    public toggleRegister(): void {
        this.isLogin = false;
        this.isRegister = true;
        this.errors = [];
    }

    public resetPassword(): void {
        this.resetPasswordForm = this.generateResetPasswordForm();

        this.errors = [];
        this.isResetPassword = true;
        this.isLoginRegister = false;
    }

    public submit(): void {
        this.isSubmitted = true;
        if (this.isLoginRegister) {
            if (this.isLogin && this.loginForm?.valid) {
                let loginRequest = new LoginRequest();
                loginRequest = this.loginForm.value;
                console.log(loginRequest);

                this.submitLogin(loginRequest);
            }
            else if (this.isRegister && this.registerForm?.valid) {
                let registerRequest = new RegisterRequest();
                registerRequest = this.registerForm.value;
                registerRequest.phoneNumber = "+38" + registerRequest.phoneNumber;
                console.log(registerRequest);

                this.submitRegister(registerRequest);
            }
        } else if (this.isResetPassword) {
            if (this.resetPasswordForm?.valid) {
                let username: string = this.resetPasswordForm.get("username")!.value;

                this.submitResetPassword(username);
            }
        } else if (this.isConfirmResetPassword) {
            if (this.confirmResetPasswordForm?.valid) {
                let userId: string = this.activatedRoute.snapshot.params["userId"];
                let token: string = this.activatedRoute.snapshot.params["token"];
                let newPassword: string = this.confirmResetPasswordForm.get("newPassword")!.value;

                this.submitConfirmResetPassword(userId, token, newPassword);
            }
        }
    }

    public toLoginRegister(): void {
        this.loginRegister();

        this.isResetPassword = false;
    }

    private submitLogin(loginRequest: LoginRequest): void {
        this.authService.login(loginRequest)
            .subscribe({
                next: (res: Jwt) => {
                    let isAdmin: boolean = false;

                    this.authService.validateAdmin()
                        .subscribe({
                            next: () => {
                                isAdmin = true;
                            },
                            error: () => {
                                this.authService.isAdmin = false;
                            }
                        });

                    if (isAdmin) {
                        this.authService.loginAsAdmin(res);
                    } else {
                        this.authService.loginAsUser(res);
                    }


                    this.authService.getAccountData()
                        .subscribe({
                            next: (account: Account) => {
                                console.log("GETACCOUNTDATA");
                                console.log(account);
                                this.authService.account = account;
                            },
                            error: () => {
                                this.authService.logout();
                            }
                        });

                    this.router.navigateByUrl("/account");
                },
                error: (err: HttpErrorResponse) => {
                    this.addErrors(err);
                    if (this.errors.length === 0) {
                        this.errors.push("Invalid credentials");
                    }
                }
            });;
    }

    private submitRegister(registerRequest: RegisterRequest): void {
        this.authService.register(registerRequest)
            .subscribe({
                next: () => {
                    this.isRegisted = true;
                },
                error: (err: HttpErrorResponse) => {
                    this.addErrors(err);
                }
            });
    }

    public registed(): void {
        this.isRegisted = false;
        this.isRegister = false;
        this.isLogin = true;
        this.hide = true;
        this.errors = [];

        this.registerForm = this.generateRegisterForm();
    }

    private submitResetPassword(username: string): void {
        this.isResetPasswordSent = true;

        this.authService.resetPassword(username)
            .subscribe({
                next: () => {
                    this.isResetPasswordSent = true;
                },
                error: (err: HttpErrorResponse) => {
                    this.isResetPasswordSent = false;
                    this.addErrors(err);
                }
            });
    }

    private submitConfirmResetPassword(userId: string, token: string, newPassword: string): void {
        this.authService.confirmResetPassword(userId, token, newPassword)
            .subscribe({
                next: () => {
                    this.isPasswordChanged = true;
                },
                error: (err: HttpErrorResponse) => {
                    this.isPasswordChanged = false;
                    this.addErrors(err);
                }
            });
    }

    private addErrors(err: HttpErrorResponse): void {
        this.errors = [];
        if (err.error != null) {
            for (let key in err.error.errors) {
                console.log(err.error)
                this.errors.push(err.error.errors[key]);
            }
        }
    }


    //#region Generate forms
    private generateLoginForm(): FormGroup {
        return this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }
    private generateRegisterForm(): FormGroup {
        return this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, emailValidator]],
            phoneNumber: ['', [Validators.required, phoneNumberValidator]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        }, {
            validators: Validators.compose([
                compareTwoValidator('password', 'confirmPassword')
            ])
        });
    }
    private generateResetPasswordForm(): FormGroup {
        return this.formBuilder.group({
            username: ['', Validators.required],
        });
    }
    private generateConfirmResetPasswordForm() {
        return this.formBuilder.group({
            newPassword: ['', Validators.required],
            confirmNewPassword: ['', Validators.required],
        }, {
            validators: Validators.compose([
                compareTwoValidator('newPassword', 'confirmNewPassword')
            ])
        });
    }
    //#endregion

    //#region loginForm gets
    public get loginUsername(): AbstractControl {
        return this.loginForm?.get('username')!;
    }
    public get loginPassword(): AbstractControl {
        return this.loginForm?.get('password')!;
    }
    //#endregion
    //#region registerForm gets
    public get registerFirstName(): AbstractControl {
        return this.registerForm?.get('firstName')!;
    }
    public get registerLastName(): AbstractControl {
        return this.registerForm?.get('lastName')!;
    }
    public get registerUsername(): AbstractControl {
        return this.registerForm?.get('username')!;
    }
    public get registerEmail(): AbstractControl {
        return this.registerForm?.get('email')!;
    }
    public get registerPhoneNumber(): AbstractControl {
        return this.registerForm?.get('phoneNumber')!;
    }
    public get registerPassword(): AbstractControl {
        return this.registerForm?.get('password')!;
    }
    public get registerConfirmPassword(): AbstractControl {
        return this.registerForm?.get('confirmPassword')!;
    }
    //#endregion
    //#region resetPasswordForm gets
    public get resetPasswordUsername(): AbstractControl {
        return this.resetPasswordForm?.get('username')!;
    }
    //#endregion
    //#region confirmResetPasswordForm gets
    public get newPassword(): AbstractControl {
        return this.confirmResetPasswordForm?.get('newPassword')!;
    }
    public get confirmNewPassword(): AbstractControl {
        return this.confirmResetPasswordForm?.get('confirmNewPassword')!;
    }
    //#endregion
}
