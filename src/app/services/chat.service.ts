import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, IHttpConnectionOptions, LogLevel } from '@microsoft/signalr';
import { Message } from '../models/message.mode';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private hubConnection!: HubConnection;
    private connectionId?: string | null;
    public data: Message[] = [];
    public dataByName: Message[] = [];


    public constructor() { }

    public startConnection(): void {
        const options: IHttpConnectionOptions = {
            accessTokenFactory: () => {
              return localStorage.getItem("token")!;
            }
          };

        this.hubConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:44323/chathub', options)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('Connection started'))
            .then(() => { this.connectionId = this.hubConnection.connectionId; console.log(this.connectionId) })
            .catch(err => console.log('Error while starting connection: ' + err));

        this.hubConnection.onreconnected(() => {
            console.log('Connection reestablished');
        })
    }

    public addChatListenerByName(name: string): void {
        this.hubConnection.on(name, (message: Message) => {
            console.log(message);
            this.dataByName.push(message);
        });

        console.log("CONNECTION ID");
        console.log(this.hubConnection.connectionId);
    }

    public addChatListener(): void {
        this.hubConnection.on('ReceiveMessage', (message: Message) => {
            this.data.push(message);
        });

        console.log("CONNECTION ID");
        console.log(this.hubConnection.connectionId);
    }

    public sendMessage(message: Message): void {
        this.hubConnection.invoke('SendMessage', message);
    }

    public sendMessageByName(message: Message, username: string): void {
        this.hubConnection.invoke("SendMessageByName", message, username);
    }

    public sendMessageToConnectionId(message: Message, connectionId: string): void {
        this.hubConnection.invoke('SendMessageToConnectionId', message, this.connectionId, connectionId);
    }

    public sendMessageToUser(message: Message, userId: string): void {
        this.hubConnection.invoke('SendMessageToUser', message, userId);
    }

    private getOptions() {
        return {
            headers: new HttpHeaders({
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            })
        }
    }
}
