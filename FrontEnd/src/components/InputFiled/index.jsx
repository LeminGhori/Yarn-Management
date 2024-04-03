import React, { useEffect } from "react";
import {
    Input,
    Checkbox,
    Radio,
    Button,
    Select,
    FormErrorMessage,
    RadioGroup,
    FormControl,
    FormLabel,
    Flex,
} from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useState } from "react";
import { ErrorMessage, Field } from "formik";
// import { buttonStyles } from "theme/components/button";

const inputStyle = {
    fontSize: "sm",
    size: "lg",
};

const errorStyle = {
    variant: "auth", // Customize this based on your error style
};

const buttonStyles = {
    variant: "navy"
};

const controlStyles = {
    color: "#A0AEC0",
    fontSize: "0.875rem",
    fontWeight: "400",
    marginBottom: "10px",
    minWidth: "200px"
}

export const InputField = ({
    name,
    placeholder,
    form,
    field,
    label,
    styles,
    type = 'text',
    disabled = false,
    isManual = false,
    handleInputChange
}) => {

    const handleChange = (e) => {
        if (type === 'number' && name === 'mobile') {
            const value = e.target.value;
            // Check if the entered value is a valid integer (no decimals allowed)
            if (!isNaN(value) && /^\d+$/.test(value)) {
                const { name, value } = e.target;
                form.setFieldValue(name, value === '' ? '' : value);
            }
        } else if (type === 'number') {
            const value = e.target.value;
            // Check if the entered value is a valid number or a valid decimal number
            if (!isNaN(value) || value === '' || value === '.' || /^\d*\.?\d*$/.test(value)) {
                const { name, value } = e.target;
                form.setFieldValue(name, value === '' ? '' : value);
            }
        } else {
            field.onChange(e);
        }
    };


    return (
        <FormControl isInvalid={form?.errors[name] && form?.touched[name]} {...controlStyles} {...styles}>
            <FormLabel ms="4px" mb="2px" fontSize="1.1rem" fontWeight="700" color="#718096">
                {label}
            </FormLabel>
            {!isManual ? (
                <Input
                    {...field}
                    name={name}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={handleChange}
                    type={type === "email" ? 'email' : "text"}
                    autoComplete='off'
                />
            ) : (
                <Input
                    {...field}
                    name={name}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={handleInputChange}
                    autoComplete='off'
                />
            )}
            <ErrorMessage name={name}>
                {(msg) => (
                    <FormErrorMessage m="0" alignItems="start" fontSize=".8rem" pt="4px" fontWeight="bold">
                        {msg}
                    </FormErrorMessage>
                )}
            </ErrorMessage>
        </FormControl>
    );
};

export const InputDateField = ({
    name,
    placeholder,
    form,
    field,
    label,
    styles,
}) => {
    const [formattedDate, setFormattedDate] = useState('');

    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle empty or undefined dateString
        const [day, month, year] = dateString.split('/'); // Assuming the input format is DD/MM/YYYY

        // Ensure day, month, and year are valid integers before formatting
        const formattedDay = parseInt(day, 10).toString().padStart(2, '0');
        const formattedMonth = parseInt(month, 10).toString().padStart(2, '0');
        const formattedYear = parseInt(year, 10);

        if (isNaN(formattedDay) || isNaN(formattedMonth) || isNaN(formattedYear)) {
            return ''; // Return empty string if any part of the date is not a number
        }

        return `${formattedYear}-${formattedMonth}-${formattedDay}`;
    };

    useEffect(() => {
        setFormattedDate(field.value ? formatDate(field.value) : '');
    }, []);

    const handleChangeDate = (e) => {
        const { name, value } = e.target;
        form.setFieldValue(name, value);
        if (value) {
            setFormattedDate(value); // Always format the date on change
        }
    };

    return (
        <FormControl isInvalid={form?.errors[name] && form?.touched[name]} {...styles}>
            <FormLabel ms="4px" mb="2px" fontSize="1.1rem" fontWeight="700" color="#718096">
                {label}
            </FormLabel>
            <Input
                {...field}
                name={name}
                placeholder={placeholder}
                type="date"
                value={formattedDate}
                onChange={handleChangeDate}
                autoComplete='off'
            />
            <ErrorMessage name={name}>
                {(msg) => (
                    <FormErrorMessage fontSize=".8rem" pt="4px" fontWeight="bold">
                        {msg}
                    </FormErrorMessage>
                )}
            </ErrorMessage>
        </FormControl>
    );
};

export const InputFiledNR = ({
    name,
    value,
    placeholder,
    inputType,
    isError,
    label,
    handleInput
}) => {
    return (
        <FormControl isInvalid={isError} {...controlStyles} >
            <FormLabel ms="4px" mb="2px" fontSize="1.1rem" fontWeight="700" color="#718096">
                {label}
            </FormLabel>
            <Input
                {...(isError ? { ...inputStyle, ...errorStyle } : inputStyle)}
                name={name}
                placeholder={placeholder}
                type={inputType}
                value={value}
                onChange={handleInput}
                autoComplete='off'
            />
            {isError && (
                <FormErrorMessage m="0" alignItems="start" fontSize=".8rem" pt="4px" fontWeight="bold">
                    {label} is required.
                </FormErrorMessage>
            )}
        </FormControl>
    );
}

export const InputImage = ({ name, placeholder, form, field, label, styles, className, id, handleImageChange }) => {
    const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleImageChange(file); // Pass the file to the parent handler
    };

    return (
        <FormControl isInvalid={form?.errors[name] && form?.touched[name]} {...controlStyles} {...styles}>
            <Input
                className={className}
                id={id}
                type="file"
                name={name}
                placeholder={placeholder}
                onChange={handleInputChange}
                autoComplete='off'
            />
            <ErrorMessage name={name}>
                {(msg) => (
                    <FormErrorMessage m="0" alignItems="start" fontSize=".8rem" pt="4px" fontWeight="bold">
                        {msg}
                    </FormErrorMessage>
                )}
            </ErrorMessage>
        </FormControl>
    );
};

export const InputCheckBox = ({ label, isError }) => {
    return (
        <FormControl isInvalid={isError} {...controlStyles}>
            <Flex alignItems="center">
                <Checkbox
                    {...(isError ? { ...inputStyle, ...errorStyle } : inputStyle)}
                    label={label}
                    name={label}
                    autoComplete='off'
                />
                <FormLabel ms="8px" mb="0px" fontSize="1.2rem" fontWeight="normal" >
                    {label}
                </FormLabel>
            </Flex>
            {isError && (
                <FormErrorMessage m="0" alignItems="start" fontSize=".8rem" pt="4px" fontWeight="bold">
                    Please select {label}.
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

export const InputRadioButton = ({ label, options, isError }) => {
    return (
        <FormControl isInvalid={isError} {...controlStyles}>
            <Flex>
                <FormLabel ms="4px" mb="2px" fontSize="1.1rem" fontWeight="700" color="#718096">
                    {label}
                </FormLabel>
                <RadioGroup
                    {...(isError ? { ...inputStyle, ...errorStyle } : inputStyle)}
                >
                    <Flex>
                        {options?.map((option) => (
                            <>
                                <Flex
                                    mr="8px"
                                >
                                    <Radio
                                        key={option.value}
                                        value={option.value}
                                        autoComplete='off'
                                        isInvalid={isError}
                                    />
                                    <Flex ml="8px" fontSize="1.2rem" fontWeight="normal">{option.label}</Flex>
                                </Flex>
                            </>
                        ))}
                    </Flex>
                </RadioGroup>
            </Flex>
            {isError && (
                <FormErrorMessage m="0" alignItems="start" fontSize=".8rem" pt="4px" fontWeight="bold">
                    Please select an option for {label}.
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

export const InputButton = ({ label }) => {
    return (
        <FormControl>
            <Button {...buttonStyles}>{label}</Button>
        </FormControl>
    );
};

export const InputSelectBox = ({ name, disabled = false, placeholder, options, form, label, field, isManual = false, handleSelectChange }) => {
    return (
        <FormControl isInvalid={form.errors[name] && form.touched[name]} {...controlStyles}>
            <FormLabel ms="4px" mb="2px" fontSize="1.1rem" fontWeight="700" color="#718096">
                {label}
            </FormLabel>
            <Field name={name}>
                {
                    !isManual ?
                        ({ field }) => (
                            <Select
                                {...field}
                                disabled={disabled}
                                name={name}
                                autoComplete='off'
                            >
                                <option value="" disabled>{placeholder}</option>
                                {options?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>
                        ) :
                        ({ field }) => (
                            <Select
                                {...field}
                                name={name}
                                autoComplete='off'
                                disabled={disabled}
                                onChange={(e) => {
                                    handleSelectChange(e, form);
                                }}
                            >
                                <option value="" disabled>{placeholder}</option>
                                {options?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>
                        )
                }

            </Field>
            <ErrorMessage name={name}>
                {(msg) => (
                    <FormErrorMessage m="0" alignItems="start" fontSize=".8rem" pt="4px" fontWeight="bold">
                        {msg}
                    </FormErrorMessage>
                )}
            </ErrorMessage>
        </FormControl>
    );
};

export const InputMultiSelect = ({
    name,
    options,
    placeholder,
    isError,
    label,
}) => {
    return (
        <FormControl isInvalid={isError} {...controlStyles}>
            <FormLabel ms="4px" mb="2px" fontSize="1.1rem" fontWeight="700" color="#718096">
                {label}
            </FormLabel>
            <CUIAutoComplete
                autoComplete='off'
                label="Choose preferred work locations"
                placeholder="Type a Country"
                //   onCreateItem={handleCreateItem}
                items={options}
            //   selectedItems={selectedItems}
            //   onSelectedItemsChange={(changes) =>
            //     handleSelectedItemsChange(changes.selectedItems)
            //   }
            />
            {isError && (
                <FormErrorMessage m="0" alignItems="start" fontSize=".8rem" pt="4px" fontWeight="bold">
                    {label} is required.
                </FormErrorMessage>
            )}
        </FormControl>
    );
};

export const InputAutoComplete = ({ options, onChange }) => {
    const [inputValue, setInputValue] = React.useState('');
    const [filteredOptions, setFilteredOptions] = React.useState([]);

    const getOptionLabel = (option) => option;

    React.useEffect(() => {
        const filteredOptions = options?.filter((option) =>
            getOptionLabel(option)?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('').includes(inputValue.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join(''))
        );
        setFilteredOptions(filteredOptions);
    }, [inputValue, options]);

    const onInputChange = (event) => {
        setInputValue(event.target.value);
        const filteredOptions = options?.filter((option) =>
            getOptionLabel(option)?.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('').includes(inputValue.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join(''))
        );
        setFilteredOptions(filteredOptions);
    };

    const onOptionSelect = (option) => {
        setInputValue(getOptionLabel(option));
        onChange(option);
    };

    return (
        <div>
            <input type="text" value={inputValue} onChange={onInputChange} />
            {filteredOptions.length > 0 && (
                <ul className="Listbox">
                    {filteredOptions.map((option) => (
                        <li key={option} onClick={() => onOptionSelect(option)}>
                            {getOptionLabel(option)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
