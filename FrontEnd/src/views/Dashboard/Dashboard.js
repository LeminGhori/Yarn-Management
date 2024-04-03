import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useColorMode,
  Box,
} from "@chakra-ui/react";
// Custom components
import Card from "../../components/Card/Card.js";
import CardBody from "../../components/Card/CardBody.js";
import CardHeader from "../../components/Card/CardHeader.js";
import TablesTableRow from "../../components/Tables/TablesTableRow";
import React, { useState } from "react";
import { tablesProjectData, tablesTableData } from "variables/general";
import { InputButton } from "components/InputFiled/index.jsx";
import { InputCheckBox } from "components/InputFiled/index.jsx";
import { InputField } from "components/InputFiled/index.jsx";
import { InputRadioButton } from "components/InputFiled/index.jsx";
import { InputSelectBox } from "components/InputFiled/index.jsx";
import { InputAutoComplete } from "components/InputFiled/index.jsx";
import { InputMultiSelect } from "components/InputFiled/index.jsx";
import Select from 'react-select';
import CommonTable from "../../components/CommonTable"
export default function Dashboard() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgForm = useColorModeValue("white", "navy.800");
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      {/* <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Authors Table
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th pl="0px" borderColor={borderColor} color="gray.400">
                  Author
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Function
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Status
                </Th>
                <Th borderColor={borderColor} color="gray.400">
                  Employed
                </Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {tablesTableData.map((row, index, arr) => {
                return (
                  <TablesTableRow
                    name={row.name}
                    logo={row.logo}
                    email={row.email}
                    subdomain={row.subdomain}
                    domain={row.domain}
                    status={row.status}
                    date={row.date}
                    isLast={index === arr.length - 1 ? true : false}
                    key={index}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card> */}
      <CommonTable />
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <Flex
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
          mb={{ sm: "10px", md: "30px", lg: "60px" }}
          mt={{ base: "50px", md: "20px" }}
        >
          <Flex
            direction="column"
            w="445px"
            background="transparent"
            borderRadius="15px"
            p={{ sm: "20px", md: "30px", lg: "40px" }}
            mx={{ base: "100px" }}
            m={{ base: "20px", md: "auto", sm: "0" }}
            bg={bgForm}
            boxShadow={useColorModeValue(
              "0px 5px 14px rgba(0, 0, 0, 0.05)",
              "unset"
            )}
          >
            {/* <Box>
              <InputField
                label="Name"
                placeholder="Enter Name"
                name="name"
                isError={false}
                inputType="text"
              />
            </Box>
            <Box>
              <InputCheckBox label="Yes" isError={false} />
            </Box>
            <Box>
              <InputRadioButton
                label="Gender"
                options={[
                  {
                    value: "male",
                    label: "male",
                  },
                  {
                    value: "female",
                    label: "female",
                  },
                ]}
                isError={false}
              />
            </Box>
            
             */}
            {/* <Box>
              <InputSelectBox
                name="City"
                options={["surat", "ahemdabad"]}
                placeholder="Select AnyOne"
                isError={false}
                label="City"
              />
            </Box> */}
            {/* <Box id="multi-select">
              <InputMultiSelect
                label="Gender"
                options={[
                  { value: "ghana", label: "Ghana" },
                  { value: "nigeria", label: "Nigeria" },
                  { value: "kenya", label: "Kenya" },
                  { value: "southAfrica", label: "South Africa" },
                  { value: "unitedStates", label: "United States" },
                  { value: "canada", label: "Canada" },
                  { value: "germany", label: "Germany" }
                ]}
                isError={false}
              />
            </Box> */}
            <Box id="multi-select">
              <Select
                autoComplete='off'
                className="basic-single"
                classNamePrefix="select"
                defaultValue="ghana"
                // isLoading={isLoading}
                isClearable={true}
                isSearchable={true}
                name="color"
                options={[
                  { value: "ghana", label: "Ghana" },
                  { value: "nigeria", label: "Nigeria" },
                  { value: "kenya", label: "Kenya" },
                  { value: "southAfrica", label: "South Africa" },
                  { value: "unitedStates", label: "United States" },
                  { value: "canada", label: "Canada" },
                  { value: "germany", label: "Germany" }
                ]}
              />
            </Box>
            <Box>
              <InputButton label="Submit" />
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
