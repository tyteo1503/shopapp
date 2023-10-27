import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../enviroments/environments';
import { UserResponse } from '../responses/user/user.response';
import { UpdatedUserDTO } from '../dtos/user/update.user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private registerApi = "http://localhost:8081/api/v1/users/register";
  private registerApi = `${environment.apiBaseUrl}/users/register`;
  // private loginApi = "http://localhost:8081/api/v1/users/login";
  private loginApi = `${environment.apiBaseUrl}/users/login`;
  private userDetailApi = `${environment.apiBaseUrl}/users/details`;
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


  register(registerDTO: RegisterDTO):Observable<any>{
    return this.http.post(this.registerApi,registerDTO,this.apiConfig)
  }
  login(loginDTO: LoginDTO):Observable<any>{
    return this.http.post(this.loginApi,loginDTO,this.apiConfig);
  }
  getUserDetail(token: String):Observable<any>{
    return this.http.post(this.userDetailApi,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  updateUserDetail(token: String, updatedUserDTO: UpdatedUserDTO) {
    debugger
    let userResponse = this.getUserResponseFromLocalStorage();
    return this.http.put(`${environment.apiBaseUrl}/users/details/${userResponse?.id}`,updatedUserDTO,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }
  saveUserResponseToLocalStorage(userResponse?: UserResponse){
    try{
      debugger
      if(userResponse == null || !userResponse){
        return;
      }
      // Chuyển đối tượng userResponse sang JSOn String
      const userResponseJSON = JSON.stringify(userResponse);
      // Lưu JSOn String vào LocalStorage với key (user)
      localStorage.setItem('user',userResponseJSON);

      console.log('User response saved to local storage');
    }catch(error){
      console.error('Error saving user resonse to local storage');
    }
  }
  getUserResponseFromLocalStorage(){
    try{
      const userResponseJSON = localStorage.getItem("user");
      if(userResponseJSON == null || userResponseJSON == undefined){
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved from local storage');
      return userResponse;
    }catch(error){
      console.error("Error retrieving User response from local storage")
      return null;
    }
  }
  removeUserFromLocalStorage(): void{
    try{
      localStorage.removeItem('user');
      console.log('User data removed from loacl storage');
    }catch(error){
      console.error('Error removing user data from local storage:', error);
    }
  }
}
