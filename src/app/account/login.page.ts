import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '../shared/_services';

@Component({ templateUrl: 'login.page.html' })
export class LoginPage implements OnInit {
  @Output() pageTitle = new EventEmitter<string>();
  form: FormGroup;
  loading = false;
  submitted = false;
  invisible = true;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.pageTitle.emit('Log In');
  }

  // convenience getter for easy access to form fields
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get f() {
    return this.form.controls;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get passwordInputType(): string {
    if (this.invisible === false) {
      return 'text';
    }

    return 'password';
  }

  onChangeVisibility() {
    this.invisible = !this.invisible;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from query parameters or default to home page
          const returnUrl =
            this.route.snapshot.queryParams.returnUrl === '/'
              ? '/home/tabs/devices'
              : '/home/tabs/devices';
          console.log(returnUrl);
          this.router.navigateByUrl(returnUrl);
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        },
      });
  }
}
