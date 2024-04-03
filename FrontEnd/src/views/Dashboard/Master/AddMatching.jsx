import { Box, Button, Flex, ModalBody, ModalFooter, Text, useColorModeValue, Spinner } from '@chakra-ui/react'
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import { BackIcon } from 'components/Icons/Icons';
import { InputField } from 'components/InputFiled';
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { modelEdit } from 'redux/action';
import * as Yup from 'yup';
import { modelData } from 'redux/action';
import CommonTable from "components/CommonTable"
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { totalRowsCount } from "redux/action";
import { setTableinitialState } from "redux/action";
import { useApi } from 'network/api';
import AddButton from 'components/AddButton/AddButton';
import { parentSelectedData } from 'redux/action';

function AddMatching({ setIsAddPage, setIsFetch, colorCode, setColorCode }) {
    const { getApi } = useApi();
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);
    const textColor = useColorModeValue("gray.500", "white");
    const [isFetchMatching, setIsFetchMatching] = useState(false);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const putUrl = "/api/Matching/editMatching"
    const deleteUrl = "/api/Matching/deleteMatching"
    const postUrl = "/api/matching/createMatching"
    const model = {
        btnTitle: "Add Matching",
        page: "Editmatching",
        fieldData: []
    }
    const numOfFields = selected?.selectData?.user?.feeder || 6;
    for (let i = 1; i <= numOfFields; i++) {
        let fieldName = `f${i}`;

        if (i === selected?.parentSelectedData?.user?.ground) {
            fieldName += " (Ground)";
        } else if (i === selected?.parentSelectedData?.user?.pallu) {
            fieldName += " (Pallu)";
        } else {
            fieldName += " (Select)";
        }

        model.fieldData.push({
            label: fieldName,
            name: fieldName,
            type: "select",
            option: colorCode
        });
    }

    const initialValues = {
        name: selected?.selectData?.name || '', // Set default initial value for "name"
        pick: selected?.selectData?.pick || '', // Set default initial value for "pick"
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        pick: Yup.string().required('Pick is required'),
    });
    function optimizePageItems(pageItems) {
        return pageItems.map(item => {
            const { feeders, ...rest } = item;
            return { ...rest, ...feeders };
        });
    }


    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/matching/listOfMatching?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`;
            const body = {
                name: selected?.selectData?.user?.name,
                pick: selected?.selectData?.user?.pick
            };
            const headers = {
                'Content-Type': 'application/json' // Assuming you're sending JSON data
            };

            const response = await getApi(url, headers, body);

            // Optimized pageItems array
            let optimizedPageItems = optimizePageItems(response?.pageItems);
            setData(optimizedPageItems);
            setIsLoading(false);
            setIsFetch(false);
            dispatch(totalRowsCount(response?.total || 0));
        } catch (error) {
            setIsFetch(false);
            setIsError(true);
            setError(error);
        }
    };

    useEffect(() => {
        if (isFetchMatching == true) {
            setIsFetchMatching(false);
            fetchData();
        }
    }, [isFetchMatching == true, selected.isEdit == false]);

    useEffect(() => {
        dispatch(setTableinitialState());
        dispatch(modelData(model));
        setIsFetchMatching(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination?.currentPage, pagination?.pageSize]);

    const handleSubmit = () => {

    }
    return (
        <>
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
                                    setIsFetch(true)
                                    dispatch(parentSelectedData(null))
                                }}
                            />
                            <Text fontSize="xl" color={textColor} fontWeight="bold">
                                Edit Matching
                            </Text>
                        </Flex>
                    </CardHeader>
                    <Box>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <Flex
                                    // justifyContent="space-between"
                                    width="100%"
                                    flexWrap={{
                                        "2xl": "6px",
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
                                                    type='text'
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
                                            name="pick"
                                            render={({ field, form }) => (
                                                <InputField
                                                    name="pick"
                                                    label="Pick"
                                                    placeholder={`Enter Pick`}
                                                    form={form}
                                                    field={field}
                                                    type='text'
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
                                        <Box
                                            mt={{
                                                "2xl": "28px",
                                                xl: "28px",
                                                lg: "28px",
                                                md: "0%",
                                                sm: "0%",
                                            }}>
                                            <AddButton
                                                url={postUrl} setIsFetch={setIsFetchMatching} toast={toast} />
                                        </Box>
                                    </Box>
                                </Flex>
                            </Form>
                        </Formik>
                        <Box mt="25px">
                            <CommonTable
                                data={data}
                                isLoading={isLoading}
                                isError={isError}
                                error={error}
                                page="Editmatching"
                                tableTitle="Matchings Data"
                                url={putUrl}
                                deleteUrl={deleteUrl}
                                setIsFetch={setIsFetchMatching}
                                toast={toast}
                            />
                        </Box>
                    </Box>
                    <ToastContainer autoClose={2000} />
                </Card>
            }
        </>
    )
}

export default AddMatching