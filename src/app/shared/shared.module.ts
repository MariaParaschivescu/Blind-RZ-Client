import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordValidatorDirective } from './password-validator.directive';

@NgModule({
  declarations: [PasswordValidatorDirective],
  imports: [CommonModule],
  exports: [PasswordValidatorDirective],
})
export class SharedModule {}
