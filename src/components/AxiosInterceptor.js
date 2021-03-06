import React from "react";
import axios from "axios";
import { LinearProgress } from '@material-ui/core';
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

    console.log('Token: ' + token)

    config.headers.Authorization = `Bearer ${token}`;

    return config;

}, function (error)
{
    //debugger

        let e = JSON.stringify(error, null, 3)

        console.log(JSON.stringify(error))

        toast.error(
            <div>An error occurred. Please, contact the developer.<br />
                Details: {error.message}
            </div>, {
                position: toast.POSITION.TOP_CENTER
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

        let e = JSON.stringify(error, null, 3)

        console.log(JSON.stringify(error))

        toast.error(
            <div>An error occurred. Please, contact the developer.<br />
                Details: {error.message}
            </div>, {
            position: toast.POSITION.TOP_CENTER
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
        ax.interceptors.request.use(interceptors.request, interceptors.error);
        // add response interceptors
        ax.interceptors.response.use(interceptors.response, interceptors.error);
        return () =>
        {
            // remove all intercepts when done
            ax.interceptors.request.eject(interceptors.request);
            ax.interceptors.request.eject(interceptors.error);
            ax.interceptors.response.eject(interceptors.response);
            ax.interceptors.response.eject(interceptors.error);
        };
    }, [interceptors]);

    return [counter > 0];
};

export const GlobalLoader = () =>
{
    const [loading] = useAxiosLoader();

    return <div>{loading && <LinearProgress className="progress" />}</div>;
};