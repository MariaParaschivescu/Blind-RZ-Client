import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiUrl}/User`;

@Injectable({ providedIn: 'root' })
export class ProgramService {}
