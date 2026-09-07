import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const router = inject(Router);

  const token =
    localStorage.getItem('jwtToken');


  if (token) {

    const authReq = req.clone({

      setHeaders: {

        Authorization:
          `Bearer ${token}`

      }

    });

    return next(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        // an authenticated request was rejected: the session is invalid, so force a fresh login
        if (error.status === 401 || error.status === 403) {

          localStorage.removeItem('jwtToken');
          localStorage.removeItem('tokenExpiresAt');

          router.navigate(['/admin/login']);

        }

        return throwError(() => error);

      })

    );

  }


  return next(req);

};