/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TeamDto } from '../models/TeamDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TeamService {
    /**
     * Create a new team
     * Create a new team
     * @param requestBody
     * @returns TeamDto Created
     * @throws ApiError
     */
    public static postTeam(
        requestBody: TeamDto,
    ): CancelablePromise<TeamDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/team',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                422: `User already in a team, github username already taken, or team already exists`,
            },
        });
    }
    /**
     * Get all teams
     * Get all teams
     * @param lastGames
     * @returns TeamDto OK
     * @throws ApiError
     */
    public static getAllTeams(
        lastGames?: number,
    ): CancelablePromise<Array<TeamDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/team',
            query: {
                'lastGames': lastGames,
            },
        });
    }
    /**
     * Get a team by github username
     * Get a team by github username
     * @param githubUsername The github username of the team
     * @returns TeamDto OK
     * @throws ApiError
     */
    public static getTeam(
        githubUsername: string,
    ): CancelablePromise<TeamDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/team/{githubUsername}',
            path: {
                'githubUsername': githubUsername,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Update a team by github username
     * Update a team by github username
     * @param githubUsername The github username of the team
     * @param requestBody
     * @returns TeamDto OK
     * @throws ApiError
     */
    public static putTeam(
        githubUsername: string,
        requestBody: TeamDto,
    ): CancelablePromise<TeamDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/team/{githubUsername}',
            path: {
                'githubUsername': githubUsername,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                422: `User already in a team, github username already taken, or team already exists`,
            },
        });
    }
    /**
     * Delete a team by github username
     * Delete a team by github username
     * @param githubUsername The github username of the team
     * @returns void
     * @throws ApiError
     */
    public static deleteTeam(
        githubUsername: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/team/{githubUsername}',
            path: {
                'githubUsername': githubUsername,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
