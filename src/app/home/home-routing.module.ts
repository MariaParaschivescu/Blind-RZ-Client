import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children: [
      {
        path: 'devices',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./devices/devices.module').then(
                (m) => m.DevicesPageModule
              ),
          },
          {
            path: 'new-device',
            loadChildren: () =>
              import('./devices/new-device/new-device.module').then(
                (m) => m.NewDevicePageModule
              ),
          },
        ],
      },
      {
        path: 'programs',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./programs/programs.module').then(
                (m) => m.ProgramsPageModule
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
