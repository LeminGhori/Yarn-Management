import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorMode, useColorModeValue, Spinner } from "@chakra-ui/react"
import DataTable from "react-data-table-component";
import Card from "../../components/Card/Card.js";
import CardBody from "../../components/Card/CardBody.js";
import CardHeader from "../../components/Card/CardHeader.js";
import { useApi } from "network/api";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modelEdit, } from "redux/action/index.js";
import { selectData } from "redux/action/index.js";
import { modelDelete } from "redux/action/index.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { totalRowsCount } from "redux/action";
import { setTableinitialState } from "redux/action";
import { SearchBar } from "components/Navbars/SearchBar/SearchBar.js";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { modelData } from "redux/action/index.js";
import { InputField } from "components/InputFiled/index.jsx";
import * as Yup from "yup";
import { InputSelectBox } from "components/InputFiled/index.jsx";
import { BackIcon } from "components/Icons/Icons.js";

const CompletedOrders = () => {
    const { getApi, deleteApi, postApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);
    const [isFetch, setIsFetch] = useState(false);
    const [filterText, setFilterText] = useState("");
    const textColor = useColorModeValue("gray.500", "white");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEvent, setIsEvent] = useState('dispatch');
    const { colorMode } = useColorMode();
    const model = {
        btnTitle: "Add Orders",
        page: "Orders",
        fieldData: [
            {
                name: "settle",
                type: "number",
            },
            {
                name: "dispatch",
                type: "number",
            },
        ]
    }
    const disabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-400)" : "var(--chakra-colors-gray-700)",
    };

    const enabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-700)" : "var(--chakra-colors-gray-400)",
    };
    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/order/getAllCompleteOrder?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
            const response = await getApi(url);
            setData(response?.pageItems);
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
        setIsFetch(false);
        if (isFetch == true) {
            fetchData();
        }
    }, [isFetch, selected.isEdit]);

    useEffect(() => {
        dispatch(setTableinitialState());
        dispatch(modelData(model));
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination?.currentPage, pagination?.pageSize]);

    if (isError) return <h1>{error?.message}</h1>;

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            id: (row) => row.id,
        },
        {
            name: 'Order No',
            selector: (row) => row.orderNo,
            sortable: true,
            id: (row) => row.orderNo,
        },
        {
            name: 'Party',
            selector: (row) => row.party,
            sortable: true,
            id: (row) => row.party,
        },
        {
            name: 'Design',
            selector: (row) => row.design,
            sortable: true,
            id: (row) => row.design,
        },
        {
            name: 'Ground Color',
            selector: (row) => row.groundColor,
            sortable: true,
            id: (row) => row.groundColor,
        },
        {
            name: 'Complete Pcs',
            selector: (row) => row.completePcs,
            sortable: true,
            id: (row) => row.completePcs,
        },
        {
            name: 'Dispatch',
            cell: (row) => <button onClick={() => {
                setIsDialogOpen(true);
                dispatch(modelEdit(true));
                dispatch(modelDelete(false));
                dispatch(selectData(row));
                setIsEvent('dispatch');
            }}
            >
                Dispatch
            </button>,
        },
        {
            name: 'Settle',
            cell: (row) => <button onClick={() => {
                setIsDialogOpen(true);
                dispatch(modelEdit(true));
                dispatch(modelDelete(false));
                dispatch(selectData(row));
                setIsEvent('settle');
            }}
            >
                Settle
            </button>,
        },
    ];

    const tableData = Array.isArray(data)
        ? data
            ?.filter((item) => {
                // Split filterText into individual words
                const filterWords = filterText.toLowerCase().split(' ');

                // Check if any property of item includes any part of filterText
                return Object.entries(item).some(([key, value]) => {
                    // Exclude checking the _id property
                    if (key === '_id' || key === 'tokenId') return false;

                    if (typeof value === 'number') {
                        value = value.toString(); // Convert number to string
                    }
                    if (typeof value === 'string') {
                        const lowerCaseValue = value.toLowerCase();
                        return filterWords.every(word => lowerCaseValue.includes(word));
                    }
                    return false;
                });
            })
            ?.map((user, index) => {
                const rowData = {};

                columns.forEach((column, index) => {
                    if (column.selector) {
                        rowData[column.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('')] = column.selector(user);
                    }
                    rowData['user'] = user;
                });
                rowData['id'] = index + 1;
                return rowData;
            })
        : [];

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    }

    const handleSubmit = (values, { setSubmitting }) => {
        try {
            const body = {
                [isEvent]: values.dispatchPcs
            };
            const headers = {};
            const apiUrl = `${process.env.REACT_APP_HOST}/api/order/createCompleteOrder`;
            postApi(`${apiUrl}/${selected?.selectData?.user?.orderId}/${selected?.selectData?.user?.tokenId}`, body, headers)
                .then(async (response) => {
                    // You can access the response data using apiOtpResponse in your component
                    toast.success(response?.message || "Data Deleted successful!");
                    dispatch(modelEdit(false));
                    dispatch(modelDelete(false));
                    setIsDialogOpen(false);
                    setIsFetch(true);
                    setSubmitting(false);
                })
                .catch((error) => {
                    toast.error(error?.message || "Please Try After Sometime");
                });
        } catch (error) {
            toast.error(error?.message || "Please Try After Sometime");
        }
        setIsDialogOpen(false);
    }
    const validationSchema = Yup.object().shape({
        orderNo: Yup.string().required('Order No is required'),
        dispatchPcs: Yup.string().required(isEvent == "dispatch" ? 'Dispatch PCS is required' : ' Sellte PCS is required'),
    });

    const initialValues = {
        orderNo: selected.isEdit ? selected?.selectData?.user?.orderNo || '' : "", // Initial value for color
        dispatchPcs: selected.isEdit ? selected?.selectData?.user?.dispatchPcs || '' : "", // Initial value for item number
    };

    return (<Flex direction="column" pt={["120px", "75px", "90px"]}>
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
                <Box mt="25px" className="ProcessOrder-wrapper">
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
                            <Flex alignItems="center" gap="5px">
                                <BackIcon
                                    fontSize="1.3rem"
                                    mb="4px"
                                    cursor="pointer"
                                    onClick={() => {
                                        setIsAddPage(false);
                                        dispatch(modelEdit(false));
                                        setIsFetch(true);
                                        setIsAddOrder(false);
                                    }}
                                />
                                <Text fontSize="xl" color={textColor} fontWeight="bold">
                                    Completed Orders
                                </Text>
                            </Flex>

                            <div className="w-3/12  my-4">
                                <div className="flex justify-center items-center">
                                    <SearchBar value={filterText} setFilterText={setFilterText} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Formik>
                                <DataTable
                                    columns={columns}
                                    data={tableData}
                                    progressPending={isLoading}
                                    pagination
                                    highlightOnHover
                                    pointerOnHover
                                    theme={2 === 1 ? "dark" : "default"}
                                    responsive={true}
                                    ThemeContext={{
                                        background: 2 === 1 ? "red" : "green",
                                    }}
                                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                />
                            </Formik>
                        </CardBody>
                    </Card>
                    <Modal isOpen={isDialogOpen} onClose={handleDialogClose} >
                        <ModalOverlay />
                        <ModalContent >
                            <ModalHeader>Process Data</ModalHeader>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize={true}
                            >
                                <Form>
                                    <ModalBody>
                                        <Flex direction="column">
                                            <Box>
                                                <Field
                                                    name="orderNo"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name='orderNo'
                                                            label='Order No'
                                                            placeholder={`Enter Order No`}
                                                            form={form}
                                                            field={field}
                                                            type='text'
                                                            disabled={true}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                            <Box>
                                                <Field
                                                    name="dispatchPcs"
                                                    render={({ field, form }) => (
                                                        <InputField
                                                            name='dispatchPcs'
                                                            label={isEvent == "dispatch" ? 'Dispatch PCS' : 'Settle PCS'}
                                                            placeholder={isEvent == "dispatch" ? 'Enter Dispatch PCS' : 'Enter Settle PCS'}
                                                            form={form}
                                                            field={field}
                                                            type='number'
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        </Flex>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button colorScheme='gray' mr={3} onClick={handleDialogClose}>
                                            Close
                                        </Button>
                                        <Button colorScheme='blue' type='submit'>{isEvent === 'dispatch' ? 'Dispatch' : 'Settle'}</Button>
                                    </ModalFooter>
                                </Form>
                            </Formik>
                        </ModalContent>
                    </Modal>
                    <ToastContainer autoClose={2000} />
                </Box>
            </>
        }
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
    </Flex>
    )
}

export default CompletedOrders