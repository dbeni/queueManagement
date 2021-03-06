import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestService } from './../../service/rest.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  @Input() roomProperties = {
    roomId : null,
    roomName : null,
    currentQueueNumber : null,
    lastQueueNumber : null
  };

  @Input() initialQueue = null;
  @Input() initialLast = null;

  @Output() sendQueueAndLast = new EventEmitter<object>();

  QueueAndLast :any = {queue : null, last : null};

  console = console;

  constructor(private restService: RestService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.QueueAndLast.queue = this.initialQueue;
    this.QueueAndLast.last = this.initialLast;
  }

  acceptNumber(roomId : any): void {
    this.restService.acceptNumber(roomId).subscribe((res) => {
      //this.roomProperties.currentQueueNumber = res.data.room.currentQueueNumber;
      this.roomProperties = res.data.room;
      this.QueueAndLast.queue = res.data.queue;
      this.sendQueueAndLast.emit(this.QueueAndLast);
      this.snackBar.open(res.message, "OK", {
        duration: 3000,
        verticalPosition:"top"
      });
    }, (err) => {
      this.snackBar.open(err, "Close", {
        duration: 3000,
        verticalPosition:"top"
      });
    })
  }

  skipNumber(roomId : any): void {
    this.restService.skipNumber(roomId).subscribe((res) => {
      this.QueueAndLast.queue = res.data;
      this.sendQueueAndLast.emit(this.QueueAndLast);
      this.snackBar.open(res.message, "OK", {
        duration: 3000
      });
    }, (err) => {
      this.snackBar.open(err, "Close", {
        duration: 3000,
        verticalPosition:"top"
      });
    })
  }

  releaseNumber(roomId : any): void {
    this.restService.releaseNumber(roomId).subscribe((res) => {
      this.roomProperties = res.data.room;
      this.QueueAndLast.queue = res.data.queue;
      this.QueueAndLast.last = res.data.releasedNumber;
      this.sendQueueAndLast.emit(this.QueueAndLast);
      this.snackBar.open(res.message, "OK", {
        duration: 3000,
        verticalPosition:"top"
      });
    }, (err) => {
      this.snackBar.open(err, "Close", {
        duration: 3000,
        verticalPosition:"top"
      });
    })
  }

  log(val : any) { console.log(val); }
}
