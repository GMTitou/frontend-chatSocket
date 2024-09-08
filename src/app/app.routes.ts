import { Routes } from '@angular/router';
import {LoginComponent} from "./components/auth/features/login/login.component";
import {SignupComponent} from "./components/auth/features/signup/signup.component";
import {ChatComponent} from "./components/chat/chat.component";
import {AuthGuard} from "./components/auth/auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
  }
];
