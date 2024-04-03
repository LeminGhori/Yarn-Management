import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Spinner,
    Text,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { useApi } from "network/api";
import CommonTable from "components/CommonTable";
import { AddIcon } from "@chakra-ui/icons";
import { ErrorMessage, Field, Formik, useFormikContext } from "formik";
import { InputField } from "components/InputFiled";
import * as Yup from "yup";
import { UploadIcon } from "components/Icons/Icons";
import { InputImage } from "components/InputFiled";
import DataTable from "react-data-table-component";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { modelData } from "redux/action";
import { useDispatch, useSelector } from "react-redux";
import { BackIcon } from "components/Icons/Icons";
import { modelEdit } from 'redux/action';
import { modelDelete } from 'redux/action';
import { ToastContainer, toast } from "react-toastify";
import { totalRowsCount } from "redux/action";
import { setTableinitialState } from "redux/action";
function Design() {
    const { getApi, postApi, putApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [isAddPage, setIsAddPage] = useState(false);
    const textColor = useColorModeValue("gray.500", "white");
    const [tableData, setTableData] = useState([]);
    const [image, setIsImage] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.selected);
    const [isFetch, setIsFetch] = useState(false);
    const pagination = useSelector((state) => state.pagination);
    const deleteUrl = `/api/design/deleteDesign`;
    const { colorMode } = useColorMode();
    const disabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-400)" : "var(--chakra-colors-gray-700)",
    };

    const enabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-700)" : "var(--chakra-colors-gray-400)",
    };
    const model = {
        btnTitle: "Add Design",
        page: "Design",
        fieldData: [
            {
                name: "Name",
                type: "text",
            },
            {
                name: "Pick",
                type: "text",
            },
            {
                name: "Reed",
                type: "text",
            },
            {
                name: "Hook",
                type: "text",
            },
            {
                name: "Dash Repeat",
                type: "text",
            },
            {
                name: "Feeder",
                type: "text",
            },
            {
                name: "Image",
                type: "file",
            },
            {
                name: "Final Cut",
                type: "text",
            },
            {
                name: "Avg Pick",
                type: "text",
            },
            {
                name: "Total Cards",
                type: "text",
            },
        ],
    };

    const controlStyles = {
        color: "#A0AEC0",
        fontSize: "0.875rem",
        fontWeight: "400",
        marginBottom: "10px",
        minWidth: "200px",
    };

    const btnColor = {
        background: "gray",
        height: "46px",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
        color: "white",
    };

    const btnSelected = {
        background: "green",
        height: "46px",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
        color: "white",
    };

    const columns = [
        {
            name: "Feeder",
            selector: (row) => row,
            sortable: true,
            id: (row) => row,
        },
        {
            name: `Card`,
            cell: (row) => (
                <Field
                    name={`card-${row}`}
                    render={({ field, form }) => (
                        <FormControl
                            isInvalid={
                                form?.errors[`card-${row}`] && form?.touched[`card-${row}`]
                            }
                            {...controlStyles}
                        >
                            <FormLabel
                                ms="4px"
                                mb="2px"
                                fontSize="1.1rem"
                                fontWeight="700"
                                color="#718096"
                            >
                                {`Card ${row}`}
                            </FormLabel>
                            <Input
                                {...field}
                                name={`card-${row}`}
                                placeholder={`Enter Card ${row}`}
                                type="number"
                                autoComplete='off'
                                onChange={(e) => {
                                    handleCardChange(e, form, row);
                                }}
                            />
                            <ErrorMessage name={`card-${row}`}>
                                {(msg) => (
                                    <FormErrorMessage
                                        m="0"
                                        alignItems="start"
                                        fontSize=".8rem"
                                        pt="4px"
                                        fontWeight="bold"
                                    >
                                        {msg}
                                    </FormErrorMessage>
                                )}
                            </ErrorMessage>
                        </FormControl>
                    )}
                />
            ),
            id: `card`,
        },
        {
            name: `Pick`,
            cell: (row) => (
                <Field
                    name={`pick-${row}`}
                    render={({ field, form }) => (
                        <InputField
                            name={`pick-${row}`}
                            label={`Pick ${row}`}
                            placeholder={`Enter Pick ${row}`}
                            form={form}
                            field={field}
                            type="number"
                            disabled={true}
                        />
                    )}
                />
            ),
            id: `pick`,
        },
        {
            name: "ground",
            cell: (row) => {
                // Destructuring values from useFormikContext
                return (
                    <Field
                        name={`ground`}
                        render={({ field, form }) => (
                            <FormControl
                                isInvalid={form?.errors["ground"] && form?.touched["ground"]}
                                {...controlStyles}
                            >
                                <Box
                                    style={form.values.ground !== row ? btnColor : btnSelected}
                                    onClick={() => {
                                        handleGroundPallu(form, "ground", row);
                                    }}
                                >
                                    Ground
                                </Box>
                                <ErrorMessage name={"ground"}>
                                    {(msg) => (
                                        <FormErrorMessage
                                            m="0"
                                            alignItems="start"
                                            fontSize=".8rem"
                                            pt="4px"
                                            fontWeight="bold"
                                        >
                                            {msg}
                                        </FormErrorMessage>
                                    )}
                                </ErrorMessage>
                            </FormControl>
                        )}
                    />
                );
            },
            id: "ground",
        },
        {
            name: "pallu",
            cell: (row) => {
                return (
                    <Field
                        name={`pallu`}
                        render={({ field, form }) => (
                            <FormControl
                                isInvalid={form?.errors["pallu"] && form?.touched["pallu"]}
                                {...controlStyles}
                            >
                                <Box
                                    style={form.values.pallu !== row ? btnColor : btnSelected}
                                    onClick={() => {
                                        handleGroundPallu(form, "pallu", row);
                                    }}
                                >
                                    Pallu
                                </Box>
                                <ErrorMessage name={"pallu"}>
                                    {(msg) => (
                                        <FormErrorMessage
                                            m="0"
                                            alignItems="start"
                                            fontSize=".8rem"
                                            pt="4px"
                                            fontWeight="bold"
                                        >
                                            {msg}
                                        </FormErrorMessage>
                                    )}
                                </ErrorMessage>
                            </FormControl>
                        )}
                    />
                );
            },
            id: "pallu",
        },
    ];

    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/design/findDesign?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
            const response = await getApi(url);
            setData(response?.pageItems);
            setIsLoading(false);
            setIsFetch(false);
            dispatch(totalRowsCount(response?.total || 0));
        } catch (error) {
            setIsError(true);
            setIsFetch(false);
            setError(error);
        }
    };

    useEffect(() => {
        dispatch(setTableinitialState());
        dispatch(modelData(model));
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (isFetch == true) {
            setIsFetch(false);
            fetchData();
        }
    }, [isFetch == true, selected.isEdit == false]);

    useEffect(() => {
        fetchData();
    }, [pagination?.currentPage, pagination?.pageSize]);

    const fieldData = [
        "name",
        "pick",
        "reed",
        "hook",
        "dash Repeat",
        "feeder",
        "pallu",
        "ground",
        "image",
        "final Cut",
        "avg Pick",
        "total Cards",
    ];

    const tmpValue = [1, 2, 3, 4, 5, 6, 7, 8];
    let initialValues = {
        ...fieldData.reduce((acc, field) => {
            if (field) {
                const formattedField = field.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('');
                acc[formattedField] = selected.isEdit ? selected.selectData[formattedField] : "";
            }
            return acc;
        }, {}),
        // solve string error   
        ...tmpValue.reduce((acc, field) => {
            if (field) {
                const feederIndex = field - 1;
                const feederData = selected?.selectData?.user?.feeders?.[feederIndex];
                acc[`card-${field}`] = selected.isEdit ? feederData?.[`card-${field}`] || "" : "";
                acc[`pick-${field}`] = selected.isEdit ? feederData?.[`pick-${field}`] || "" : "";
            }
            return acc;
        }, {}),
    };


    const fetchImage = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/design/photo/${selected.selectData.user?.image}`;
            const response = await fetch(url);
            const blob = await response.blob();

            // Create a new File object from the blob
            const imageFile = new File([blob], selected.selectData.user?.image, { type: 'image/jpeg' });
            setIsImage(imageFile);
            initialValues.image = URL.createObjectURL(blob); // Set the image file

        } catch (error) {
            console.error('Error fetching image:', error);
            setIsImage(null); // or set a default image
        }


    };
    useEffect(() => {
        if (isAddPage === true && selected.isEdit) {
            generateTableData(selected.selectData.user);
            initialValues.ground = selected.selectData.user?.ground || "";
            initialValues.pallu = selected.selectData.user?.pallu || "";
            // Call the fetchImage function
            fetchImage();
        }
    }, [isAddPage, selected.isEdit]);
    // Adding ground and pallu conditionally outside the object
    const fieldValidations = fieldData.reduce((acc, field) => {
        if (field) {
            acc[field.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')] = Yup.string().required(`${field} is required`);
        }
        return acc;
    }, {});

    const tableValidations = tableData?.reduce((acc, field) => {
        if (field) {
            acc[`card-${field}`] = Yup.string().required(`Card ${field} is required`);
            acc[`pick-${field}`] = Yup.string().required(`Pick ${field} is required`);
        }
        return acc;
    }, {});

    const validationSchemas = Yup.object().shape({
        ...fieldValidations,
        ...tableValidations,
    });

    const handleImageChange = (setFieldValue, file) => {
        if (file) {
            setIsImage(file)
            const reader = new FileReader();

            reader.onload = (event) => {
                const imageUrl = event.target.result;
                setFieldValue("image", imageUrl); // Update Formik field value with the image URL
            };
            reader.readAsDataURL(file);
        } else {
            setFieldValue("image", ""); // Clear Formik field value if no file
        }
    };

    const handleCardChange = (e, form, row) => {
        const newValue = e.target.value;
        const name = e.target.name;
        if (!isNaN(newValue)) {
            form.setFieldValue(name, newValue);
            let tempCard = 0;
            let tempPick = 0;
            for (let i = 1; i <= form.values.feeder; i++) {
                let cardValue = 0;
                let pickValue = 0;
                if (row == i) {
                    const temps =
                        form.values.R != "" ? Number(form.values.dashRepeat) : 0;
                    cardValue = Number(newValue);
                    pickValue = Number(newValue) / temps;
                } else {
                    cardValue =
                        form.values[`card-${i}`] !== ""
                            ? Number(form.values[`card-${i}`])
                            : 0;
                    pickValue =
                        form.values[`pick-${i}`] !== ""
                            ? Number(form.values[`pick-${i}`])
                            : 0;
                }
                if (!isNaN(cardValue)) {
                    tempCard += cardValue;
                    tempPick += pickValue;
                }
            }
            const temps =
                form.values.dashRepeat != "" ? Number(form.values.dashRepeat) : 0;
            const pick = Number(newValue) / temps;
            // const avgPick = Number(form.values.avgPick) + Number(pick);

            // Ensure tempCard is a number before using toFixed
            if (!isNaN(tempCard)) {
                form.setFieldValue("totalCards", tempCard.toFixed(2));
                form.setFieldValue(`pick-${row}`, pick.toFixed(2));
                form.setFieldValue("avgPick", tempPick.toFixed(2));
            } else {
                // Handle if tempCard is not a number
                form.setFieldValue("totalCards", ""); // Clear the final cut field
            }
        } else {
            // Handle error if the input is not a number
            form.setFieldError(name, "Please enter a valid number");
            form.setFieldValue("totalCards", "Please enter a Cards"); // Clear the final cut field in case of error
        }
    };

    // Dynamically set tableData based on feederValue
    const generateTableData = (val) => {
        if (val.feeder <= 8) {
            const newData = [];
            for (let i = 1; i <= val.feeder; i++) {
                newData.push(i);
            }
            setTableData(newData);
        } else {
            toast.error("Feeder Max Limit Is 8.");
        }
    };

    const handleGroundPallu = (form, name, row) => {
        if (form.values.ground !== row && form.values.pallu !== row) {
            form.setFieldValue(name, row);
        }
    };

    const handleDashRepeatChange = (e, form) => {
        const newValue = e.target.value;

        if (!isNaN(newValue)) {
            form.setFieldValue("dashRepeat", newValue);
            let tempPick = 0;
            for (let i = 1; i <= form.values.feeder; i++) {
                const temps = newValue != "" ? Number(newValue) : 0;
                const pick = Number(form.values[`card-${i}`]) / temps;
                tempPick += pick;
                form.setFieldValue(`pick-${i}`, pick.toFixed(2));
            }
            const finalCutValue = newValue / 39.37;
            form.setFieldValue("finalCut", finalCutValue.toFixed(2));
            form.setFieldValue("avgPick", tempPick.toFixed(2));
        } else {
            // Handle error if the input is not a number
            form.setFieldError("dashRepeat", "Please enter a valid number");
            form.setFieldValue("finalCut", ""); // Clear the final cut field in case of error
        }
    };

    return (
        <Flex direction="column" pt={["120px", "75px", "90px"]}>
            {isLoading == true ?
                <Flex justifyContent="center" alignItems="center" textAlign="center" w="100%" mt={{ "xl": "40px", "sm": "10px" }}>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Flex>
                :
                <>
                    {!isAddPage ? (
                        <>
                            <Box>
                                <Button
                                    alignItems="center"
                                    onClick={() => {
                                        setIsAddPage(true);
                                    }}
                                >
                                    <AddIcon color="inherit" fontSize="16px" />
                                    <Text pt="2px" pl="4px">
                                        Add Design
                                    </Text>
                                </Button>
                            </Box>
                            <Box mt="25px">

                                <CommonTable
                                    data={data}
                                    isLoading={isLoading}
                                    isError={isError}
                                    error={error}
                                    page="Design"
                                    tableTitle="Design Data"
                                    setIsAddPage={setIsAddPage}
                                    deleteUrl={deleteUrl}
                                    setIsFetch={setIsFetch}
                                    toast={toast}
                                />
                            </Box>
                        </>
                    ) : (
                        <Card
                            overflowX={{ sm: "scroll", xl: "hidden" }}
                            p="25px"
                            className="common-table"
                        >
                            <CardHeader
                                p="6px 0px 0px 0px"
                                display="flex"
                                justifyContent="space-between"
                                flexDirection={{ sm: "column", md: "row" }}
                            >
                                <Flex alignItems="center" gap="5px">
                                    <BackIcon
                                        fontSize="1.3rem"
                                        mb="4px"
                                        cursor="pointer"
                                        onClick={() => {
                                            setIsAddPage(false);
                                            dispatch(modelEdit(false));
                                            setTableData(null);
                                            setIsImage(null);
                                        }}
                                    />
                                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                                        Add Design
                                    </Text>
                                </Flex>
                            </CardHeader>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={Yup.object().shape({
                                    ...fieldValidations,
                                    ...tableValidations,
                                })}
                                onSubmit={(values, { setSubmitting, setErrors }) => {
                                    validationSchemas
                                        .validate(values, { abortEarly: false })
                                        .then(() => {
                                            const { feeder } = values;
                                            if (feeder) {
                                                const feederValue = parseInt(feeder, 10);

                                                if (feederValue >= 1 && feederValue <= 8) {
                                                    let keysToRemove = [];

                                                    // Construct keys to remove based on the feeder value
                                                    for (let i = feederValue + 1; i <= 8; i++) {
                                                        const tempCard = [
                                                            `card-${i}`,
                                                            `pick-${i}`,
                                                            // Add more keys if needed
                                                        ];
                                                        keysToRemove = [...keysToRemove, ...tempCard];
                                                    }

                                                    const body = { ...values };
                                                    body.image = image
                                                    // Remove keys from body
                                                    keysToRemove.forEach((key) => {
                                                        delete body[key];
                                                    });

                                                    const feeders = Object.keys(body)
                                                        .filter(key => key.startsWith('card-') || key.startsWith('pick-'))
                                                        .reduce((result, key) => {
                                                            const index = key.split('-')[1];
                                                            const feederIndex = parseInt(index) - 1;

                                                            if (!result[feederIndex]) {
                                                                result[feederIndex] = {};
                                                            }

                                                            result[feederIndex][key] = values[key];
                                                            return result;
                                                        }, []);
                                                    const newData = { ...body, feeders };

                                                    // Remove the card and pick properties from the newData object
                                                    Object.keys(newData)
                                                        .filter(key => key.startsWith('card-') || key.startsWith('pick-'))
                                                        .forEach(key => delete newData[key]);
                                                    const formData = new FormData();
                                                    for (const key in newData) {
                                                        if (Object.hasOwnProperty.call(newData, key)) {
                                                            if (key === "feeders") {
                                                                // For "feeders" key, stringify the value before appending
                                                                const feedersJSON = JSON.stringify(newData[key]);
                                                                formData.append(key, feedersJSON);
                                                            } else {
                                                                // For other keys, directly append the value
                                                                formData.append(key, newData[key]);
                                                            }
                                                        }
                                                    }
                                                    try {
                                                        const postUrl = `${process.env.REACT_APP_HOST}/api/design/createDesign`;
                                                        const putUrl = `${process.env.REACT_APP_HOST}/api/design/editDesign`;
                                                        let headers = {};
                                                        if (!selected.isEdit) {
                                                            postApi(postUrl, formData, headers)
                                                                .then(async (response) => {
                                                                    // You can access the response data using apiOtpResponse in your component
                                                                    toast.success(response?.message || "New Data ADD successful!");
                                                                    dispatch(modelEdit(false));
                                                                    dispatch(modelDelete(false));
                                                                    setSubmitting(false);
                                                                    setIsFetch(true);
                                                                    setIsAddPage(false);
                                                                    setIsImage(null);
                                                                    setTableData([]);
                                                                })
                                                                .catch((error) => {
                                                                    toast.error(error?.message || "Please Try After Sometime");
                                                                });
                                                        } else {
                                                            putApi(`${putUrl}/${selected.selectData.user.tokenId}`, formData, headers)
                                                                .then(async (response) => {
                                                                    // You can access the response data using apiOtpResponse in your component
                                                                    toast.success(response?.message || "Data Update successful!");
                                                                    dispatch(modelEdit(false));
                                                                    dispatch(modelDelete(false));
                                                                    setSubmitting(false);
                                                                    setIsFetch(true);
                                                                    setIsAddPage(false);
                                                                    setTableData([]);
                                                                    setIsImage(null);
                                                                })
                                                                .catch((error) => {
                                                                    toast.error(error?.message || "Please Try After Sometime");
                                                                });
                                                        }
                                                    } catch (error) {
                                                        toast.error(error?.message || "Please Try After Sometime");
                                                    }
                                                }
                                            }

                                        })
                                        .catch((errors) => {
                                            setErrors(errors);
                                            setSubmitting(false);
                                        });
                                }}
                            >
                                {({ handleSubmit, values }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Flex
                                            // justifyContent="space-between"
                                            width="100%"
                                            flexWrap={{
                                                "2xl": "wrap",
                                                xl: "wrap",
                                                lg: "wrap",
                                                md: "wrap",
                                                sm: "wrap",
                                            }}
                                        >
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Field
                                                    name="name"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name="name"
                                                            label="Name"
                                                            placeholder={`Enter Name`}
                                                            form={form}
                                                            field={field}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Field
                                                    name="pick"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name="pick"
                                                            label="Pick"
                                                            placeholder={`Enter Pick`}
                                                            form={form}
                                                            field={field}
                                                            type="number"
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Field
                                                    name="reed"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name="reed"
                                                            label="Reed"
                                                            placeholder={`Enter Reed`}
                                                            form={form}
                                                            field={field}
                                                            type="number"
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Field
                                                    name="hook"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name="hook"
                                                            label="Hook"
                                                            placeholder={`Enter Hook`}
                                                            form={form}
                                                            field={field}
                                                            type="number"
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <div>
                                                    <label
                                                        className="picture"
                                                        htmlFor="picture__input"
                                                        tabIndex="0"
                                                    >
                                                        <span className="picture__image">
                                                            {values?.image ? (
                                                                <img
                                                                    src={values?.image}
                                                                    alt="Uploaded"
                                                                    className="picture__img"
                                                                />
                                                            ) : image ? (<img
                                                                src={URL.createObjectURL(image)}
                                                                alt="Uploaded"
                                                                className="picture__img"
                                                            />) : (
                                                                <Box
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    justifyContent="center"
                                                                    alignItems="center"
                                                                >
                                                                    <UploadIcon />
                                                                    <Text>Upload Image</Text>
                                                                </Box>
                                                            )}
                                                        </span>
                                                    </label>
                                                    <Field
                                                        name="image"
                                                        render={({ field, form }) => (
                                                            <InputImage
                                                                name="image"
                                                                label="Image"
                                                                placeholder={`Enter Image`}
                                                                className="picture__input"
                                                                id="picture__input"
                                                                form={form}
                                                                field={field}
                                                                setIsImage={setIsImage}
                                                                handleImageChange={(file) =>
                                                                    handleImageChange(form.setFieldValue, file,)
                                                                } // Pass setFieldValue
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </Box>
                                        </Flex>
                                        <Divider my="20px" />
                                        <Flex
                                            // justifyContent="space-between"
                                            width="100%"
                                            flexWrap={{
                                                "2xl": "wrap",
                                                xl: "wrap",
                                                lg: "wrap",
                                                md: "wrap",
                                                sm: "wrap",
                                            }}
                                        // alignItems="center"
                                        >
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Field
                                                    name="dashRepeat"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name="dashRepeat"
                                                            label="Dash Repeat"
                                                            placeholder={`Enter Dash Repeat`}
                                                            form={form}
                                                            field={field}
                                                            type="number"
                                                            isManual={true}
                                                            handleInputChange={(e) => {
                                                                handleDashRepeatChange(e, form);
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Box>

                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Field
                                                    name="feeder"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name="feeder"
                                                            label="Feeder"
                                                            placeholder={`Enter Feeder`}
                                                            form={form}
                                                            field={field}
                                                            type="number"
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Button
                                                    mt={{
                                                        "2xl": "28px",
                                                        xl: "28px",
                                                        lg: "28px",
                                                        md: "0px",
                                                        sm: "0px",
                                                    }}
                                                    onClick={() => {
                                                        generateTableData(values);
                                                    }}
                                                >
                                                    Add Feeder
                                                </Button>
                                            </Box>
                                        </Flex>
                                        {values?.feeder > 0 &&
                                            values?.feeder !== "" &&
                                            tableData?.length > 0 &&
                                            values?.feeder == tableData?.length && (
                                                <Flex mt="4px" className="design-wrraper">
                                                    <Card
                                                        overflowX={{ sm: "scroll", xl: "hidden" }}
                                                        pb="0px"
                                                        className="common-table"
                                                    >
                                                        <CardHeader
                                                            p="6px 0px 0px 0px"
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            flexDirection={{ sm: "column", md: "row" }}
                                                        >
                                                            {windowWidth <= 768 && <Divider my="10px" />}
                                                            <Text
                                                                fontSize="xl"
                                                                color={textColor}
                                                                fontWeight="bold"
                                                                marginBottom={{
                                                                    "2xl": "0",
                                                                    xl: "0",
                                                                    lg: "0",
                                                                    md: "20px",
                                                                    sm: "20px",
                                                                }}
                                                            >
                                                                Feeder
                                                            </Text>
                                                        </CardHeader>
                                                        {windowWidth >= 768 ? (
                                                            <CardBody className={"design-wrraper"}>
                                                                <DataTable
                                                                    columns={columns}
                                                                    data={tableData}
                                                                    highlightOnHover
                                                                    pointerOnHover
                                                                    theme={2 === 1 ? "dark" : "default"}
                                                                    responsive={true}
                                                                    ThemeContext={{
                                                                        background: 2 === 1 ? "red" : "green",
                                                                    }}
                                                                />
                                                            </CardBody>
                                                        ) : (
                                                            <Flex
                                                                width="100%"
                                                                flexWrap={{
                                                                    "2xl": "wrap",
                                                                    xl: "wrap",
                                                                    lg: "wrap",
                                                                    md: "wrap",
                                                                    sm: "wrap",
                                                                }}
                                                            >
                                                                {tableData?.map((row) => {
                                                                    return (
                                                                        <>
                                                                            <Box
                                                                                mr={{
                                                                                    "2xl": "6px",
                                                                                    xl: "5px",
                                                                                    lg: "4.5px",
                                                                                    md: "4px",
                                                                                    sm: "0px",
                                                                                }}
                                                                                w={{
                                                                                    "2xl": "19.5%",
                                                                                    xl: "24%",
                                                                                    lg: "32.5%",
                                                                                    md: "49%",
                                                                                    sm: "100%",
                                                                                }}
                                                                            >
                                                                                <Field
                                                                                    name={`card-${row}`}
                                                                                    render={({ field, form }) => (
                                                                                        <FormControl
                                                                                            isInvalid={
                                                                                                form?.errors[`card-${row}`] &&
                                                                                                form?.touched[`card-${row}`]
                                                                                            }
                                                                                            {...controlStyles}
                                                                                        >
                                                                                            <FormLabel
                                                                                                ms="4px"
                                                                                                mb="2px"
                                                                                                fontSize="1.1rem"
                                                                                                fontWeight="700"
                                                                                                color="#718096"
                                                                                            >
                                                                                                {`Card ${row}`}
                                                                                            </FormLabel>
                                                                                            <Input
                                                                                                {...field}
                                                                                                name={`card-${row}`}
                                                                                                placeholder={`Enter Card ${row}`}
                                                                                                type="number"
                                                                                                autoComplete='off'
                                                                                                onChange={(e) => {
                                                                                                    handleCardChange(e, form, row);
                                                                                                }}
                                                                                            />
                                                                                            <ErrorMessage name={`card-${row}`}>
                                                                                                {(msg) => (
                                                                                                    <FormErrorMessage
                                                                                                        m="0"
                                                                                                        alignItems="start"
                                                                                                        fontSize=".8rem"
                                                                                                        pt="4px"
                                                                                                        fontWeight="bold"
                                                                                                    >
                                                                                                        {msg}
                                                                                                    </FormErrorMessage>
                                                                                                )}
                                                                                            </ErrorMessage>
                                                                                        </FormControl>
                                                                                    )}
                                                                                />
                                                                            </Box>
                                                                            <Box
                                                                                mr={{
                                                                                    "2xl": "6px",
                                                                                    xl: "5px",
                                                                                    lg: "4.5px",
                                                                                    md: "4px",
                                                                                    sm: "0px",
                                                                                }}
                                                                                w={{
                                                                                    "2xl": "19.5%",
                                                                                    xl: "24%",
                                                                                    lg: "32.5%",
                                                                                    md: "49%",
                                                                                    sm: "100%",
                                                                                }}
                                                                            >
                                                                                <Field
                                                                                    name={`pick-${row}`}
                                                                                    render={({ field, form }) => (
                                                                                        <InputField
                                                                                            name={`pick-${row}`}
                                                                                            label={`Pick ${row}`}
                                                                                            placeholder={`Enter Pick ${row}`}
                                                                                            form={form}
                                                                                            field={field}
                                                                                            type="number"
                                                                                            disabled={true}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </Box>
                                                                            <Flex w="100%" justifyContent="space-between" mb="4px">
                                                                                <Field
                                                                                    name={`ground`}
                                                                                    render={({ field, form }) => (
                                                                                        <>
                                                                                            <Box
                                                                                                w="48%"
                                                                                                style={
                                                                                                    form.values.ground !== row
                                                                                                        ? btnColor
                                                                                                        : btnSelected
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    handleGroundPallu(
                                                                                                        form,
                                                                                                        "ground",
                                                                                                        row
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                Ground
                                                                                            </Box>
                                                                                            <ErrorMessage name={"ground"}>
                                                                                                {(msg) => (
                                                                                                    <FormErrorMessage
                                                                                                        m="0"
                                                                                                        alignItems="start"
                                                                                                        fontSize=".8rem"
                                                                                                        pt="4px"
                                                                                                        fontWeight="bold"
                                                                                                    >
                                                                                                        {msg}
                                                                                                    </FormErrorMessage>
                                                                                                )}
                                                                                            </ErrorMessage>
                                                                                        </>
                                                                                    )}
                                                                                />
                                                                                <Field
                                                                                    name={`pallu`}
                                                                                    render={({ field, form }) => (
                                                                                        <>
                                                                                            <Box
                                                                                                w="48%"
                                                                                                style={
                                                                                                    form.values.pallu !== row
                                                                                                        ? btnColor
                                                                                                        : btnSelected
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    handleGroundPallu(
                                                                                                        form,
                                                                                                        "pallu",
                                                                                                        row
                                                                                                    );
                                                                                                }}
                                                                                            >
                                                                                                Pallu
                                                                                            </Box>
                                                                                            <ErrorMessage name={"pallu"}>
                                                                                                {(msg) => (
                                                                                                    <FormErrorMessage
                                                                                                        m="0"
                                                                                                        alignItems="start"
                                                                                                        fontSize=".8rem"
                                                                                                        pt="4px"
                                                                                                        fontWeight="bold"
                                                                                                    >
                                                                                                        {msg}
                                                                                                    </FormErrorMessage>
                                                                                                )}
                                                                                            </ErrorMessage>
                                                                                        </>
                                                                                    )}
                                                                                />
                                                                            </Flex>
                                                                        </>
                                                                    );
                                                                })}
                                                            </Flex>
                                                        )}
                                                    </Card>
                                                </Flex>
                                            )}
                                        <Divider my="20px" />
                                        <Flex
                                            width="100%"
                                            flexWrap={{
                                                "2xl": "wrap",
                                                xl: "wrap",
                                                lg: "wrap",
                                                md: "wrap",
                                                sm: "wrap",
                                            }}
                                        >
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Field
                                                    name="finalCut"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name="finalCut"
                                                            label="Final Cut"
                                                            placeholder={`Enter Final Cut`}
                                                            form={form}
                                                            field={field}
                                                            type="number"
                                                            disabled={true}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Field
                                                    name="totalCards"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name="totalCards"
                                                            label="Total Cards"
                                                            placeholder={`Enter Total Cards`}
                                                            form={form}
                                                            field={field}
                                                            type="number"
                                                            disabled={true}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Box
                                                mr={{
                                                    "2xl": "6px",
                                                    xl: "5px",
                                                    lg: "4.5px",
                                                    md: "4px",
                                                    sm: "0px",
                                                }}
                                                w={{
                                                    "2xl": "19.5%",
                                                    xl: "24%",
                                                    lg: "32.5%",
                                                    md: "49%",
                                                    sm: "100%",
                                                }}
                                            >
                                                <Field
                                                    name="avgPick"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name="avgPick"
                                                            label="Avg Pick"
                                                            placeholder={`Enter Avg Pick`}
                                                            form={form}
                                                            field={field}
                                                            type="number"
                                                            disabled={true}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        </Flex>
                                        {/* Add your submit button or other form elements here */}
                                        <Button mt="10px" colorScheme="blue" type="submit">
                                            Save Desing
                                        </Button>
                                    </form>
                                )}
                            </Formik>
                        </Card>
                    )}
                    <ToastContainer autoClose={2000} />
                    <style>
                        {`
                .rdt_Pagination button[disabled] svg {
                    fill: ${disabledButtonStyle.fill};
                }
                .rdt_Pagination button:not([disabled]) svg {
                    fill: ${enabledButtonStyle.fill};
                }
                `}
                    </style>
                </>
            }
        </Flex>
    );
}

export default Design;
