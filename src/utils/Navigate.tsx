import React from 'react'
import { NavigateFunction, useNavigate, NavigateOptions } from 'react-router'

let UseNavigateRef: NavigateFunction;

export const NavigateUtilsConfigurator: React.FC = () => {
    UseNavigateRef = useNavigate()
    return null
}

const navigate = {
    to(path: string, options?: NavigateOptions | undefined) {
        UseNavigateRef(path, options)
    }
};

export default navigate;