import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Card from "../../components/Card/Card.js";
import CardBody from "../../components/Card/CardBody.js";
import CardHeader from "../../components/Card/CardHeader.js";
import { useColorModeValue, Text, Modal, ModalContent, ModalBody, ModalFooter, Button, ModalOverlay, useColorMode, background } from "@chakra-ui/react";
import { SearchBar } from "components/Navbars/SearchBar/SearchBar.js";
import CommonModal from "../CommonModal/CommonModal.js";
import { useDispatch, useSelector } from "react-redux";
import { modelEdit } from "redux/action/index.js";
import { selectData } from "redux/action/index.js";
import { modelDelete } from "redux/action/index.js";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { useApi } from "network/api";
import { parentSelectedData } from "redux/action/index.js";
import { currentPageState } from "redux/action/index.js";
import { pageSize } from "redux/action/index.js";
const Filtering = ({ error, isError, isLoading, data, page, tableTitle, url, setIsAddPage, setIsProcess, setIsFetch, deleteUrl, setIsMatchingTable, setIsEditApi, isPagination = true, handleEditOrderData, setIsStatusTable = false }) => {
    const { getApi, putApi, deleteApi, postApi } = useApi();
    const [filterText, setFilterText] = useState("");
    const textColor = useColorModeValue("gray.500", "white");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const dispatch = useDispatch();
    const modelData = useSelector((state) => state.user.modelData);
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);
    const { colorMode } = useColorMode();

    const customStyles = {
        rdt_TableCol: {
            style: {
                whiteSpace: 'pre-line',
                wordWrap: 'break-word', // For pre-wrap behavior
            },
        },
    };

    const disabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-400)" : "var(--chakra-colors-gray-700)",
    };

    const enabledButtonStyle = {
        fill: colorMode === "light" ? "var(--chakra-colors-gray-700)" : "var(--chakra-colors-gray-400)",
    };
    const [isProcessButton, setIsProcessButton] = useState(false);

    if (isError) return <h1>{error?.message}</h1>;
    const handleEdit = (row, handleType = "") => {
        if (modelData?.page !== "Design" && modelData?.page !== "Matching" && modelData?.page !== "Orders" && modelData?.page !== "EditOrder") {
            setIsDialogOpen(true);
            dispatch(modelEdit(true));
            dispatch(modelDelete(false));
            dispatch(selectData(row));
        } else {
            const sanitizeUndefined = (obj) => {
                const sanitizedObj = {};
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        sanitizedObj[key] = obj[key] !== undefined ? obj[key] : '';
                    }
                }
                return sanitizedObj;
            };
            const sanitizedRow = sanitizeUndefined(row);
            if (modelData?.page === "EditOrder") {
                dispatch(modelEdit(true));
                dispatch(selectData(row));
                dispatch(modelDelete(false));
                handleEditOrderData(row);
                setIsEditApi(true);
            } else if (handleType === "process") {
                setIsProcess(true);
                setIsAddPage(true);
                dispatch(modelEdit(false));
                dispatch(parentSelectedData(row));
            } else {
                setIsAddPage(true);
            }
            if (modelData?.page !== "Matching") {
                dispatch(modelEdit(true));
            }
            if (modelData?.page === "Matching") {
                dispatch(parentSelectedData(row));
            }
            dispatch(modelDelete(false));
            dispatch(selectData(sanitizedRow));
        }
    };

    const handleDelete = (row) => {
        setIsDeleteOpen(true);
        // dispatch(modelEdit(false));
        dispatch(modelDelete(true));
        dispatch(selectData(row));
    };

    const handleComplete = (row) => {
        setIsDeleteOpen(true);
        dispatch(modelEdit(false));
        dispatch(modelDelete(true));
        dispatch(selectData(row));
        setIsProcessButton(true);
    }

    const handleSaleYarn = (row) => {
        setIsDialogOpen(true);
        dispatch(modelEdit(true));
        dispatch(modelDelete(false));
        dispatch(selectData(row));
    }

    const columnsFromModelData = modelData?.fieldData?.map((field, index) => {
        if (field && !field.displayNone) {
            if (field.type === 'file') {
                return {
                    name: field.name,
                    cell: (row) => {
                        const [imageSrc, setImageSrc] = useState(null);
                        useEffect(() => {
                            if (row?.user?.image) {
                                const fetchImage = async () => {
                                    try {
                                        const url = `${process.env.REACT_APP_HOST}/api/design/photo/${row?.user?.image}`;
                                        const response = await fetch(url);
                                        if (response.ok) {
                                            const blob = await response.blob();
                                            const objectUrl = URL.createObjectURL(blob);
                                            setImageSrc(objectUrl);
                                        } else {
                                            console.error('Failed to fetch image');
                                            setImageSrc(null); // or set a default image
                                        }
                                    } catch (error) {
                                        console.error('Error fetching image:', error);
                                        setImageSrc(null); // or set a default image
                                    }
                                };

                                fetchImage();
                            }
                        }, [row?.user?.image]);

                        return imageSrc ? (
                            <img src={imageSrc} alt={field.name} style={{ maxWidth: '50px' }} />
                        ) : (
                            <img src='' alt="not Found" style={{ maxWidth: '50px' }} />
                        );
                    },
                    sortable: false, // Images typically are not sortable
                    id: Date.now().toString(36) + Math.random(10000).toString(36).substr(2, 5), // Unique ID for images
                };
            } else if (field.type == "process") {
                return {
                    name: field.name,
                    selector: (row) => <Button alignItems="center" padding="10px 27px !important" textAlign="center" display="flex" onClick={() => handleEdit(row, "process")}>Process</Button>,
                    sortable: true,
                    id: Date.now().toString(36) + Math.random(10000).toString(36).substr(2, 5),
                }
            } else if (field.type === "Matching-table") {
                return {
                    name: field.name,
                    selector: (row) => <Button alignItems="center" padding="10px 27px !important" textAlign="center" display="flex" onClick={() => {
                        setIsMatchingTable(true);
                        dispatch(parentSelectedData(row));
                    }}>{
                            row?.user?.matching
                        }</Button>,
                    sortable: true,
                    id: Date.now().toString(36) + Math.random(10000).toString(36).substr(2, 5),
                }
            } else if (field.type === "Status-table") {
                return {
                    name: field.name,
                    selector: (row) => <Button alignItems="center" padding="10px 27px !important" textAlign="center" display="flex" onClick={() => {
                        setIsStatusTable(true);
                        dispatch(parentSelectedData(row));
                    }}>Status</Button>,
                    sortable: true,
                    id: Date.now().toString(36) + Math.random(10000).toString(36).substr(2, 5),
                }
            }
            else {
                return {
                    name: field.name,
                    selector: (row) =>
                        row[field.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/(\([^)]*\))/g, '')],
                    sortable: true,
                    id: Date.now().toString(36) + Math.random(10000).toString(36).substr(2, 5),
                };
            }
        }
    });
    const datas = columnsFromModelData?.filter(column => column !== undefined)

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            id: (row) => row.id,
        },
        ...(Array.isArray(columnsFromModelData) ? datas : []), // Include dynamically generated columns here
    ];

    if (modelData?.page === "ProcessOrder") {
        columns.push(
            {
                name: 'Complete',
                cell: (row) => <button onClick={() => handleComplete(row)}>Complete</button>,
            },
            {
                name: 'Delete',
                cell: (row) => <button onClick={() => handleDelete(row)}>Delete</button>,
            }
        );
    } else if (modelData?.page === "StockYarn") {
        columns.push(
            {
                name: 'Sale',
                cell: (row) => <button onClick={() => handleSaleYarn(row)}>Sale</button>,
                id: Date.now().toString(36) + Math.random(10000).toString(36).substr(2, 5),
            },
            {
                name: 'Delete',
                cell: (row) => <button onClick={() => handleDelete(row)}>Delete</button>,
                id: Date.now().toString(36) + Math.random(10000).toString(36).substr(2, 5),
            }
        );
    } else if (modelData?.page !== "DeliveredOrders" && modelData?.page !== "SareeStock" && modelData?.page !== "OrderStock" && modelData?.page !== "RemainingYarnStock" && modelData?.page !== "OrderPendingYarnStock" && modelData?.page !== "MachineReport" && modelData?.page !== "DesignReport" && modelData?.page !== "OrderProcessStockReport") {
        columns.push(
            {
                name: 'Edit',
                cell: (row) => <button onClick={() => handleEdit(row)}>Edit</button>,
                id: Date.now().toString(36) + Math.random(10000).toString(36).substr(2, 5),
            },
            {
                name: 'Delete',
                cell: (row) => <button onClick={() => handleDelete(row)}>Delete</button>,
                id: Date.now().toString(36) + Math.random(10000).toString(36).substr(2, 5),
            }
        );
    }


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
                    if (column.selector && column) {
                        rowData[column.name.split(' ').map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)).join('').replace(/(\([^)]*\))/g, '')] = column.selector(user);
                    }
                    rowData['user'] = user;
                });
                // if (modelData?.page == "Matching") {
                //     rowData['image'] = user?.image
                // }
                rowData['id'] = index + 1;
                return rowData;
            })
        : [];

    const handleDialogClose = () => {
        setIsDeleteOpen(false);
        setIsProcessButton(false);
        dispatch(selectData({}));
    }
    const handleDeleteApi = () => {
        try {
            const apiUrl = `${process.env.REACT_APP_HOST}${deleteUrl}`;
            let tokenId = selected.selectData.user.tokenId;
            if (modelData.page === "Orders") {
                tokenId = selected?.selectData?.user?.orderId
            }
            if (modelData.page === "ProcessOrder") {
                tokenId = `${selected?.selectData?.user?.orderId}/${selected?.selectData?.user?.tokenId}/${selected?.selectData?.user?.machineId}`
            }
            deleteApi(`${apiUrl}/${tokenId}`)
                .then(async (response) => {
                    // You can access the response data using apiOtpResponse in your component
                    toast.success(response?.message || "Data Deleted successful!");
                    // dispatch(modelEdit(false));
                    dispatch(modelDelete(false));
                    setIsDeleteOpen(false);
                    setIsFetch(true);
                    dispatch(selectData({}));
                })
                .catch((error) => {
                    toast.error(error?.message || "Please Try After Sometime");
                    dispatch(selectData({}));
                });
        } catch (error) {
            toast.error(error?.message || "Please Try After Sometime");
        }
        setIsDeleteOpen(false);
    }

    const handleProcessOrder = () => {
        try {
            const body = {
                "isComplete": true
            };
            const headers = {};
            const apiUrl = `${process.env.REACT_APP_HOST}${url}`;
            postApi(`${apiUrl}/${selected?.selectData?.user?.orderId}/${selected?.selectData?.user?.tokenId}/${selected?.selectData?.user?.machineId}`, body, headers)
                .then(async (response) => {
                    // You can access the response data using apiOtpResponse in your component
                    toast.success(response?.message || "Data Deleted successful!");
                    dispatch(modelEdit(false));
                    dispatch(modelDelete(false));
                    setIsDeleteOpen(false);
                    setIsFetch(true);
                    setIsProcessButton(false);
                })
                .catch((error) => {
                    toast.error(error?.message || "Please Try After Sometime");
                });
        } catch (error) {
            toast.error(error?.message || "Please Try After Sometime");
        }
        setIsDeleteOpen(false);
    }

    const handlePageChange = (page) => {
        dispatch(currentPageState(page));
    };

    const handlePerPageChange = (newPageSize, currentPage) => {
        dispatch(pageSize(newPageSize));
        dispatch(currentPageState(currentPage));
    };

    return (
        <>
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
                    <Text fontSize="xl" color={textColor} fontWeight="bold">
                        {tableTitle}
                    </Text>
                    <div className="w-3/12  my-4">
                        <div className="flex justify-center items-center">
                            <SearchBar value={filterText} setFilterText={setFilterText} />
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={tableData}
                        progressPending={isLoading}
                        pagination={isPagination}
                        highlightOnHover
                        pointerOnHover
                        theme={2 === 1 ? "dark" : "red"}
                        responsive={true}
                        customStyles={customStyles}
                        // ThemeContext={
                        //     {background: colorMode === "light" ? "" : "navy.900"}
                        // }
                        paginationServer
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        paginationTotalRows={pagination?.totalRowsCount} // Set the total count of rows
                        paginationDefaultPage={pagination?.currentPage}
                        paginationPerPage={pagination?.pageSize}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerPageChange}
                    />
                </CardBody>
            </Card>
            <Modal isOpen={isDeleteOpen} onClose={handleDialogClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody mt="30px">
                        <Text>
                            {modelData?.page === "ProcessOrder" && isProcessButton ? "Are you sure this order is Completed ?" : "Are you sure you want to delete ?"}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='gray' mr={3} onClick={handleDialogClose}>
                            No
                        </Button>
                        <Button colorScheme='blue' type='submit' onClick={() => { modelData?.page === "ProcessOrder" && isProcessButton ? handleProcessOrder() : handleDeleteApi() }}>Yes</Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
            <CommonModal
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                url={url}
                setIsFetch={setIsFetch}
            />
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
    );
};

export default Filtering;
