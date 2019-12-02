import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TextInputDirective } from './text-input.directive';
import { NumberInputDirective } from './number-input.directive';
import { SimpleFormExampleComponent } from './simple-form-example/simple-form-example.component';

@NgModule({
  declarations: [
    AppComponent,
    TextInputDirective,
    NumberInputDirective,
    SimpleFormExampleComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
