import styled from 'styled-components';

export type ButtonVarient = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonContainerProps {
    variant: ButtonVarient;
}

const buttonVarients = {
    primary: 'purple',
    secondary: 'orange',
    danger: 'red',
    success: 'green'
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
    width: 100px;
    height: 40px;
    border-radius: 4px;
    border: 0;
    margin: 8px;

    background-color: ${props => props.theme["green-500"]};
    color: ${props => props.theme.white};

    /* ${props => {
        return `background-color: ${buttonVarients[props.variant]}`
    }} */

`