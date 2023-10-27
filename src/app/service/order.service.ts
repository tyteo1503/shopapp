import { Injectable } from "@angular/core";
import { OrderDTO } from "../dtos/user/order.dto";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../enviroments/environments";

@Injectable({
    providedIn: "root"
})
export class OrderService{
    private apiCreateOrder = `${environment.apiBaseUrl}/orders`;
    private apiConfig = {
        headers : this.createHeaders()
      }
    constructor(private http: HttpClient) { }
    private createHeaders(): HttpHeaders{
        return new HttpHeaders({
          'Content-Type':'application/json',
          'Accept-Language':'vi'
        });
      }
    palaceOrder(orderDTO: OrderDTO):Observable<any>{
        return this.http.post(this.apiCreateOrder,orderDTO,this.apiConfig)
    }
    DetailOrder(orderId: number): Observable<any>{
      return this.http.get<any>(`${environment.apiBaseUrl}/orders/${orderId}`);
    }
}