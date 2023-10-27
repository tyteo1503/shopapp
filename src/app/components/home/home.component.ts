import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/enviroments/environments';
import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  products: Product[] = [];
  categories: Category[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  selectedCategoryId: number = 0;


  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategories()
    this.getProducts(this.keyword,this.selectedCategoryId,this.currentPage,this.itemsPerPage)
  }
  getCategories(){
    debugger
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching categories:',error);
      }
    });
  }
  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    debugger
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  getProducts(keyword: string ,selectedCategoryId: number, page: number, limit: number){
    debugger
    this.productService.getProducts(keyword,selectedCategoryId,page,limit).subscribe({
      next: (response: any) => {
        debugger
        response.products.forEach((product: Product) => {
          //Show ảnh
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:',error);
      }
    });
  }
  onPageChange(page: number){
    debugger
    this.currentPage = page;
    this.getProducts(this.keyword,this.selectedCategoryId,this.currentPage,this.itemsPerPage);
  }
  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblepages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblepages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if(endPage - startPage + 1 < maxVisiblePages){
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
  // onProductClick(productId: number){
  //   debugger
  //   this.router.navigate(["/products", productId])
  // }
}
