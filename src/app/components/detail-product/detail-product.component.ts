import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/app/enviroments/environments';
import { Product } from 'src/app/model/product';
import { ProductImage } from 'src/app/model/product.image';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit{
  // Khai báo dấu "?" đại diện cho kiểu optional type (giá trị trả về có thể null hoặc undefined)
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
    ){}

  ngOnInit(): void {
    debugger
    const idParam = this.route.snapshot.params['id'];
    if(idParam !== null){
      // Chuyển string sáng số. Vd: "123" -> 123
      this.productId = +idParam;
    }
    if(!isNaN(this.productId)){
      this.productService.getOrderDetails(this.productId).subscribe({
        next: (response: any) => {
          debugger
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          if(response.product_images && response.product_images.length > 0){
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }
          debugger
          this.product = response
          //Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => {
          debugger;
        },
        error(err: any) {
          debugger
          console.error('Error fetching detail:', err);
        },
      });
    }else{
      console.error('Invalid productId:',idParam);
    }
  }
  showImage(index: number): void {
    debugger
    if(this.product && this.product.product_images && 
        this.product.product_images.length > 0){
      if(index < 0){
        index = 0;
      }else if(index >= this.product.product_images.length){
        index = this.product.product_images.length - 1;
      }

      // Gán index hiển thị và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  thumnailClick(index: number){
    debugger
    // Gọi khi một thmbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentUmageIndex
  }
  nextImage(): void{
    debugger
    this.showImage(this.currentImageIndex+1);
  }
  priviousImage(): void{
    debugger
    this.showImage(this.currentImageIndex-1);
  }
  addToCart(): void{
    if(this.product){
      this.cartService.addToCart(this.product.id,this.quantity)
    }else{
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }
  increaseQuantity(): void{
    this.quantity++;
  }

  decreaseQuantity(): void{
    if(this.quantity > 1){
      this.quantity--;
    }
  }


}
