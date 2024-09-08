import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {AuthService} from "./services/auth.services";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    const token = localStorage.getItem('access_token');
    console.log('Token:', token);
    // if(token !== null) {
    //   console.log('hello token')
    //   return true;
    // }
    if (this.authService.isAuthenticated()) {
      return true;
    }

    else {
      console.warn('User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
