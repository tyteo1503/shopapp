import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/enviroments/environments';
import { OrderDetail } from 'src/app/model/order.detail';
import { Product } from 'src/app/model/product';
import { OrderResponse } from 'src/app/responses/order/order.response';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss']
})
export class OrderConfirmComponent implements OnInit{
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: []
  };

  constructor(
    private orderSerive: OrderService
  ){}

  ngOnInit(): void {
    this.getOrderDetails();
  }
  getOrderDetails(): void{
    debugger
    const orderId: number = 10;
    this.orderSerive.DetailOrder(orderId).subscribe({
      next: (response: any) => {        
        debugger;       
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address; 
        this.orderResponse.note = response.note;
        // this.orderResponse.order_date = new Date(
        //   response.order_date[0], 
        //   response.order_date[1] - 1, 
        //   response.order_date[2]
        // );        
        
        this.orderResponse.order_details = response.order_details
          .map((order_detail: OrderDetail) => {
          order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
          return order_detail;
        });        
        this.orderResponse.payment_method = response.payment_method;
        // this.orderResponse.shipping_date = new Date(
        //   response.shipping_date[0], 
        //   response.shipping_date[1] - 1, 
        //   response.shipping_date[2]
        // );
        
        this.orderResponse.shipping_method = response.shipping_method;
        
        this.orderResponse.status = response.status;
        this.orderResponse.total_money = response.total_money;
      },
      complete: () => {
        debugger;        
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    })
  }
  

}
