import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorMode, useColorModeValue } from "@chakra-ui/react"
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
import { SearchBar } from "components/Navbars/SearchBar/SearchBar.js";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { modelData } from "redux/action/index.js";
import { InputField } from "components/InputFiled/index.jsx";
import * as Yup from "yup";
import { InputSelectBox } from "components/InputFiled/index.jsx";
import { BackIcon } from "components/Icons/Icons.js";

const AddToProcess = ({ setIsAddPage, setIsFetch, colorCode, isAddOrder, setIsAddOrder, setIsProcess }) => {
    const { getApi, postApi, deleteApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const selected = useSelector((state) => state.selected);
    const [isFetchMachine, setIsFetchMachine] = useState(false);
    const [filterText, setFilterText] = useState("");
    const textColor = useColorModeValue("gray.500", "white");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [machineOptions, setMachineOptions] = useState([]);
    const [btnDisable, setBtnDisable] = useState(false);
    const { colorMode } = useColorMode();
    const disabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-400)" : "var(--chakra-colors-gray-700)",
    };

    const enabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-700)" : "var(--chakra-colors-gray-400)",
    };
    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/order/findAllOrders/${selected?.parentSelectedData?.user?.orderId}`
            const body = {
                limit: 20,
                offset: 0
            }
            const response = await postApi(url, body);
            setData(response?.pageItems?.orders);
            const machineUrl = `${process.env.REACT_APP_HOST}/api/machine/findMachine`;
            const machineResponse = await getApi(machineUrl);
            setMachineOptions(machineResponse?.pageItems?.map(item => item.machine))
            setIsLoading(false);
            setIsFetchMachine(false);
        } catch (error) {
            setIsError(true);
            setError(error);
            setIsFetchMachine(false);
        }
    };

    useEffect(() => {
        if (isFetchMachine == true) {
            fetchData();
        }
    }, [isFetchMachine, selected.isEdit]);

    useEffect(() => {
        fetchData();
        const model = {
            btnTitle: "",
            page: "AddToProcess",
            fieldData: [
                {
                    name: "Pcs On machine",
                    type: "number",
                },
                {
                    name: "Machine No",
                    type: "number",
                }
            ]
        }
        dispatch(modelData(model));
    }, []);

    if (isError) return <h1>{error?.message}</h1>;

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            id: (row) => row.id,
        },
        {
            name: 'Design',
            selector: (row) => row.design,
            sortable: true,
        },
        {
            name: 'Ground Color',
            selector: (row) => row.groundColor,
            sortable: true,
        },
        {
            name: 'PCS',
            selector: (row) => row.pcs,
            sortable: true,
        },
        {
            name: 'Pending Pcs',
            selector: (row) => row.pendingPcs,
            sortable: true,
        },
        {
            name: 'Process',
            cell: (row) => <button onClick={() => {
                setIsDialogOpen(true);
                dispatch(modelEdit(true));
                dispatch(modelDelete(false));
                dispatch(selectData(row));
            }
            }>Process</button>,
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
        setBtnDisable(true);
        try {
            const apiUrl = `${process.env.REACT_APP_HOST}/api/order/createProcessOrder/${selected.parentSelectedData?.user?.orderId}/${selected.selectData?.user?.tokenId}`;
            let body = { ...values };

            let headers = {};
            // Make the callback function inside .then() async
            postApi(apiUrl, body, headers)
                .then(async (response) => {
                    // You can access the response data using apiOtpResponse in your component
                    toast.success(response?.message || "New Data ADD successful!");
                    dispatch(modelEdit(false));
                    dispatch(modelDelete(false));
                    setSubmitting(false);
                    handleDialogClose();
                    setIsFetchMachine(true);
                    setBtnDisable(false);
                })
                .catch((error) => {
                    toast.error(error?.message || "Please Try After Sometime");
                    setBtnDisable(false);
                });

        } catch (error) {
            toast.error(error?.message || "Please Try After Sometime");
            setBtnDisable(false);
        }
    };
    const validationSchema = Yup.object().shape({
        pcsOnMachine: Yup.number().required('Pieces on machine is required').positive('Pieces on machine must be a positive number'),
        machineNo: Yup.string().required('Machine number is required'),
    });

    const initialValues = {
        pcsOnMachine: "", // Initial value for pieces on machine
        machineNo: "", // Initial value for machine number
    };

    return (
        <Box mt="25px">
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
                                dispatch(selectData({}));
                                setIsFetch(true);
                                setIsAddOrder(false);
                                setIsProcess(false);
                            }}
                        />
                        <Text fontSize="xl" color={textColor} fontWeight="bold">
                            Process Order
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
                                <Flex direction="column" >
                                    <Box
                                        w={{
                                            "2xl": "100%",
                                            xl: "100%",
                                            lg: "100%",
                                            md: "100%",
                                            sm: "100%",
                                        }}>
                                        <Field
                                            name="pcsOnMachine"
                                            render={({ field, form }) => (
                                                <InputField
                                                    name='pcsOnMachine'
                                                    label='PCS On Machine'
                                                    placeholder={`Enter PCS On Machine`}
                                                    form={form}
                                                    field={field}
                                                    type='number'
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box
                                        w={{
                                            "2xl": "100%",
                                            xl: "100%",
                                            lg: "100%",
                                            md: "100%",
                                            sm: "100%",
                                        }}>
                                        <Field
                                            name="machineNo"
                                            render={({ field, form }) => (
                                                <InputSelectBox
                                                    name='machineNo'
                                                    label='Machine No'
                                                    placeholder={`Enter Machine No`}
                                                    form={form}
                                                    field={field}
                                                    options={machineOptions}
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
                                <Button colorScheme='blue' type='submit' disabled={btnDisable}>Process Order</Button>
                            </ModalFooter>
                        </Form>
                    </Formik>
                </ModalContent>
            </Modal>
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
        </Box>
    )
}

export default AddToProcess