import { AsyncResult } from "./asyncresult"
import { ErrorType } from "./index"
import { Err, Ok, Result } from "./result"

type RequestType = {
    method: string
    /* eslint-disable @typescript-eslint/no-explicit-any */
    payload?: any
}

let baseUrl = ""

export const setBaseUrl = (url: string) => baseUrl = url

//TODO https://reqres.in/

export function jsonGet<T, TE extends ErrorType>(url: string): AsyncResult<T, TE> {

    const msg = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }

    const tryFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Result<string, ErrorType>> => {
        try {
            const response = await fetch(input, init)
            return response.status == 200
                ? new Ok<string, ErrorType>(await response.text())
                : new Err<string, ErrorType>({
                    status: response.status + 1000,
                    statusText: response.statusText
                })
        } catch (err) {
            return new Err<string, ErrorType>({
                status: 1000,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                statusText: (err as any).message
            })
        }
    }

    const asyncFetch = (input: RequestInfo | URL, init?: RequestInit): AsyncResult<string, ErrorType> => 
        new AsyncResult<string, ErrorType>(tryFetch(input, init))

    return asyncFetch(`${baseUrl}/${url}`, msg)
        .mapError(e => e as TE)
        .bind(txt => Result.parseJSON<T, TE>(txt))
}

export function jsonPost<T, TE extends ErrorType>(request: RequestType): AsyncResult<T, TE> {
 
    const msg = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.payload)
    }

    const tryFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Result<string, ErrorType>> => {
        try {
            const response = await fetch(input, init)
            return response.status == 200
                ? new Ok<string, ErrorType>(await response.text())
                : new Err<string, ErrorType>({
                    status: response.status + 1000,
                    statusText: response.statusText
                })
        } catch (err) {
            return new Err<string, ErrorType>({
                status: 1000,
                /* eslint-disable @typescript-eslint/no-explicit-any */
                statusText: (err as any).message
            })
        }
    }

    const asyncFetch = (input: RequestInfo | URL, init?: RequestInit): AsyncResult<string, ErrorType> => 
        new AsyncResult<string, ErrorType>(tryFetch(input, init))
    
    return asyncFetch(`${baseUrl}/${request.method}`, msg)
        .mapError(e => e as TE)
        .bind(txt => Result.parseJSON<T, TE>(txt))
}