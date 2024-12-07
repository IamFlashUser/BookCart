import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { RouterLink } from "@angular/router";
import { map } from "rxjs/operators";

import { MatButton } from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { Store } from "@ngrx/store";
import { LoginForm } from "src/app/models/loginForm";
import { UserLogin } from "src/app/models/userLogin";
import { login } from "src/app/state/actions/auth.actions";
import { selectLoginError } from "src/app/state/selectors/auth.selectors";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatButton,
    RouterLink,
    MatCardSubtitle,
    MatError,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    MatCardActions,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected loginForm: FormGroup<LoginForm> = this.formBuilder.group({
    username: this.formBuilder.control("", Validators.required),
    password: this.formBuilder.control("", Validators.required),
  });
  showPassword = false;

  error$ = this.store.select(selectLoginError).pipe(
    map((error) => {
      if (error?.includes("Unauthorized")) {
        this.loginForm.reset();
        this.loginForm.setErrors({ invalidCredentials: true });
      }
      return error;
    })
  );

  protected get loginFormControl() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.valid) {
      this.store.dispatch(
        login({
          loginCredentials: this.loginForm.value as UserLogin,
        })
      );
    }
  }

  // login() {
  //   if (this.loginForm.valid) {
  //     this.authenticationService
  //       .login(this.loginForm.value)
  //       .pipe(
  //         switchMap(() => {
  //           return this.cartService.setCart(
  //             this.authenticationService.oldUserId,
  //             this.userId
  //           );
  //         }),
  //         switchMap((cartItemcount) => {
  //           this.subscriptionService.cartItemcount$.next(cartItemcount);
  //           return this.wishlistService.getWishlistItems(this.userId);
  //         }),
  //         switchMap(() => this.route.queryParams),
  //         takeUntil(this.destroyed$)
  //       )
  //       .subscribe({
  //         next: (params) => {
  //           const returnUrl = params["returnUrl"] || "/";
  //           this.router.navigate([returnUrl]);
  //         },
  //         error: (error) => {
  //           console.error("Error occurred while login : ", error);
  //           this.loginForm.reset();
  //           this.loginForm.setErrors({
  //             invalidLogin: true,
  //           });
  //         },
  //       });
  //   }
  // }
}
