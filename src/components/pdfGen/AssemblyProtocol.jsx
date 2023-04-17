import {Canvas, Document, Font, Page, StyleSheet, Text, View, Image} from "@react-pdf/renderer";
import React from 'react';
import pjson from "../../../package.json";
import Header from "./template/Header";
import Footer from "./template/Footer";
import PropTypes from "prop-types";
import AssemblyFloorCrudGrid from "../assembly/AssemblyFloorCrudGrid";
import moment from "moment";
import {DataTableCell, Table, TableBody, TableCell, TableHeader} from "@david.kucsai/react-pdf-table";
import bwipjs, {gs1_128} from 'bwip-js';


AssemblyFloorCrudGrid.propTypes = {
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    assembly: PropTypes.object.isRequired,
};


const getBarcodeUri = async (props) => {
    const htmlCanvas = document.createElement('canvas');
    htmlCanvas.style.width = '100px';
    htmlCanvas.style.height = '100px';

    let canvas = bwipjs.toCanvas(htmlCanvas, {
        bcid: 'datamatrix',       // Barcode type
        text: props,    // Text to encode
        padding: 3,
        textxalign: 'center',        // Always good to set this
    });

    return htmlCanvas.toDataURL('image/png', 1.0);
}

const ListItem = ({children}) => {

    const styles = StyleSheet.create({
        row: {
            display: 'flex',
            flexDirection: 'row'
        },
        bullet: {
            height: '100%'
        }
    })


    return (
        <View style={styles.row}>
            <View style={styles.bullet}>
                <Text>{'\u2022' + " "}</Text>
            </View>
            <Text>{children}</Text>
        </View>
    )

}


function AssemblyProtocol(props) {
    const {title, author, creator, subject, language, assembly} = props;
    const deb = false;

    const system_name = assembly.Project.System.system_name;

    Font.register({family: 'HelveticaNeueLTProThEx', src: '/font/HelveticaNeueLTProThEx.otf'})
    Font.register({family: 'HelveticaNeueLTProRoman', src: '/font/HelveticaNeueLTProRoman.otf'})
    Font.register({family: 'HelveticaNeueLTProMedium', src: '/font/HelveticaNeueLTProMd.otf'})

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            fontFamily: 'HelveticaNeueLTProRoman'
        },
        section: {
            flexGrow: 1,
            fontSize: '10pt',
            textAlign: 'justify',
            paddingBottom: '10px',
            paddingTop: '2px',
        },
        container: {
            marginHorizontal: 25,
            flexDirection: 'column',
        },
        sectionHeader: {
            margin: 0,
            padding: 0
        },
        textStyle: {
            fontSize: '12pt'
        },
        h1: {
            fontFamily: 'HelveticaNeueLTProRoman',
            fontSize: '17pt',
            marginBottom: 10
        },
        h3: {
            fontFamily: 'HelveticaNeueLTProMedium',
            fontSize: '12pt',
            marginBottom: 6,
            marginTop: 12
        },
        p: {
            marginBottom: 2,
        },
        hr: {
            marginVertical: 10
        },
        box: {
            width: '400px',
        },
        columns: {
            flexDirection: 'row'
        },
        column: {
            flexGrow: 1
        },
        TCsmall: {
            fontSize: '9pt',
            padding: 4,
        },
        TCbig: {
            fontSize: '12pt',
            padding: 4,
        },
        TCwritable: {
            height: "30em",
            padding: 4,
        },
        break: {
            flexBasis: '100%',
            height: 0
        }
    })

    return (
        <Document
            title={title}
            author={author}
            subject={subject}
            creator={creator}
            producer={`${pjson.name}-${pjson.version}`}
            language={language}
        >
            <Page size="A4" style={styles.page}>
                <View>
                    {/* Header */}
                    <Header deb={deb}/>

                    {/* Container */}
                    <View style={styles.container} wrap={true} debug={deb}>

                        <View style={styles.section} debug={deb}>
                            <Text style={styles.h1}>Assembly System {system_name}</Text>
                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Location</Text>
                                    {assembly.Project.Customer.lastName ? <Text
                                        style={styles.p}>{assembly.Project.Customer.firstName + ' ' + assembly.Project.Customer.lastName}</Text> : null}
                                    {assembly.Project.Customer.company ?
                                        <Text style={styles.p}>{assembly.Project.Customer.company}</Text> : null}
                                    <Text
                                        style={styles.p}>{assembly.Project.customerDeliveryAddress.street} {assembly.Project.customerDeliveryAddress.housenumber}</Text>
                                    <Text
                                        style={styles.p}>{assembly.Project.customerDeliveryAddress.zipcode} {assembly.Project.customerDeliveryAddress.city}</Text>
                                    <Text style={styles.p}>{assembly.Project.customerDeliveryAddress.state}</Text>
                                    <Text style={styles.p}>{assembly.Project.customerDeliveryAddress.country}</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Contacts</Text>
                                    <Text style={styles.p}>Phone 1 +12 345678910</Text>
                                    <Text style={styles.p}>Phone 2 +12 345678910</Text>
                                    <Text style={styles.p}>Phone 3 +12 345678910</Text>
                                    <Text style={styles.p}>Phone 4 +12 345678910</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Date: {moment(assembly.assembly_date).format('ll')}</Text>
                                    <Text
                                        style={styles.p}>Assembly {assembly.transactionId.substring(assembly.transactionId.length - 17)}</Text>
                                    <Text style={styles.p}>Space {assembly.space} sqm</Text>
                                    <Text
                                        style={styles.p}>Floors: {assembly.AssemblyFloors.map((element, index) => assembly.AssemblyFloors.length - 1 > index ? element.floor_level + ', ' : element.floor_level)}</Text>
                                </View>
                            </View>
                            <Canvas style={styles.hr} paint={painter =>
                                painter
                                    .moveTo(0, 0)                               // set the current point
                                    .lineTo(545, 0)                            // draw a line
                                    //.quadraticCurveTo(130, 200, 150, 120)        // draw a quadratic curve
                                    // .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
                                    //.lineTo(400, 90)                             // draw another line
                                    .stroke('#f7a700')                                   // stroke the path}>
                                //.fill('#ff3300')
                            }>
                            </Canvas>
                            {assembly.AssemblyAdditionalAssemblyTasks ?
                                <View style={styles.section}>
                                    <View>
                                        <Table
                                            data={assembly.AssemblyAdditionalAssemblyTasks}
                                        >
                                            <TableHeader>
                                                <TableCell weighting={0.3} style={styles.TCsmall}>Floor
                                                    Level</TableCell>
                                                <TableCell weighting={0.3} style={styles.TCsmall}>Room</TableCell>
                                                <TableCell weighting={1.3} style={styles.TCbig}>Additional
                                                    Task</TableCell>
                                                <TableCell weighting={0.3} style={styles.TCsmall}>completed</TableCell>
                                            </TableHeader>
                                            <TableBody>
                                                <DataTableCell weighting={0.3} style={styles.TCsmall}
                                                               getContent={(r) => r.floor_level}/>
                                                <DataTableCell weighting={0.3} style={styles.TCsmall}
                                                               getContent={(r) => r.room}/>
                                                <DataTableCell weighting={1.3} style={styles.TCbig}
                                                               getContent={(r) => r.task}/>
                                                <DataTableCell weighting={0.3} style={styles.TCsmall}
                                                               getContent={(r) => r.completed ? 'check' : ''}/>
                                            </TableBody>
                                        </Table>
                                    </View>
                                </View>
                                : null}
                            <Text style={styles.h1}>Check Criteria</Text>
                            <Text style={styles.p}>All named criterias have to documented by pictures</Text>
                            <View style={styles.section}>
                                <Table
                                    data={assembly.AssemblyControlChecks}>
                                    <TableHeader>
                                        <TableCell weighting={1.5} style={styles.TCbig}>Task</TableCell>
                                        <TableCell weighting={0.5} style={styles.TCbig}>Completed</TableCell>
                                    </TableHeader>
                                    <TableBody>
                                        <DataTableCell weighting={1.5} style={styles.TCbig}
                                                       getContent={r => r.task}/>
                                        <DataTableCell weighting={0.5} style={styles.TCbig}
                                                       getContent={r => r.completed ? 'check' : ''}/>
                                    </TableBody>

                                </Table>
                            </View>
                            <Canvas style={styles.hr} paint={painter =>
                                painter
                                    .moveTo(0, 0)                               // set the current point
                                    .lineTo(545, 0)                            // draw a line
                                    //.quadraticCurveTo(130, 200, 150, 120)        // draw a quadratic curve
                                    // .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
                                    //.lineTo(400, 90)                             // draw another line
                                    .stroke('#f7a700')                                   // stroke the path}>
                                //.fill('#ff3300')
                            }>
                            </Canvas>
                            <View style={styles.section}>
                                <View>
                                    <Text style={styles.p}>I do confirm the completeness
                                        and correctness of the given tasks</Text>
                                    <Text>Name: </Text>
                                    <Canvas style={styles.hr} paint={painter =>
                                        painter
                                            .moveTo(0, 0)                               // set the current point
                                            .lineTo(545, 0)                            // draw a line
                                            //.quadraticCurveTo(130, 200, 150, 120)        // draw a quadratic curve
                                            // .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
                                            //.lineTo(400, 90)                             // draw another line
                                            .stroke('#000000')                                   // stroke the path}>
                                        //.fill('#ff3300')
                                    }>
                                    </Canvas>
                                    <Text>Signature: </Text>
                                    <Canvas style={styles.hr} paint={painter =>
                                        painter
                                            .moveTo(0, 0)                               // set the current point
                                            .lineTo(545, 0)                            // draw a line
                                            //.quadraticCurveTo(130, 200, 150, 120)        // draw a quadratic curve
                                            // .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
                                            //.lineTo(400, 90)                             // draw another line
                                            .stroke('#000000')                                   // stroke the path}>
                                        //.fill('#ff3300')
                                    }>
                                    </Canvas>
                                </View>
                            </View>
                        </View>

                    </View>

                    {/* Footer */}
                    <Footer deb={deb}/>
                </View>
            </Page>
            <Page size="A4" style={styles.page}>
                <View>
                    {/* Header */}
                    <Header deb={deb}/>

                    {/* Container */}
                    <View style={styles.container} wrap={true} debug={deb}>
                        <View style={styles.section}>
                            <Text style={styles.h1}>Tightness and completion certificate</Text>
                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Assembly site</Text>
                                    {assembly.Project.Customer.lastName ? <Text
                                        style={styles.p}>{assembly.Project.Customer.firstName + ' ' + assembly.Project.Customer.lastName}</Text> : null}
                                    {assembly.Project.Customer.company ?
                                        <Text style={styles.p}>{assembly.Project.Customer.company}</Text> : null}
                                    <Text
                                        style={styles.p}>{assembly.Project.customerDeliveryAddress.street} {assembly.Project.customerDeliveryAddress.housenumber}</Text>
                                    <Text
                                        style={styles.p}>{assembly.Project.customerDeliveryAddress.zipcode} {assembly.Project.customerDeliveryAddress.city}</Text>
                                    <Text style={styles.p}>{assembly.Project.customerDeliveryAddress.state}</Text>
                                    <Text style={styles.p}>{assembly.Project.customerDeliveryAddress.country}</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Assembling contractor</Text>
                                    <Text style={styles.p}>{process.env.REACT_APP_COMPANYNAME}</Text>
                                    <Text style={styles.p}>{process.env.REACT_APP_COMPANYADDRESS}</Text>
                                    <Text
                                        style={styles.p}>{process.env.REACT_APP_COMPANYZIPCODE} {process.env.REACT_APP_COMPANYCITY}</Text>
                                    <Text style={styles.p}>{process.env.REACT_APP_COMPANYCOUNTRY}</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Identification</Text>
                                    <Image debug={deb} style={{width: '50px', marginBottom: 5}}
                                           source={() => getBarcodeUri(assembly.transactionId)}/>
                                    <Text style={{fontSize: '5pt'}}>{assembly.transactionId}</Text>
                                </View>
                            </View>
                            <Canvas style={styles.hr} paint={painter =>
                                painter
                                    .moveTo(0, 0)                               // set the current point
                                    .lineTo(545, 0)                            // draw a line
                                    //.quadraticCurveTo(130, 200, 150, 120)        // draw a quadratic curve
                                    // .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
                                    //.lineTo(400, 90)                             // draw another line
                                    .stroke('#f7a700')                                   // stroke the path}>
                                //.fill('#ff3300')
                            }/>
                            <View style={styles.section}>
                                <Text style={styles.h3}>Building level</Text>
                                <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                                    {assembly.AssemblyFloors.map((element, index) => (
                                        <>
                                            <View key={index} style={{
                                                flexGrow: 4,
                                                flexDirection: 'row',
                                                display: 'flex',
                                                padding: 2,
                                                minWidth: 150
                                            }}>
                                                <Canvas style={{flexGrow: 0.1, marginLeft: '10px'}} debug={deb}
                                                        paint={painter => painter
                                                            .moveTo(0, 0)
                                                            .lineTo(20, 0)
                                                            .lineTo(20, 20)
                                                            .lineTo(0, 20)
                                                            .lineTo(0, 0)
                                                            .stroke('#000000')
                                                        }/>
                                                <Text style={{flexGrow: 5, marginLeft: '5px', paddingVertical: 7}}
                                                      debug={deb}>{element.floor_level}</Text>
                                            </View>
                                            {index > 0 && index % 2 === 0 ?
                                                <View style={styles.break} debug={deb}></View> : null}
                                        </>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.section}>
                                <Text>These tightness and pressure checks can be executed with water, compressed air or
                                    inert gas.</Text>
                                <Text style={styles.h3}>Requirement (according EN 1264-4):</Text>
                                <Text>Prior to insertion/installing of screed, leveling compound and floor covering,
                                    each
                                    circuit must be checked via waterized pressurecheck to make sure tightness is
                                    guaranteed.
                                    The testing pressure must be twice the standardized operating preassure, but 3 bar
                                    at least.</Text>
                                <Text style={styles.h3}>Checkpoints</Text>
                                <View>
                                    <ListItem>Sight check connection for professional execution</ListItem>
                                    <ListItem>Connectors (screwed, pressed or soldered) set</ListItem>
                                    <ListItem>Components of Heatinggenerator, Safetyvalves and expansions vessels were
                                        excluded from check</ListItem>
                                    <ListItem>Pressurecheck was done with 3 bar of compressed air</ListItem>
                                </View>
                                <Text style={styles.h3}>System</Text>
                                <View>
                                    <ListItem>Thermisto System swift milled in</ListItem>
                                    <ListItem>Thermisto pipe 14 x 2,00 mm </ListItem>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.p}>Maximum operating pressure: 2,5 bar</Text>
                            </View>
                            <View style={styles.section}>
                                <Text>Due to expansion within the pipes, repressuring is needed to achieve defined
                                    checkpressure. Afterwards a sight-check is mandatory. Possible temperature
                                    variations
                                    must be considered </Text>
                                <Text style={styles.h3}>Final checks</Text>
                                <ListItem>The underfloor heating was during check</ListItem>
                                <ListItem>The assembly site was left cleaned</ListItem>
                                <ListItem>A permanent shape distortion on parts did</ListItem>
                                <ListItem>During the final acceptance of work no damage through thermisto
                                    occured</ListItem>
                            </View>

                            <View style={styles.section}>
                                <View style={styles.columns}>
                                    <View style={styles.column}>
                                        <Canvas debug={deb} style={{height: 45, marginBottom: 5}} paint={
                                            painter => painter
                                                .moveTo(0, 39)
                                                .lineTo(200, 39)
                                                .stroke('#f7a700')

                                                .moveTo(3, 33)
                                                .lineTo(13, 23)
                                                .stroke('#f7a700')

                                                .moveTo(13, 33)
                                                .lineTo(3, 23)
                                                .stroke('#f7a700')

                                        }/>
                                        <Text>Date & Signature executing mechanic</Text>
                                    </View>
                                    <View style={styles.column}>
                                        <Canvas debug={deb} style={{height: 45, marginBottom: 5}}
                                                paint={painter => painter
                                                    .moveTo(0, 39)
                                                    .lineTo(200, 39)
                                                    .stroke('#f7a700')

                                                    .moveTo(3, 33)
                                                    .lineTo(13, 23)
                                                    .stroke('#f7a700')

                                                    .moveTo(13, 33)
                                                    .lineTo(3, 23)
                                                    .stroke('#f7a700')
                                                }/>
                                        <Text>Date & Signature Customer</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Footer deb={deb}/>
                </View>
            </Page>
            <Page size="A4" style={styles.page}>
                <View>
                    {/* Header */}
                    <Header deb={deb}/>

                    {/* Container */}
                    <View style={styles.container} wrap={true} debug={deb}>
                        <View style={styles.section}>
                            <Text style={styles.h1}>Circuits</Text>
                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column} style={{flexGrow: 1.8, marginRight: 10}} debug={deb}>
                                    <Text style={styles.h3}>Manifolds</Text>
                                    <Table
                                        data={assembly.AssemblyFloors}>
                                        <TableHeader>
                                            <TableCell weighting={0.5} style={styles.TCbig}>Floor</TableCell>
                                            <TableCell weighting={1} style={styles.TCbig}>Manifold-ID</TableCell>
                                            <TableCell weighting={1} style={styles.TCbig}>Space</TableCell>
                                        </TableHeader>
                                        <TableBody>
                                            <DataTableCell weighting={0.5} style={styles.TCsmall}
                                                           getContent={r => r.floor_level}/>
                                            <DataTableCell weighting={1} style={styles.TCbig}
                                                           getContent={r => ''}/>
                                            <DataTableCell weighting={1} style={styles.TCbig}
                                                           getContent={r => ''}/>
                                        </TableBody>

                                    </Table>
                                </View>
                                <View style={styles.column} style={{flexGrow: 0.2}} debug={deb}>
                                    <Text style={styles.h3}>Identification</Text>
                                    <Image debug={deb} style={{width: '50px', marginBottom: 5}}
                                           source={() => getBarcodeUri(assembly.transactionId)}/>
                                    <Text style={{fontSize: '5pt'}}>{assembly.transactionId}</Text>
                                </View>
                            </View>
                            <Canvas style={styles.hr} paint={painter =>
                                painter
                                    .moveTo(0, 0)                               // set the current point
                                    .lineTo(545, 0)                            // draw a line
                                    //.quadraticCurveTo(130, 200, 150, 120)        // draw a quadratic curve
                                    // .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
                                    //.lineTo(400, 90)                             // draw another line
                                    .stroke('#f7a700')                                   // stroke the path}>
                                //.fill('#ff3300')
                            }/>
                            <View style={styles.section}>
                                <View style={styles.columns}>
                                    <View style={styles.column}>
                                        <Table
                                            data={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]}>
                                            <TableHeader>
                                                <TableCell weighting={0.2} style={styles.TCwritable}>Circuit</TableCell>
                                                <TableCell weighting={1} style={styles.TCwritable}>Room</TableCell>
                                                <TableCell weighting={0.2}
                                                           style={styles.TCwritable}>Pipelength</TableCell>
                                            </TableHeader>
                                            <TableBody>
                                                <DataTableCell weighting={0.2} style={styles.TCwritable}
                                                               getContent={r => ''}/>
                                                <DataTableCell weighting={1} style={styles.TCwritable}
                                                               getContent={r => ''}/>
                                                <DataTableCell weighting={0.2} style={styles.TCwritable}
                                                               getContent={r => ''}/>
                                            </TableBody>

                                        </Table>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Footer deb={deb}/>
                </View>
            </Page>

        </Document>
    );
}

export default AssemblyProtocol;