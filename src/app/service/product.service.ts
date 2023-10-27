import { Injectable } from "@angular/core";
import { environment } from "../enviroments/environments";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../model/product";

@Injectable({
    providedIn: 'root'
})
export class ProductService{
    private apiGetProducts = `${environment.apiBaseUrl}/products`;

    constructor(private http: HttpClient) {}

    getProducts(keyword: string, selectedCategoryId: number ,page: number, limit: number): Observable<Product[]>{
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString())
            .set('keyword',keyword.toString())
            .set('category_id',selectedCategoryId.toString())
        return this.http.get<Product[]>(this.apiGetProducts, { params });
    }
    getOrderDetails(orderId: number):Observable<Product>{
        const apiGetOrderDetail = `${environment.apiBaseUrl}/products/${orderId}`;
        return this.http.get<Product>(apiGetOrderDetail);
    }
    getproductsbyIds(productIds: number[]):Observable<Product[]>{
        const params = new HttpParams()
            .set('ids',productIds.join(','));
        return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, {params});
    }
}