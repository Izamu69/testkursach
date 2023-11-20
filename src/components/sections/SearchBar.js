import React, { useState } from "react";
import { Input, useColorModeValue} from "@chakra-ui/react";

export default function SearchBar({ onSearch }) {
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <>
            <Input
                value={searchInput}
                onChange={handleChange}
                maxW="26rem"
                placeholder="Search..."
                borderColor={useColorModeValue('gray.300', 'white')}
                borderRadius="5px"
                d={{ base: 'none', md: 'block' }}
            />
        </>
    );
}
