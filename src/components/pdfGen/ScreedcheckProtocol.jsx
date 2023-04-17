import {Canvas, Document, Font, Page, StyleSheet, Text, View} from "@react-pdf/renderer";
import React, {useContext} from 'react';
import pjson from "../../../package.json";
import Header from "./template/Header";
import Footer from "./template/Footer";
import moment from "moment";
import {DataTableCell, Table, TableBody, TableCell, TableHeader,} from "@david.kucsai/react-pdf-table";


function OptionsList(props) {
    const styles = StyleSheet.create({
        columns: {
            flexDirection: 'row'
        },
        column: {
            flexGrow: 1
        },
        li: {
            textAlign: "left"
        }
    })
    return (
            <View style={styles.columns} debug={props.deb}>
        <View style={styles.column} style={{ width: '20px'}} debug={props.deb}>
            <Canvas paint={painter => painter
                .circle(5, 5, 5)
                .stroke('#f7a700')
            }></Canvas>
        </View>
        <View style={styles.column}>
            <Text style={{fontSize: '10pt'}}>{props.option}</Text>
        </View>
            </View>
    )
}

function CheckList(props) {
    const styles = StyleSheet.create({
        columns: {
            flexDirection: 'row'
        },
        column: {
            flexGrow: 1
        },
        li: {
            textAlign: "left"
        }
    })
    return (
            <View style={styles.columns} debug={props.deb}>
        <View style={styles.column} style={{ width: '20px'}} debug={props.deb}>
            <Canvas paint={painter => painter
                .roundedRect(0, -2, 12, 12, 3)
                .stroke('#f7a700')
            }></Canvas>
        </View>
        <View style={styles.column}>
            <Text style={{ marginBottom: '7px' }}>{props.option}</Text>
        </View>
            </View>
    )
}

function ComplaintProtocol(props) {

    const {title, author, creator, subject, language, screedcheck, project, customer} = props;
    const deb = false;

    function calcId(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }

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
            paddingBottom: '2px',
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
            fontSize: '10pt'
        },
        h1: {
            fontFamily: 'HelveticaNeueLTProRoman',
            fontSize: '17pt',
            marginBottom: 2
        },
        h2: {
            fontFamily: 'HelveticaNeueLTProRoman',
            fontSize: '14pt',
            marginBottom: 10
        },
        h3: {
            fontFamily: 'HelveticaNeueLTProMedium',
            fontSize: '12pt',
            marginBottom: 8,
            marginTop: 8
        },
        ra: {
            textAlign: 'right'
        },
        p: {
            marginBottom: 6
        },
        psmall: {
            fontSize: '8pt'
        },
        hr: {
            marginVertical: 10
        },
        inputField: {
            paddingRight: 5,
            marginVertical: 10,
        },
        columns: {
            flexDirection: 'row'
        },
        column: {
            flexGrow: 1
        },
        TCsmall: {
            fontSize: '7pt',
            padding: 2
        },
        TCwritable: {
            height: "30em"
        },
        li: {
            textAlign: "left"
        }

    })

    function renderInputLine(length = 1) {
        return (
            <Canvas style={styles.inputField} paint={painter => {
                painter
                    .moveTo(0, 0)
                    .lineTo(100 * length, 0)
                    .stroke('#000000')
            }
            }></Canvas>
        )

    }


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
                            <View style={styles.column} debug={deb}>
                                <Text style={styles.h1}>Checkliste System {project.System.system_name}</Text>
                                <Text
                                    style={styles.ra}>{calcId(screedcheck.id, 8)} // {screedcheck.transactionId.slice(-10)}</Text>
                            </View>
                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Assembly Address</Text>
                                    <Text
                                        style={styles.li}>{customer.lastName ? customer.firstName + ' ' + customer.lastName : ''}{customer.company ? customer.company : ''} </Text>
                                    <Text
                                        style={styles.li}>{screedcheck.Project.customerInvoiceAddress.street + ' ' + screedcheck.Project.customerInvoiceAddress.housenumber}</Text>
                                    <Text
                                        style={styles.li}>{screedcheck.Project.customerInvoiceAddress.zipcode + ' ' + screedcheck.Project.customerInvoiceAddress.city}</Text>
                                    <Text style={styles.li}>{screedcheck.Project.customerInvoiceAddress.state}</Text>
                                    <Text style={styles.li}>{screedcheck.Project.customerInvoiceAddress.country}</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Contacts</Text>
                                    <Text style={styles.li}>Phone 1</Text>
                                    <Text style={styles.li}>Phone 2</Text>
                                    <Text style={styles.li}>E-Mail</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Details</Text>
                                    <Text style={styles.li}>Customer
                                        Group: {customer.CustomerGroup ? customer.CustomerGroup.shortname : 'none'}</Text>
                                    <Text style={styles.li}>Customer Type: {customer.CustomerType.shortName}</Text>
                                    <Text
                                        style={styles.li}>Date: {screedcheck.datetime_of_screedcheck != null ? moment(screedcheck.datetime_of_screedcheck).format('lll') : 'not set'}</Text>
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
                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.p}>Parking available</Text>
                                    <Text style={styles.p}>Parking spot distance</Text>
                                    <Text style={styles.p}>Gov. Parking permission</Text>
                                    <Text style={styles.p}>Entrance on ground floor</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    {renderInputLine()}
                                    {renderInputLine()}
                                    {renderInputLine()}
                                    {renderInputLine()}
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.p}>Water available</Text>
                                    <Text style={styles.p}>Highvoltage current avilable</Text>
                                    <Text style={styles.p}>Floor Cover removed</Text>
                                    <Text style={styles.p}>Total Space</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    {renderInputLine()}
                                    {renderInputLine()}
                                    {renderInputLine()}
                                    {renderInputLine()}
                                </View>
                            </View>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.p}>Manifold origin</Text>
                                    <Text style={styles.p}>Dispatch address</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.p}>onsite / dispatch through thermisto / handed over
                                        onsite</Text>
                                    <Text style={styles.p}>hzb / assembly address / else</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.section}>
                            <View>
                                <Table
                                    data={[
                                        {},{},{},{},{},
                                    ]}
                                >
                                    <TableHeader>
                                        <TableCell style={{ padding: 2 }}>Floor</TableCell>
                                        <TableCell style={{ padding: 2 }}>sqm</TableCell>
                                        <TableCell style={styles.TCsmall}>Manifold qty.</TableCell>
                                        <TableCell style={styles.TCsmall}>Manifold size</TableCell>
                                        <TableCell style={styles.TCsmall}>Manifold rack qty.</TableCell>
                                        <TableCell style={styles.TCsmall}>Manifold rack type</TableCell>
                                        <TableCell style={styles.TCsmall}>Actuators qty.</TableCell>
                                        <TableCell style={styles.TCsmall}>controlunits qty.</TableCell>
                                        <TableCell style={styles.TCsmall}>thermostates qty.</TableCell>
                                        <TableCell style={styles.TCsmall}>thermostates type</TableCell>
                                        <TableCell style={styles.TCsmall}>FWR qty.</TableCell>
                                    </TableHeader>
                                    <TableBody>
                                        <DataTableCell style={styles.TCwritable} getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                        <DataTableCell style={styles.TCwritable}getContent={(r) => " "} />
                                    </TableBody>
                                </Table>
                            </View>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Screedtype</Text>
                                        <OptionsList deb={deb} option="cement screed"/>
                                        <OptionsList deb={deb} option="anhydrite floor"/>
                                        <OptionsList deb={deb} option="mastic asphalt"/>
                                        <OptionsList deb={deb} option="dry screed"/>
                                        <OptionsList deb={deb} option="concrete"/>

                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Consistency</Text>
                                    <OptionsList deb={deb} option="super hard"/>
                                    <OptionsList deb={deb} option="hard"/>
                                    <OptionsList deb={deb} option="medium"/>
                                    <OptionsList deb={deb} option="soft"/>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Screedthickness</Text>
                                    <View style={styles.columns}>
                                        <View style={styles.column}>
                                            <Canvas style={styles.hr} paint={painter =>
                                                painter
                                                    .moveTo(0, 0)                               // set the current point
                                                    .lineTo(70, 0)                            // draw a line
                                                    .stroke('#f7a700')                                   // stroke the path}>
                                            }>
                                            </Canvas>
                                        </View>
                                        <View style={styles.column}>
                                            <Text>mm</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.h3}>Insulation</Text>
                                    <View style={styles.columns}>
                                        <View style={styles.column}>
                                            <Canvas style={styles.hr} paint={painter =>
                                                painter
                                                    .moveTo(0, 0)                               // set the current point
                                                    .lineTo(70, 0)                            // draw a line
                                                    .stroke('#f7a700')                                   // stroke the path}>
                                            }>
                                            </Canvas>
                                        </View>
                                        <View style={styles.column}>
                                            <Text>mm</Text>
                                        </View>
                                </View>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>duct connection</Text>
                                    <OptionsList deb={deb} option="Customer"/>
                                    <OptionsList deb={deb} option={"thermisto \n (Appendix A)"}/>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Rec. Spacing</Text>
                                    <OptionsList deb={deb} option="100 mm"/>
                                    <OptionsList deb={deb} option="125 mm"/>
                                </View>
                            </View>
                        </View>
                        <View style={styles.section}>

                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column}>
                                    <Text style={styles.h2}>Preliminary assessment</Text>
                                    <View style={styles.columns} debug={deb}>
                                        <View style={styles.column}>
                                            <Text style={{ width: '150px'}}>Assembly possible</Text>
                                        </View>
                                        <View style={styles.column}>
                                            {renderInputLine()}
                                        </View>
                                    </View>
                                    <View style={styles.columns}>
                                        <View style={styles.column}>
                                        <Text style={{ width: '150px'}}>Further checks necessary</Text>
                                        </View>
                                        <View style={styles.column}>
                                            {renderInputLine()}
                                        </View>
                                    </View>
                                    <View style={styles.columns}>
                                        <View style={styles.column}>
                                            <Text  style={{ width: '150px'}}>Prefered Assemblydate</Text>
                                        </View>
                                        <View style={styles.column}>
                                            {renderInputLine()}
                                        </View>

                                    </View>
                                </View>
                                <View style={styles.column}>
                                    <Text style={styles.h1}>Screedcheck completed</Text>
                                    <Canvas paint={painter => painter
                                        .moveTo(0,30)
                                        .lineTo(250, 30)
                                        .stroke('#000000')
                                    }/>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: '100px'}}>
                            <View style={styles.section} debug={deb}>
                                <View style={styles.columns} debug={deb}>
                                    <View style={styles.column} debug={deb}>
                                        <Text style={styles.h2}>Floor cover</Text>
                                        <CheckList deb={deb} option="Stone/Tiles"/>
                                        <CheckList deb={deb} option="Vinyl"/>
                                        <CheckList deb={deb} option="Laminate"/>
                                        <CheckList deb={deb} option="Linoleum"/>
                                        <CheckList deb={deb} option="Wood/ Parquet"/>
                                        <CheckList deb={deb} option="Textile"/>
                                    </View>
                                    <View style={styles.column} debug={deb}>
                                        <Text style={styles.h2}>Floor Level</Text>
                                        {renderInputLine(3)}
                                        {renderInputLine(3)}
                                        {renderInputLine(3)}
                                        {renderInputLine(3)}
                                        {renderInputLine(3)}
                                        {renderInputLine(3)}
                                    </View>
                                    <View style={styles.column} style={{ paddingLeft: '10px'}} debug={deb}>
                                        <Text style={styles.h2}>heatinggenerator</Text>
                                        <OptionsList deb={deb} option="heatpump"/>
                                        <OptionsList deb={deb} option="gas"/>
                                        <OptionsList deb={deb} option="oil"/>
                                        <OptionsList deb={deb} option="condensation boiler"/>
                                        <OptionsList deb={deb} option="pellets"/>
                                        <OptionsList deb={deb} option="district heat"/>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.section} debug={deb}>
                                <Text style={styles.h2}>Notes</Text>
                                <Canvas paint={painter => painter
                                    .rect(0,0, 544, 430)
                                    .stroke('#f7a700')
                                } />
                            </View>
                            <View style={styles.section} debug={deb}>
                                <Canvas paint={painter => painter
                                    .circle(490,10,10)
                                    .fill('#3fa535')

                                    .circle(511, 10, 10)
                                    .fill('#ffed00')

                                    .circle(532, 10, 10)
                                    .fill('#cd1719')
                                }/>
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <Footer deb={deb}/>
                </View>
            </Page>
        </Document>
    );
}

export default ComplaintProtocol;