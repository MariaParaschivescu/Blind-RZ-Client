import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NewDevicePage } from './new-device.page';

const routes: Routes = [
  {
    path: '',
    component: NewDevicePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [NewDevicePage],
})
export class NewDevicePageModule {}
