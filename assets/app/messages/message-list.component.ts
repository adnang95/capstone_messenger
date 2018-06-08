import { Component } from '@angular/core';
import { MessageService } from './message.service';
import { Message } from './message.model';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html'
})

export class MessageListComponent implements OnInit {
  // message variable of model type Message with two parameters
  messages: Message[];

  constructor( private messageService: MessageService) {}

  ngOnInit() {
      this.messageService.getMessages()
        .subscribe(
          (messages: Message[]) => {
              this.messages = messages;
          }
        );
  }
}
