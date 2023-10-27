import { Injectable } from "@angular/core";
import { environment } from "../enviroments/environments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../model/category";

@Injectable({
    providedIn: 'root'
})
export class CategoryService{
    private apiGetCategries = `${environment.apiBaseUrl}/categories`;

    constructor(private http:HttpClient){}

    getAllCategories(): Observable<Category[]>{
        return this.http.get<Category[]>(this.apiGetCategries);
    }

}