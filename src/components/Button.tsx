import { ButtonContainer, ButtonVarient } from './Button.styles';

interface ButtonProps {
    variant?: ButtonVarient;
}

export function Button({variant = 'primary'}: ButtonProps) {
    return (
        <ButtonContainer variant={variant}>
            Enviar
        </ButtonContainer>
    )
}