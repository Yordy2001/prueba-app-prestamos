import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './login.service';
import { User } from './interfaces/user.interface';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup = new FormGroup({});
  loginError: boolean = false;

  constructor(
    private loginService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  Login() {
    if (!this.loginFormGroup.valid) {
      this.loginFormGroup.markAllAsTouched();
      console.log(this.loginFormGroup.value);
    }

    this.loginService.login(this.loginFormGroup.value.email, this.loginFormGroup.value.password).subscribe({
      next: (user: User) => {
        console.log(user);

        this.loginError = false;
      },
      error: (error: any) => {
        console.error(error);
        this.loginError = true;
      }
    })

  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.loginFormGroup.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}
