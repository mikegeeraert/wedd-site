import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatStepperModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';


import { RsvpFormComponent } from './rsvp-form/rsvp-form.component';
import { OurStoryComponent } from './our-story/our-story.component';
import { RouterModule, Routes} from '@angular/router';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChipListComponent } from './rsvp-form/chip-list/chip-list.component';

const routes: Routes = [
  {path: '', component: OurStoryComponent},
  {path: 'rsvp', component: RsvpFormComponent},
  {path: 'rsvp/:userId', component: RsvpFormComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  declarations: [
    AppComponent,
    RsvpFormComponent,
    OurStoryComponent,
    ChipListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),

    // For Navigation
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,

    // For RSVP Form
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    FormBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
