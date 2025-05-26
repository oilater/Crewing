"use client"

import css from './Toast.module.scss';

const Toast = ({ message }) => {
    return (
        <div className={css.wrapper}>
            {message}
        </div>
    );
};

export default Toast;