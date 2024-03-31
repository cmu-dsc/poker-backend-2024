/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HelloWorldResponseDto } from '../models/HelloWorldResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Get Hello World!
     * Get Hello World!
     * @returns HelloWorldResponseDto OK
     * @throws ApiError
     */
    public static get(): CancelablePromise<HelloWorldResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
}
