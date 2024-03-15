import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent implements OnInit {

  @Input() text: string;
  @Input() icon: string;

  constructor() { }

  ngOnInit(): void {
  }

}
