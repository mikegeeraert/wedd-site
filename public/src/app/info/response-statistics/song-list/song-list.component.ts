import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {

  @Input() songs: string[];

  constructor() { }

  ngOnInit() {
  }

}
