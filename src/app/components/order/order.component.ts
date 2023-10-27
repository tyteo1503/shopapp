import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderDTO } from 'src/app/dtos/user/order.dto';
import { environment } from 'src/app/enviroments/environments';
import { Product } from 'src/app/model/product';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit{
  orderForm: FormGroup; // Đối tượng Formgroup để quản lý dữ liệu của form
  cartItems: {product: Product, quantity: number}[] = [];
  couponCode: string = '';
  totalAmount: number = 0;

  orderData: OrderDTO = {
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    total_money: 0,
    payment_method: '',
    shipping_method: '',
    coupon_code: '',
    cart_items: []
  };
  constructor(
    private router: Router,
    private tokenSerive: TokenService,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder
  ){
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.fb.group({
      fullname: ['',Validators.required], // fullname là FormControl bắt  buộc
      email: ['', [Validators.email]], // Sử dụng validators.email để kiểm tra định dạng cảu email
      phone_number: ['',[Validators.required, Validators.minLength(6)]],
      address: ['',[Validators.required,Validators.minLength(5)]],
      note: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }
  // Phase 1: truy cập trang này sẽ thực hiện lấy danh sản phẩm được đặt hàng
  ngOnInit(): void {
    debugger
    //this.cartService.clearCart();
    this.orderData.user_id = this.tokenSerive.getUserId();
     // Lấy danh sách sản phẩm từ giỏ hàng
     const cart = this.cartService.getCard();
     // Chuyển danh sách Id từ Map giở hàng
     const productIds = Array.from(cart.keys());
     if(productIds.length === 0){
      return;
     }
     // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
     debugger
     this.productService.getproductsbyIds(productIds).subscribe({
       next: (products: Product[]) =>{
         debugger
         // lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
         this.cartItems = productIds.map((productId) =>{
           debugger
           const product = products.find((p) => p.id === productId);
           if(product){
             product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
           }
           return{
             product: product!,
             quantity: cart.get(productId)!
           };
         });
         console.log('haha')
       },
       complete:() => {
         debugger;
         this.calculateTotal()
       },
       error: (error: any) => {
         debugger
         console.error("Error fatching detail:",error);
       }
     })
  }
  // Phase 2: Thực hiện thanh toán
  placeOrder() {
    if(this.orderForm.valid){
      
      // Gán giá trị từ form vào đối tượng orderData
      this.orderData.fullname = this.orderForm.get('fullname')!.value;
      this.orderData.email = this.orderForm.get('email')!.value;
      this.orderData.phone_number = this.orderForm.get('phone_number')!.value;
      this.orderData.address = this.orderForm.get('address')!.value;
      this.orderData.note = this.orderForm.get('note')!.value;
      this.orderData.shipping_method = this.orderForm.get('shipping_method')!.value;
      this.orderData.payment_method = this.orderForm.get('payment_method')!.value;

      this.orderData.cart_items = this.cartItems.map(cartItem =>({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      this.orderData.total_money = this.totalAmount;
      // Dữ liệu hợp lệ bạn có thể gửi đơn hàng đi
      this.orderService.palaceOrder(this.orderData).subscribe({
        next: (response) => {
          debugger;
          alert('Đặt hàng thành công');
          this.cartService.clearCart();
          this.router.navigate(["/"])
        },
        complete: () => {
          debugger;
          this.calculateTotal()
        },
        error(err) {
          debugger
          console.error('Lỗi khi đặt hàng:', err);
        },
      });
    }else{
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert('Dữ liệu không hợp lệ. vui lòng kiểm tra lại')
    }
  }
  calculateTotal(): void{
    this.totalAmount = this.cartItems.reduce((total, item) => total + item.product.price*item.quantity,0);
  }

}
