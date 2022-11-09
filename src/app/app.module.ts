import { NgModule } from '@angular/core';

// Modules
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { MusicModule } from './music/music.module';

//Custom Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BankingComponent } from './Banking/banking.component';
import { PlayerPageComponent } from './player-page/player-page.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './auth/auth.interceptor';



@NgModule({
  declarations: [
    //GENERAL
    AppComponent,
    HeaderComponent,    
    //BANKING
    BankingComponent,
    PlayerPageComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    MusicModule
  ],
  providers: [{
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
