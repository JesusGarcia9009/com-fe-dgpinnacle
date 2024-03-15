import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../core/core/services/loading.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  tabIndex: number = 0
  show: boolean = false;

  constructor(private route: ActivatedRoute, private loadingService: LoadingService) { }

  async ngOnInit(): Promise<void> {
    const ver = this.route.snapshot.paramMap.get('tabIndex');
    if (ver) {
      this.tabIndex = Number(ver);
    }
    this.loadingService.show();
    await this.sleep(1000);
    this.show = true;
    this.loadingService.hide();
    
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  } 

}
