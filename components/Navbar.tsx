import React from 'react';
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-10 w-full items-center justify-between font-mono text-sm flex">
            <p className="flex justify-center">
                Sneakers brand detector
            </p>
            <Image
                src="/WAVE_logo.svg"
                alt="Rogue Logo"
                width={250}
                height={75}
                priority
                className="w-44 "
            />
        </nav>
    );
};

export default Navbar;