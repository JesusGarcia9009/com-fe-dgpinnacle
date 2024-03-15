import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  tabIndex: number = 0

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('tabIndex');
    if (ver) {
      this.tabIndex = Number(ver);
    }
  }

}
