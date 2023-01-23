import { Canvas, Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React, {useContext} from 'react';
import pjson from "../../../package.json";
import Header from "./template/Header";
import Footer from "./template/Footer";

function ComplaintProtocol(props) {

    const {title, author, creator, subject, language} = props;
    const deb = false;

    Font.register({ family: 'HelveticaNeueLTProThEx', src: '/font/HelveticaNeueLTProThEx.otf' })
    Font.register({ family: 'HelveticaNeueLTProRoman', src: '/font/HelveticaNeueLTProRoman.otf' })
    Font.register({ family: 'HelveticaNeueLTProMedium', src: '/font/HelveticaNeueLTProMd.otf' })

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            fontFamily: 'HelveticaNeueLTProRoman'
        },
        section: {
            flexGrow: 1,
            fontSize: '12pt',
            textAlign: 'justify',
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
            marginBottom: 12
        },
        p: {
            marginBottom: 6
        },
        hr: {
            marginVertical: 10
        },
        columns: {
            flexDirection: 'row'
        },
        column: {
            flexGrow: 1
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

                        <View style={styles.section} debug={deb} >
                            <Text style={styles.h1}>Checkliste System swift</Text>
                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Header 3</Text>
                                    <Text style={styles.p}>Field 1</Text>
                                    <Text style={styles.p}>Field 2</Text>
                                    <Text style={styles.p}>Field 3</Text>
                                    <Text style={styles.p}>Field 4</Text>
                                    <Text style={styles.p}>Field 5</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.h3}>Header 3</Text>
                                    <Text style={styles.p}>Field 1</Text>
                                    <Text style={styles.p}>Field 2</Text>
                                    <Text style={styles.p}>Field 3</Text>
                                    <Text style={styles.p}>Field 4</Text>
                                    <Text style={styles.p}>Field 5</Text>
                                </View>
                            </View>
                            <Canvas style={styles.hr} paint={painter =>
                                painter
                                    .moveTo(0, 0)                               // set the current point
                                    .lineTo(545, 0)                            // draw a line
                                    //.quadraticCurveTo(130, 200, 150, 120)        // draw a quadratic curve
                                    // .bezierCurveTo(190, -40, 200, 200, 300, 150) // draw a bezier curve
                                    //.lineTo(400, 90)                             // draw another line
                                    .stroke('#ff3300')                                   // stroke the path}>
                                //.fill('#ff3300')
                            }>
                            </Canvas>
                            <View style={styles.columns} debug={deb}>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.p}>Field 1</Text>
                                    <Text style={styles.p}>Field 2</Text>
                                    <Text style={styles.p}>Field 3</Text>
                                    <Text style={styles.p}>Field 4</Text>
                                    <Text style={styles.p}>Field 5</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.p}>Field 1</Text>
                                    <Text style={styles.p}>Field 2</Text>
                                    <Text style={styles.p}>Field 3</Text>
                                    <Text style={styles.p}>Field 4</Text>
                                    <Text style={styles.p}>Field 5</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.p}>Field 1</Text>
                                    <Text style={styles.p}>Field 2</Text>
                                    <Text style={styles.p}>Field 3</Text>
                                    <Text style={styles.p}>Field 4</Text>
                                    <Text style={styles.p}>Field 5</Text>
                                </View>
                                <View style={styles.column} debug={deb}>
                                    <Text style={styles.p}>Field 1</Text>
                                    <Text style={styles.p}>Field 2</Text>
                                    <Text style={styles.p}>Field 3</Text>
                                    <Text style={styles.p}>Field 4</Text>
                                    <Text style={styles.p}>Field 5</Text>
                                </View>
                            </View>
                            <Text>Alias, id dolorum doloribus, dicta vero, ad blanditiis repellendus quam dignissimos optio est. Perspiciatis, ipsum, labore, sint dolorem delectus quisquam reiciendis maxime corporis odio quaerat voluptatibus. Tempore adipisci sunt vitae, dolore obcaecati excepturi ullam eligendi reprehenderit officiis ducimus numquam laboriosam non beatae id voluptatum culpa dolor eveniet iste impedit, esse blanditiis corrupti minima hic voluptatibus? Ad, cum velit! Eaque est ratione dolores veniam aliquid voluptas cum magni aut sapiente inventore, quis perferendis nobis incidunt dolore nisi facilis enim voluptate excepturi exercitationem ad, sunt quidem accusamus quo. Neque laboriosam fuga sequi tenetur mollitia tempora voluptates!</Text>
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