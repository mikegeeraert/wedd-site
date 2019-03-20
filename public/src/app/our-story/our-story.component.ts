import {AfterViewInit, Component, ElementRef, NgZone, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {ScrollDispatcher} from '@angular/cdk/overlay';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.component.html',
  styleUrls: ['./our-story.component.css'],
})
export class OurStoryComponent implements OnInit {
  @ViewChild('container') container: ElementRef;
  @ViewChildren('layer') layers: QueryList<ElementRef>;

  constructor(private ngZone: NgZone,
              private scrollDispatcher: ScrollDispatcher,
              private renderer: Renderer2) {
    this.scrollDispatcher.scrolled().subscribe(x => this.parallax(x));
  }

  ngOnInit() {
  }

  parallax(x: any) {
    console.log(x);
    this.layers.forEach(layer => {
      const depth = parseInt(layer.nativeElement.attributes.dataDepth.value);
      let scrollAmount = this.container.nativeElement.offsetParent.scrollTop;
      scrollAmount = scrollAmount/10;
      const movement = -(scrollAmount * depth);
      console.log(movement);
      const translate3d = `translate3d(0, ${movement}px, 0)`;
      console.log(translate3d);
      this.renderer.setStyle(layer.nativeElement, '-webkit-transform', translate3d);
      this.renderer.setStyle(layer.nativeElement, '-moz-transform', translate3d);
      this.renderer.setStyle(layer.nativeElement, '-ms-transform', translate3d);
      this.renderer.setStyle(layer.nativeElement, '-o-transform', translate3d);
      this.renderer.setStyle(layer.nativeElement, 'transform', translate3d);
      console.log(layer)
    });
  }
}
