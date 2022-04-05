import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../_models';
import { finalize, map } from 'rxjs/operators';

const baseUrl = `${environment.apiUrl}/User`;

@Injectable({ providedIn: 'root' })
export class AccountService {
  accountSubject: BehaviorSubject<Account>;
  account: Observable<Account>;
  pageTitle: string;
  private refreshTokenTimeout;

  constructor(private router: Router, private http: HttpClient) {
    this.accountSubject = new BehaviorSubject<Account>(null);
    this.account = this.accountSubject.asObservable();
  }

  public get accountValue() {
    return this.accountSubject.value;
  }

  login(email: string, password: string) {
    const headers = new HttpHeaders();
    return this.http
      .post<any>(
        `${baseUrl}/authenticate`,
        { email, password },
        { withCredentials: true, headers }
      )
      .pipe(
        map((account) => {
          this.accountSubject.next(account);
          // this.startRefreshTokenTimer();
          return account;
        })
      );
  }

  //this method must be implemented in API, path must be provided after logout
  logout() {
    this.http.post<any>(
      `${baseUrl}/revoke-token`,
      {},
      { withCredentials: true }
    );
    // this.stopRefreshTokenTimer();
    this.accountSubject.next(null);
    this.router.navigateByUrl('/');
  }

  refreshToken() {
    return this.http
      .post<any>(`${baseUrl}`, {}, { withCredentials: true })
      .pipe(
        map((account) => {
          this.accountSubject.next(account);
          this.startRefreshTokenTimer();
          return account;
        })
      );
  }

  register(account: Account) {
    //const headers = new HttpHeaders();
    return this.http.post<any>(`${baseUrl}/registerUser`, account);
  }

  verifyEmail(token: string) {
    return this.http.post(`${baseUrl}/verify-email`, { token });
  }

  forgotPassword(email: string) {
    return this.http.post(`${baseUrl}/forgot-password`, { email });
  }

  validateResetToken(token: string) {
    return this.http.post(`${baseUrl}/validate-reset-token`, { token });
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.patch(`${baseUrl}/reset-password`, {
      token,
      password,
      confirmPassword,
    });
  }
  getAll() {
    return this.http.get<Account[]>(baseUrl);
  }

  getById(id: string) {
    return this.http.get<Account>(`${baseUrl}/${id}`);
  }

  create(params) {
    return this.http.post(baseUrl, params);
  }

  update(id, params) {
    return this.http.put(`${baseUrl}/${id}`, params).pipe(
      map((account: any) => {
        // update the current account if it was updated
        if (account.id === this.accountValue.id) {
          // publish updated account to subscribers
          account = { ...this.accountValue, ...account };
          this.accountSubject.next(account);
        }
        return account;
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`).pipe(
      finalize(() => {
        // auto logout if the logged in account was deleted
        if (id === this.accountValue.id) {
          this.logout();
        }
      })
    );
  }

  //helper methods

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const token = JSON.parse(atob(this.accountValue.token.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(token.expDate);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
