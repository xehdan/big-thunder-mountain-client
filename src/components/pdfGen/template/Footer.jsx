import React from 'react';
import {Image} from "@react-pdf/renderer";

function Footer(props) {
    const {deb} = props
    return (
        <Image style={{ width: 595, height: 112, position: 'absolute', bottom: 0 }} fixed src="/Footer.jpg" debug={deb} />
    );
}

export default Footer;