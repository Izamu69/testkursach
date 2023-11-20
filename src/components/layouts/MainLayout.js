import React from "react";
import { Flex } from "@chakra-ui/react";
import MainHeader from "../sections/MainHeader";
import Footer from "../sections/Footer";

export default function MainLayout(props) {
  return (
    <>
    <Flex
      direction="column"
      align="center"
      maxW={{ xl: "1200px" }}
      m="0 auto"
      minHeight="100vh"
      {...props}
    >
      <MainHeader />
      {props.children}
      
    </Flex>
    <Footer />
    </>
  );
}
