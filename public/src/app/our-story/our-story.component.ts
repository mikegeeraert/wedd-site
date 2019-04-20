import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.component.html',
  styleUrls: ['./our-story.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurStoryComponent {

  constructor() {}
}
