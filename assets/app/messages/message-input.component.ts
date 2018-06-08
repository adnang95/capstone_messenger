import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { Message } from './message.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html'
})

export class MessageInputComponent implements OnInit{
  message: Message;
  // constructor that creates messageService variable that stores messages as an array that is created in message.service
  constructor(private messageService: MessageService) {}

  onSubmit(form: NgForm) {
    if (this.message){
        // Edit
        this.message.content = form.value.content;
        this.messageService.updateMessage(this.message)
        .subscribe(
          result => console.log(result)
        );
        this.message = null;

    }
    else{
      // Create
      const message = new Message(form.value.content, 'Adnan');
      this.messageService.addMessage(message)
      // function for subscribing to observable that we created in a message.service on the backend
      .subscribe(
        data => console.log(data),
        error => console.error(error)
      );
    }

    form.resetForm();
  }

  onClear(form: NgForm) {
    this.message = null;
    form.resetForm();
  }

  ngOnInit(){
    this.messageService.messageIsEdit.subscribe(
        (message: Message) => this.message = message
    );
  }
}
