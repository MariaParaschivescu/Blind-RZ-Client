/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccountService } from '.';
import { Device } from '../_models';

const baseUrl = `${environment.apiUrl}/User`;

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private _devices = new BehaviorSubject<Device[]>([
    // new Device('d1', false, '401.203.12.13', '405.234.56.78', 34.5, ),
  ]);

  constructor(private accountService: AccountService) {}

  get devices() {
    return this._devices.asObservable();
  }

  getDevice(id: string) {
    return this.devices.pipe(
      take(1),
      map((devices) => ({ ...devices.find((d) => d.deviceId === id) }))
    );
  }

  addDevice(
    status: boolean,
    localIp: string,
    externIp: string,
    openingPercent: number
  ) {
    // const newDevice = new Device(
    //   Math.random().toString(),
    //   status,
    //   localIp,
    //   externIp,
    //   openingPercent,
    // );
    // return this.devices.pipe(
    //   take(1),
    //   tap((devices) => this._devices.next(devices.concat(newDevice)))
    // );
  }
  updateDevice() {}
  deleteDevice() {}
}
