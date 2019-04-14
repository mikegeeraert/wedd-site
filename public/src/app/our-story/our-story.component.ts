import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {Observable, of, Subscribable, Subscription} from 'rxjs';
import {AuthenticationService} from '../authentication.service';
import {distinctUntilChanged, first, map, switchMap, tap} from 'rxjs/operators';
import {FirestoreService} from '../firestore.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.component.html',
  styleUrls: ['./our-story.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurStoryComponent implements OnInit, OnDestroy {
  @ViewChild('container') container: ElementRef;
  @ViewChildren('layer') layers: QueryList<ElementRef>;

  userHouseholdId$: Observable<string | null>;

  scrollSubscription: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private firestoreService: FirestoreService,
              private ngZone: NgZone,
              private scrollDispatcher: ScrollDispatcher,
              private renderer: Renderer2,
              private router: Router) {
    this.scrollSubscription = this.scrollDispatcher.scrolled().subscribe(x => this.parallax(x));
  }

  ngOnInit() {
    this.userHouseholdId$ = this.authenticationService.user.pipe(
      switchMap(user => !!user ? this.firestoreService.getHouseholdIdForEmail(user.uid): of(null))
    )
  }

  parallax(x: any) {
    this.layers.forEach(layer => {
      const depth = parseInt(layer.nativeElement.attributes.dataDepth.value);
      let scrollAmount = this.container.nativeElement.offsetParent.scrollTop;
      scrollAmount = scrollAmount/10;
      const movement = -(scrollAmount * depth);
      const translate3d = `translate3d(0, ${movement}px, 0)`;
      this.renderer.setStyle(layer.nativeElement, '-webkit-transform', translate3d);
      this.renderer.setStyle(layer.nativeElement, '-moz-transform', translate3d);
      this.renderer.setStyle(layer.nativeElement, '-ms-transform', translate3d);
      this.renderer.setStyle(layer.nativeElement, '-o-transform', translate3d);
      this.renderer.setStyle(layer.nativeElement, 'transform', translate3d);
    });
  }

  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
  }
}
