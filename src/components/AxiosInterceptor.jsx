import React from "react";
import axios from "axios";
import { LinearProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { getTokenSilently } from '../auth/Auth';

const { useState, useCallback, useMemo, useEffect } = React;

let ax = axios.create()

// Add a request interceptor
ax.interceptors.request.use(async config =>
{
    // Do something before request is sent

    //debugger

    let token = await getTokenSilently()

    config.headers.Authorization = `Bearer ${token}`;

    return config;

}, function (error)
{
    //debugger

        toast.error(
            'Could not send the request. Please try again.', {
                position: "top-center"
            });

    // Do something with request error
    return Promise.reject(error)
});

// Add a response interceptor
ax.interceptors.response.use(function (response)
{
    //debugger

    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
    
}, function (error)
{
    //debugger

        toast.error(
            'The request failed. Please try again.', {
            position: "top-center"
        });
        
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
});

export default ax

const useAxiosLoader = () =>
{
    const [counter, setCounter] = useState(0);

    const inc = useCallback(() => setCounter(counter => counter + 1), [
        setCounter
    ]); // add to counter
    const dec = useCallback(() => setCounter(counter => counter - 1), [
        setCounter
    ]); // remove from counter

    const interceptors = useMemo(
        () => ({
            request: config =>
            {
                inc();

                return config;
            },
            response: response =>
            {
                dec();

                return response;
            },
            error: error =>
            {
                dec();

                return Promise.reject(error);
            }
        }),
        [inc, dec]
    ); // create the interceptors

    useEffect(() =>
    {
        // add request interceptors
        const requestId = ax.interceptors.request.use(interceptors.request, interceptors.error);
        // add response interceptors
        const responseId = ax.interceptors.response.use(interceptors.response, interceptors.error);
        return () =>
        {
            ax.interceptors.request.eject(requestId);
            ax.interceptors.response.eject(responseId);
        };
    }, [interceptors]);

    return [counter > 0];
};

export const GlobalLoader = () =>
{
    const [loading] = useAxiosLoader();

    return <div>{loading && <LinearProgress className="progress" />}</div>;
};
