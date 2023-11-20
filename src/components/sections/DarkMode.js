import React from "react";
import {
    Button,
    useColorMode,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export default function DarkMode() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Button colorScheme='gray' onClick={toggleColorMode} rightIcon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}>
            Toggle
        </Button>
    );
}