import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChatService} from "./services/chat.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../auth/services/auth.services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  searchText: string = '';
  contactedUsers: any[] = [];
  selectedUser: any = null;
  messageText: string = '';
  messageHistory: any[] = [];

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.chatService.getContactedUsers().subscribe(users => {
      this.contactedUsers = users;
    });
  }

  searchUser(): void {
    if (this.searchText.trim()) {
      this.chatService.searchUser(this.searchText).subscribe(user => {
        if (user) {
          this.selectedUser = user;
          this.messageHistory = [];
        } else {
          console.log('Utilisateur non trouvé');
        }
      });
    }
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.chatService.getMessageHistory(user.id).subscribe(messages => {
      this.messageHistory = messages;
    });
  }

  sendMessage(): void {
    if (this.selectedUser && this.messageText.trim()) {
      this.chatService.sendMessage(this.selectedUser.id, this.messageText).subscribe(() => {
        this.messageHistory.push({ fromId: 'me', message: this.messageText });
        this.messageText = '';
      });
    }
  }

  logout(): void {
    this.authService.logout();  // Appel au service d'authentification pour déconnexion
    this.router.navigate(['/login']);  // Redirection vers la page de login
  }
}
