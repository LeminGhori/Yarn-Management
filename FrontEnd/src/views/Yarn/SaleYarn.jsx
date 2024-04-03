import { Box, Flex, Spinner } from "@chakra-ui/react";
import AddButton from "components/AddButton/AddButton";
import CommonTable from "components/CommonTable";
import { useApi } from "network/api";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modelData } from "redux/action";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, cssTransition } from "react-toastify";
import { totalRowsCount } from "redux/action";
import { setTableinitialState } from "redux/action";
const SaleYarn = () => {
    const { getApi } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const putUrl = "/api/yarnSales/editYarnSales"
    const deleteUrl = "/api/yarnSales/deleteYarnSales"
    const selected = useSelector((state) => state.selected);
    const pagination = useSelector((state) => state.pagination);
    const [isFetch, setIsFetch] = useState(false);
    const fetchData = async () => {
        try {
            const url = `${process.env.REACT_APP_HOST}/api/yarnSales/findYarnSales?limit=${pagination?.pageSize}&offset=${pagination?.currentPage - 1}`
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

    const fetchApisData = async () => {
        try {
            const partyUrl = `${process.env.REACT_APP_HOST}/api/party/findParty`;
            const partyResponse = await getApi(partyUrl);
            const extractedParty = partyResponse?.pageItems?.map(item => item.name);
            const colorUrl = `${process.env.REACT_APP_HOST}/api/coloryarn/findColorYarn`;
            const colorResponse = await getApi(colorUrl);
            const extractedCodes = colorResponse?.pageItems?.map(item => item.colorCode);
            const model = {
                btnTitle: "Sale Yarn",
                page: "SaleYarn",
                fieldData: [
                    {
                        name: "Date",
                        type: "date",
                    },
                    {
                        name: "Sale Party",
                        type: "select",
                        option: extractedParty,
                    },
                    {
                        name: "Buy Party",
                        type: "select",
                        option: extractedParty,
                    },
                    {
                        name: "Color Code",
                        type: "text",
                        disabled: true,
                    },
                    {
                        name: "Color Quality",
                        type: "text",
                        disabled: true,
                    },
                    {
                        name: "Denier",
                        type: "number",
                        disabled: true,
                    },
                    {
                        name: "Weight",
                        type: "number",
                    },
                    {
                        name: "Invoice No",
                        type: "text",
                        disabled: true,
                    },
                    {
                        name: "Lot No",
                        type: "text",
                        disabled: true,
                    },
                    {
                        name: "Price",
                        type: "number",
                    },
                ]
            }
            dispatch(modelData(model));
        } catch (error) {
            toast.error("Error fetching party data:", error);
        }
    }

    useEffect(() => {
        if (isFetch == true) {
            setIsFetch(false);
            fetchData();
        }
    }, [isFetch == true, selected.isEdit == false]);
    useEffect(() => {
        dispatch(setTableinitialState());
        setIsFetch(false);
        fetchApisData()
    }, []);

    useEffect(() => {
        fetchData();
    }, [pagination?.currentPage, pagination?.pageSize]);

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
                    <Box mt="25px">
                        <CommonTable
                            data={data}
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                            page="Sale Yarn"
                            tableTitle="Sale Yarn Data"
                            url={putUrl}
                            deleteUrl={deleteUrl}
                            setIsFetch={setIsFetch}
                            toast={toast}
                        />
                    </Box>
                    <ToastContainer autoClose={2000} />
                </>
            }
        </Flex>
    )
}

export default SaleYarn