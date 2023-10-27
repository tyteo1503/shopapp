import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { TokenService} from '../../service/token.service';
import { LoginResponse } from '../../responses/user/login.response';
import { RoleService } from 'src/app/service/role.service';
import { Role } from 'src/app/model/role';
import { UserResponse } from 'src/app/responses/user/user.response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  @ViewChild('loginForm') loginForm!: NgForm
  phoneNumber: string;
  password: string;
  remember: boolean;
  roles: Role[];
  selectedRole: Role | undefined;
  userResponse? : UserResponse;

  constructor(
    private router:Router, 
    private userService:UserService,
    private tokenService:TokenService,
    private roleService:RoleService
    ){
      this.phoneNumber = '33445566';
      this.password = '123456';
      this.remember = true;
      this.roles = [];
    }
  ngOnInit(){
    // Gọi API lấy danh sách roles và lưu và biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) =>{
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0]: undefined;
      },
      error: (error: any) =>{
        debugger
        console.error(`Error getting roles:`,error);
      }
    });
  }
  login(){
    debugger
    const loginDTO:LoginDTO = {
      "phone_number": this.phoneNumber,
      "password": this.password,
      "role_id": this.selectedRole!.id
    }
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger
        if(this.remember){
          const token = response.token
          debugger
          this.tokenService.setToken(token);
          debugger
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) =>{
              debugger
              this.userResponse = {
                ...response, // spread response
                date_of_birth: new Date(response.date_of_birth)
              }
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
              this.router.navigate(['/']); // Chuyển qua màn hình home
            },
            complete: () =>{
              debugger
            },
            error: (error: any) =>{
              debugger
              alert(error.error.message)
            }     
          })
        }   
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        //Xử lý lỗi nếu có
        alert(`Cannot login, error: ${error.error}`)
      }
    });
  }
}
