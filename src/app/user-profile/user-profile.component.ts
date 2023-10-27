import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { TokenService } from '../service/token.service';
import { UserResponse } from '../responses/user/user.response';
import { UpdatedUserDTO } from '../dtos/user/update.user.dto';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit{
  userResponse?: UserResponse;
  userProfileForm: FormGroup;
  token: String = '';
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService
  ){
    this.userProfileForm = this.formBuilder.group({
      full_name: [''],
      address: ['',[Validators.minLength(3)]],
      phone_number: ['',Validators.minLength(6)],
      password: ['',[Validators.minLength(3)]],
      retype_password: ['',[Validators.minLength(3)]],
      date_of_birth: [Date.now()]
    },{
      Validators: this.passwordMatchValidator
    });
  }
  ngOnInit(): void {
    debugger
    this.token = this.tokenService.getToken() ?? '';
    this.userService.getUserDetail(this.token).subscribe({
      next:(response: any) =>{
        debugger
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth),
        };
        // Đổ dữ liệu từ response sang màn hình form
        this.userProfileForm.patchValue({
          full_name: this.userResponse?.fullname ?? '',
          address: this.userResponse?.address ?? '',
          date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0,10)
        })
        this.userService.saveUserResponseToLocalStorage(this.userResponse);
      },
      complete: () =>{
        debugger;
      },
      error: (error: any) =>{
        debugger
        alert(error.error.message);
      }
    })
  }
  passwordMatchValidator(): ValidatorFn{
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retypePassword =formGroup.get('retype_password')?.value;
      if(password !== retypePassword){
        return {passwordMismatch: true};
      } 
      return null;
    };
  }
  save(): void{
    debugger
    if(this.userProfileForm.valid){
      const updatedUserDTO: UpdatedUserDTO = {
        full_name: this.userProfileForm.get('full_name')?.value,
        address: this.userProfileForm.get('address')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value
      };
      this.userService.updateUserDetail(this.token,updatedUserDTO).subscribe({
        next:(response:any)=>{
          debugger
          this.userService.removeUserFromLocalStorage();
          this.tokenService.removeToken();
          this.router.navigate(['/login']);
        },
        complete:()=>{
          debugger
        },
        error:(error:any)=>{
          debugger
          alert(error.error.message)
        }
      })
    }else{
      if(this.userProfileForm.hasError('passwordMismatch')){
        alert('Mật khẩu và mật khẩu nhập lại chưa chính xác');
      }
    }
  }
}
