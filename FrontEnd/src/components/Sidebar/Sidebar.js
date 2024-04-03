/*eslint-disable*/
import { HamburgerIcon } from "@chakra-ui/icons";
// chakra imports
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import IconBox from "components/Icons/IconBox";
import { HSeparator } from "components/Separator/Separator";
import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { NavLink, useLocation } from "react-router-dom";
import { UpIcon } from "components/Icons/Icons";
import { DownIcon } from "components/Icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { LogoutIcon } from "components/Icons/Icons";
import { userLogout } from "redux/action";



// FUNCTIONS

function Sidebar(props) {
  const dispatch = useDispatch();

  // to check for active links and opened collapses
  let location = useLocation();
  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const [active, setActive] = React.useState('');
  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  useEffect(() => {
    if (location.pathname == '/admin/company' || location.pathname == '/admin/party' || location.pathname == '/admin/color-yarn' || location.pathname == '/admin/design' || location.pathname == '/admin/matching') {
      setActive('Dashboard')
    }
    else if (location.pathname == '/admin/purchase-yarn' || location.pathname == '/admin/stock-yarn' || location.pathname == '/admin/sale-yarn') {
      setActive('Yarn')
    }
    activeRoute(location.pathname);
  }, []);
  // this function creates the links and collapses that appear in the sidebar (left menu)
  let activeBg = useColorModeValue("white", "navy.700");
  let inactiveBg = useColorModeValue("white", "navy.700");
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue("gray.400", "gray.400");
  let sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";
  const createLinks = (routes) => {
    // Chakra Color Mode
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <>
            <Text
              key={key}
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: "6px",
              }}
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              cursor="pointer"
              py="12px"
              onClick={() => { setActive(active === prop.name ? '' : prop.name) }}
            >
              <Flex align="center" justifyContent="space-between">
                <Flex align="center">
                  <Box width="30px">
                    {prop.icon}
                  </Box>
                  <Box>
                    {prop.name}
                  </Box>
                </Flex>
                <Box fontSize="1.5em">
                  {
                    active === prop.name ?
                      <UpIcon color='inherit' />
                      :
                      <DownIcon color='inherit' />
                  }
                </Box>
              </Flex>
            </Text>
            {active === prop.name &&
              createLinks(prop.views)
            }
          </>
        );
      }
      return (
        <NavLink to={prop.layout + prop.path} key={key}>
          {activeRoute(prop.layout + prop.path) === "active" ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              boxShadow={sidebarActiveShadow}
              bg={activeBg}
              transition={variantChange}
              mb={{
                xl: "6px",
              }}
              mx={{
                xl: "auto",
              }}
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg="blue.500"
                    color="white"
                    h="30px"
                    w="30px"
                    me="12px"
                    transition={variantChange}
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={activeColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb={{
                xl: "6px",
              }}
              mx={{
                xl: "auto",
              }}
              py="12px"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Flex>
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={inactiveBg}
                    color="blue.500"
                    h="30px"
                    w="30px"
                    me="12px"
                    transition={variantChange}
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };
  const { logo, routes } = props;

  var links = <>{createLinks(routes)}</>;
  //  BRAND
  //  Chakra Color Mode
  let sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarRadius = "20px";
  let sidebarMargins = "0px";
  var brand = (
    <Box pt={"25px"} mb="6px">
      <Text textAlign="center" fontSize="1.25rem" fontWeight="600">
        Yarn Management
      </Text>
      <HSeparator my="10px" />
    </Box>
  );
  return (
    <Box ref={mainPanel} >
      <Box display={{ sm: "none", xl: "block" }} position="fixed">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="280px"
          maxW="280px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
          borderRadius={sidebarRadius}
          overflowY="scroll"
        >
          <Box
            overflow="hidden"
            position="sticky"
            top="0"
            bg={sidebarBg}
            zIndex="111"
          >{brand}</Box>
          <Stack direction="column" mb="40px">
            <Box>{links}</Box>
            <Text
              key="LogOut"
              fontWeight="bold"
              mb={{
                xl: "6px",
              }}
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              cursor="pointer"
              py="12px"
              onClick={() => { dispatch(userLogout()); }}
            >
              <Flex align="center" justifyContent="space-between">
                <Flex align="center">
                  <Box width="30px">
                    <LogoutIcon />
                  </Box>
                  <Box>
                    LogOut
                  </Box>
                </Flex>
              </Flex>
            </Text>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

// FUNCTIONS

function SidebarResponsive(props) {
  const dispatch = useDispatch();
  // to check for active links and opened collapses
  let location = useLocation();
  const [active, setActive] = React.useState('');
  const { logo, routes, colorMode, hamburgerColor, ...rest } = props;

  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const mainPanel = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };
  useEffect(() => {
    if (location.pathname == '/admin/company' || location.pathname == '/admin/party' || location.pathname == '/admin/color-yarn' || location.pathname == '/admin/design' || location.pathname == '/admin/matching') {
      setActive('Dashboard')
    }
    else if (location.pathname == '/admin/purchase-yarn' || location.pathname == '/admin/stock-yarn' || location.pathname == '/admin/sale-yarn') {
      setActive('Yarn')
    }
    activeRoute(location.pathname);
  }, []);
  // Color Mode
  let activeBg = useColorModeValue("white", "navy.700");
  let inactiveBg = useColorModeValue("white", "navy.700");
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue("gray.400", "white");
  let sidebarActiveShadow = useColorModeValue(
    "0px 7px 11px rgba(0, 0, 0, 0.04)",
    "none"
  );
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const handleClose = () => {
    onClose();
  }
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <>
            <Text
              key={key}
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: "6px",
              }}
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              cursor="pointer"
              py="12px"
              onClick={() => { setActive(active === prop.name ? '' : prop.name) }}
            >
              <Flex align="center" justifyContent="space-between">
                <Flex align="center">
                  <Box width="30px">
                    {prop.icon}
                  </Box>
                  <Box>
                    {prop.name}
                  </Box>
                </Flex>
                <Box fontSize="1.5em">
                  {
                    active === prop.name ?
                      <UpIcon color='inherit' />
                      :
                      <DownIcon color='inherit' />
                  }
                </Box>
              </Flex>
            </Text>
            {active === prop.name &&
              createLinks(prop.views)
            }
          </>
        );
      }
      return (
        <NavLink to={prop.layout + prop.path} key={key}>
          {activeRoute(prop.layout + prop.path) === "active" ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg={activeBg}
              boxShadow={sidebarActiveShadow}
              mb={{
                xl: "6px",
              }}
              mx={{
                xl: "auto",
              }}
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              onClick={handleClose}
            >
              <Flex >
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg="blue.500"
                    color="white"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={activeColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb={{
                xl: "6px",
              }}
              mx={{
                xl: "auto",
              }}
              py="12px"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              borderRadius="15px"
              _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              onClick={handleClose}
            >
              <Flex >
                {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg={inactiveBg}
                    color="blue.500"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };

  var links = <>{createLinks(routes)}</>;

  //  BRAND

  var brand = (
    <Box pt={"25px"} mb="6px">
      <Text textAlign="center" fontSize="1.25rem" fontWeight="600">
        Yarn Management
      </Text>
      <HSeparator my="10px" />
    </Box>
  );

  // SIDEBAR
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  // Color variables
  return (
    <Flex
      display={{ sm: "flex", xl: "none" }}
      ref={mainPanel}
      alignItems="center"
      cursor="pointer"
    >
      <HamburgerIcon
        color={hamburgerColor}
        w="24px"
        h="24px"
        ref={btnRef}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="left"
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          w="280px"
          maxW="280px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          borderRadius="16px"
          bg={sidebarBackgroundColor}
        >
          <DrawerCloseButton
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="calc(100vh - 50px)" overflowY="scroll">
              <Box
                overflow="hidden"
                position="sticky"
                top="0"
                bg={sidebarBackgroundColor}
                zIndex="111"
              >{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box >{links}</Box>
                <Text
                  key="LogOut"
                  fontWeight="bold"
                  mb={{
                    xl: "6px",
                  }}
                  mx="auto"
                  ps={{
                    sm: "10px",
                    xl: "16px",
                  }}
                  cursor="pointer"
                  py="12px"
                  onClick={() => { dispatch(userLogout()); }}
                >
                  <Flex align="center" justifyContent="space-between">
                    <Flex align="center">
                      <Box width="30px">
                        <LogoutIcon />
                      </Box>
                      <Box>
                        LogOut
                      </Box>
                    </Flex>
                  </Flex>
                </Text>
              </Stack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export { Sidebar, SidebarResponsive };
export default Sidebar; // Exporting Sidebar as default if needed elsewhere
