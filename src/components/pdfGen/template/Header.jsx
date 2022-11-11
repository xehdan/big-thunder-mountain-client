import React from 'react';
import {Image} from "@react-pdf/renderer";

function Header(props) {
    const {deb} = props
    return (
        <Image style={{ width: 595, height: 80 }} fixed src="/Header.jpg" debug={deb} />
    );
}

export default Header;