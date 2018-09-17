import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TodolistComponent } from './components/todolist/todolist.component';

@NgModule({
  imports:      [ BrowserModule,HttpClientModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent, TodolistComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
