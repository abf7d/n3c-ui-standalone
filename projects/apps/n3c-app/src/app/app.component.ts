import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {WatermarkComponent} from './components/watermark/watermark.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'N3C Clinical Cohort';
}
