import { NgModule } from '@angular/core';

// Modules
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { MusicModule } from './music/music.module';

//Custom Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BankingComponent } from './Banking/banking.component';



@NgModule({
  declarations: [
    //GENERAL
    AppComponent,
    HeaderComponent,    
    //BANKING
    BankingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    MusicModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
