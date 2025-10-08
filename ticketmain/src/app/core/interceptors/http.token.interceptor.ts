import { inject } from "@angular/core";
import { JwtService } from "../services/jwt.service";
import { HttpInterceptorFn } from "@angular/common/http";

export const HttpTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const jwtService = inject(JwtService);

    const headersConfig: { [key: string]: string } = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const token = jwtService.getToken();
    if (token) {
        headersConfig['Authorization'] = `Bearer ${token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next(request);
};