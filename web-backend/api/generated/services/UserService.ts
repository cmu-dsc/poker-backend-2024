/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from '../models/UserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * Get the current user
     * Get the current user
     * @returns UserDto OK
     * @throws ApiError
     */
    public static getUserMe(): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/me',
            errors: {
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Leave the current team
     * Leave the current team
     * @returns void
     * @throws ApiError
     */
    public static postUserTeamLeave(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/team/leave',
            errors: {
                401: `Unauthorized`,
                422: `Not in a team`,
            },
        });
    }
}
