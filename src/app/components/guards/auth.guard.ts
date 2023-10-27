import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { TokenService } from "src/app/service/token.service";

@Injectable({
    providedIn:'root'
})
export class AuthGuard {
    constructor(private tokenSerive: TokenService,private router:Router){}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        const isTokenExprired = this.tokenSerive.isTokenExpired();
        const isUserIdValid = this.tokenSerive.getUserId() > 0;
        debugger
        if(!isTokenExprired && isUserIdValid){
            return true;
        }else{
            // Nếu không authenticated, bạn có thể redirect hoặc trả về một UrlTree khác.
            // Ví dụ trả về trang login:
            this.router.navigate(['/login']);
            return false;
        }
    }
}
    // Sử dụng functional guard như sau:
export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean =>{
    debugger
    return inject(AuthGuard).canActivate(next,state);
}