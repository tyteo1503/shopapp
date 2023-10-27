import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";

@Injectable({
    providedIn: "root"
})
export class CartService{
    // Dùng kiểu map để lưu trữ thông tin giỏ hàng
    // Vd: "1" : "5" -> Sản phẩm có id = 1 - số lượng 5
    private cart: Map<number,number> = new Map();

    constructor(private productService: ProductService){
        // Lấy dữ liệu từ giỏ hàng từ localStorage khi khởi động service này
        const storedCart = localStorage.getItem('cart');
        if(storedCart){
            // Lưu thông tin của giõ hàng vào trong đối tượng cart
            this.cart = new Map(JSON.parse(storedCart));
        }
    }

    addToCart(productId: number, quatity: number = 1): void{
        debugger
        // Nếu sản phẩm đã tồn tại trong giỏ hàng thì chỉ tăng số lượng
        if(this.cart.has(productId)){
            // Kiểu giá trị Map sẽ ghi đè nếu cặp gái trị key-value đc thêm mới tring với key đã tồn tạo trong Map
            this.cart.set(productId,this.cart.get(productId)!+quatity)
        }else{
            this.cart.set(productId,quatity)
        }
        // Sau khi thay đổi giỏ hàng, lưu trữ nó vào localstorage
        this.saveCardToLocalStorage();
    }

    getCard(): Map<number,number>{
        return this.cart;
    }
    // Lưu thông tin cart vào LocalStorage
    saveCardToLocalStorage(): void{
        debugger
        localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
    }
    clearCart(): void{
        this.cart.clear();
        this.saveCardToLocalStorage();
    }
}