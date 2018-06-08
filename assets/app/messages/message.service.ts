import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Message } from "./message.model";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http, private errorService: ErrorService) {}

    addMessage(message: Message) {
      // creating a constant body that will convert our message into JSON format
        const body = JSON.stringify(message);
        //constant headers for converting headers from plain text into json
        const headers = new Headers({'Content-Type': 'application/json'});
        // checking if the token exists in localstorage and if it does it retrieves it
        const token = localStorage.getItem('token')
              ? '?token=' + localStorage.getItem('token')
              : '';
        // post a message to this path which we specified in our routes on backend
        // second parameter body is the consant which holds a message string in JSON format
        return this.http.post('https://meanchat-capstone.herokuapp.com/message' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const message = new Message(
                  result.obj.content,
                  result.user.firstName,
                  result.obj._id,
                  result.user._id
                );
                // unshift method for putting latest messages on top, instead of push method
                this.messages.unshift(message);
                return message;
            })
            .catch((error: Response) => {
              this.errorService.handleError(error.json());
              return Observable.throw(error.json());
            });
    }

    getMessages() {
        return this.http.get('https://meanchat-capstone.herokuapp.com/message')
            .map((response: Response) => {
              // getting messages object set up in messages.js on backend
                const messages = response.json().obj;
                // for loop for displaying array of messages
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                  // pushing a message in a specified format
                  // unshift method for putting latest messages on top, instead of push method
                    transformedMessages.unshift(new Message(
                      message.content,
                      message.user.firstName,
                      message._id,
                      message.user._id)
                    );
                }
                // setting variable messages equal to transformedMessages, which is a new message from our array
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error: Response) => {
              this.errorService.handleError(error.json());
              return Observable.throw(error.json());
            });
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
      // creating a constant body that will convert our message into JSON format
        const body = JSON.stringify(message);
        //constant headers for converting headers from plain text into json
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
              ? '?token=' + localStorage.getItem('token')
              : '';
        // update a message to this path which we specified in our routes on backend
        // second parameter body is the consant which holds a message string in JSON format
        //.patch means update the message with the corresponding messageId
        return this.http.patch('https://meanchat-capstone.herokuapp.com/message/' + message.messageId + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const message = new Message(
                  result.obj.content,
                  result.obj.user.firstName,
                  result.obj._id,
                  result.obj.user._id
                );
                this.messages.push(message);
                return message;
            })
            .catch((error: Response) => {
              this.errorService.handleError(error.json());
              return Observable.throw(error.json());
            });
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = localStorage.getItem('token')
              ? '?token=' + localStorage.getItem('token')
              : '';
        return this.http.delete('https://meanchat-capstone.herokuapp.com/message/' + message.messageId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
              this.errorService.handleError(error.json());
              return Observable.throw(error.json());
            });
    }
}
