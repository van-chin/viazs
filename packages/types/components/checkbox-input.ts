export interface VzCheckboxInputProps {
    checkboxLabel?: string;
}

export type CheckboxValue = string | number | boolean;

export type CheckboxChange = (checked:boolean) => void;