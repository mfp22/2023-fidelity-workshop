import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { defaultStoreProvider } from '@state-adapt/angular';
import { AppComponent } from './app.component';
import { AuthModule } from '@book-co/auth';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    RouterModule.forRoot([
      {
        path: 'books',
        loadChildren: () =>
          import('@book-co/books-page').then((m) => m.BooksPageModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'books',
      },
    ]),
    HttpClientModule,
    AuthModule,
  ],
  providers: [defaultStoreProvider], // https://state-adapt.github.io/angular/docs/angular#defaultstoreprovider
  bootstrap: [AppComponent],
})
export class AppModule {}
