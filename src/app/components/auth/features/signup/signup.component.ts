import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.services";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  protected errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { fullname, email, password } = this.signupForm.value;
      this.authService.signup(fullname, email, password).subscribe({
        next: () => {
          this.errorMessage = null;
          this.router.navigate(['/chat']).then(r => r);
        },
        error: (err) => {
          if(err.code === 500) {
            this.errorMessage = 'cette adresse email est déjà utilisé !';
          } else {
            this.errorMessage = err.message;
          }
        },
      });
    }
  }
}
