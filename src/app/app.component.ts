import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {CreateComponent} from "./create/create.component";
import {ListComponent} from "./list/list.component";
import {CounterComponent} from "./counter/counter.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CreateComponent, ListComponent, CounterComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
}
