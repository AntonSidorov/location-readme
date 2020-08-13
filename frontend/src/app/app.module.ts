import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GoogleMapsModule } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService } from './services/api.service';
import { AuthInterceptorService } from './services/auth.interceptor.service';
import { AuthService } from './services/auth.service';
import { GeolocationService } from './services/geolocation.service';
import { NoteService } from './services/note.service';
import { SearchService } from './services/search.service';
import { UserService } from './services/user.service';

import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql.module';

import { AppComponent } from './app.component';
import { EditNicknameDialogComponent } from './edit-nickname-dialog/edit-nickname-dialog.component';
import { HeaderAuthComponent } from './header-auth/header-auth.component';
import { HeaderComponent } from './header/header.component';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { PopupComponent } from './popup/popup.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeaderAuthComponent,
    PopupComponent,
    NoteDialogComponent,
    EditNicknameDialogComponent,
    SearchBoxComponent,
    SearchResultComponent,
    SearchResultsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    AppRoutingModule,
    GraphQLModule,

    // If this gets big enough - split into a separate module so it doesn't pollute the file
    GoogleMapsModule,
    MatButtonModule,
    MatDialogModule,
    MatRippleModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    GeolocationService,
    ApiService,
    AuthService,
    NoteService,
    SearchService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
