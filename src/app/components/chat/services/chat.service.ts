import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3001/';

  constructor(private http: HttpClient) {}

  searchUser(fullname: string): Observable<any> {
    return this.http.get(`${this.apiUrl}users/search?fullname=${fullname}`);
  }

  getContactedUsers(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}messages/contacts`, { headers });
  }

  getMessageHistory(toID: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}messages/history/${toID}`, { headers });
  }

  sendMessage(toID: number, message: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}messages/sendMessage`, { to: toID, message }, { headers });
  }
}
