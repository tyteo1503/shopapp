import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root',
})
export class TokenService{
    private readonly TOKEN_KEY = 'access_token';
    // Giúp cung cấp các hàm để xử lý token
    private jwtHelper = new JwtHelperService();
    constructor(){}
    //getter/setter
    getToken():string | null{
        return localStorage.getItem(this.TOKEN_KEY);
    }
    setToken(token: string): void{
        localStorage.setItem(this.TOKEN_KEY, token);
    }
    removeToken(): void{
        localStorage.removeItem(this.TOKEN_KEY);
    }
    getUserId(): number{
        //toán tử ?? sẽ chuyển nó thành một chuỗi rỗng ('') nếu kết quả cho ra là null hoặc undefined
        let userObject = this.jwtHelper.decodeToken(this.getToken() ?? '');
        return 'userId' in userObject ? parseInt(userObject['userId']): 0;
    }
    isTokenExpired(): boolean{
        if(this.getToken() == null){
            return false;
        }
        return this.jwtHelper.isTokenExpired(this.getToken());
    }
}