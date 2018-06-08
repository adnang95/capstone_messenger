import { Component, Input } from '@angular/core';

import { Message } from '../messages/message.model';
import { MessageService } from '../messages/message.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

})

export class HeaderComponent {
  @Input() message: Message;
}
