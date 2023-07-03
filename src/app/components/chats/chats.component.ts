import { Component } from '@angular/core';
import { Chat } from 'src/app/models/chat.model';
import { Message } from 'src/app/models/message.mode';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.css']
})
export class ChatsComponent {
    private username: string;
    public message: string = "";
    public connectionId: string = "";
    public userId: string = "";
    public name: string = "";
    private messageRequest: Message = new Message();

    public chats: Chat[] = [];

    public constructor(public chatService: ChatService, private authService: AuthService) {
        this.username = authService.account!.username!;
    }

    ngOnInit() {
        this.chatService.startConnection();
        this.chatService.addChatListener();
        this.chatService.addChatListenerByName(this.authService.account?.username!);
    }

    isCurrentUserMessage(message: Message): boolean {
        return message.username === this.username;
    }

    public sendMessage(): void {
        this.messageRequest.username = this.username;
        this.messageRequest.message = this.message;
        this.messageRequest.time = new Date().toLocaleDateString();
        console.log(this.messageRequest);

        this.chatService.sendMessage(this.messageRequest);
        this.message = "";
    }

    public sendMessageByName(): void {
        console.log("BY NAME");
        this.messageRequest.username = this.username;
        this.messageRequest.message = this.message;
        this.messageRequest.time = new Date().toLocaleDateString();
        console.log(this.messageRequest);


        this.chatService.sendMessageByName(this.messageRequest, this.name);
        
        this.chatService.dataByName.push(this.messageRequest);
        this.message = "";
    }

    public sendMessageToConnectionId(): void {
        this.messageRequest.username = this.username;
        this.messageRequest.message = this.message;
        this.messageRequest.time = new Date().toLocaleDateString();
        console.log(this.messageRequest);

        this.chatService.sendMessageToConnectionId(this.messageRequest, this.connectionId);
        this.message = "";
    }


    public sendMessageToUserId(): void {
        this.messageRequest.username = this.username;
        this.messageRequest.message = this.message;
        this.messageRequest.time = new Date().toLocaleDateString();
        console.log(this.messageRequest);

        this.chatService.sendMessageToUser(this.messageRequest, this.userId);
        this.message = "";
    }
}
