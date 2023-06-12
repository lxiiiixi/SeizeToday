import React, { useMemo } from 'react'
import { Card, CardFooter, CardBody, CardHeader, Typography, List, ListItem, ListItemPrefix, Checkbox } from '@material-tailwind/react'
import { Responsive, WidthProvider } from "react-grid-layout";
// const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
const ResponsiveGridLayout = WidthProvider(Responsive);
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


// 网格布局的位置布局，将决定定位
const layout = [
    { i: "blue-eyes-dragon", x: 0, y: 0, w: 2, h: 2 },
    { i: "dark-magician", x: 2, y: 0, w: 2, h: 2 },
    { i: "kuriboh", x: 4, y: 0, w: 2, h: 2 },
    { i: "spell-caster", x: 6, y: 0, w: 2, h: 4, static: true },
    { i: "summoned-skull", x: 0, y: 1, w: 2, h: 2 }
];

export function Today2(props) {

    const handleLayoutChange = (layout, layouts) => {
        // localStorage.setItem("grid-layout", JSON.stringify(layouts));
    };

    // https://github.com/react-grid-layout/react-grid-layout#responsive-grid-layout-props
    return (
        <div className="py-10 bg-purple-50">
            <ResponsiveGridLayout
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 8, md: 6, sm: 4, xs: 4, xxs: 2 }}
                rowHeight={150}
                onLayoutChange={handleLayoutChange}
            // width={1000}
            // compactType="horizontal"
            >
                <div className="pt-4 p-1" key="blue-eyes-dragon">
                    <Card className="w-full h-full">
                        <CardHeader
                            variant="gradient"
                            color="blue"
                            className="grid h-10 place-items-center"
                        >
                            <Typography variant="h3" color="white">
                                Sign In
                            </Typography>
                        </CardHeader>
                        <CardBody className="flex flex-col gap-4">
                            body
                        </CardBody>
                        <CardFooter className="pt-0">
                            footer
                        </CardFooter>
                    </Card>
                </div>
                <div className="bg-blue-gray-200" key="dark-magician">
                    <div className="p-2">Dark Magician</div>
                </div>
                <div className="bg-blue-gray-200" key="kuriboh">
                    <div className="p-2">Kuriboh</div>
                </div>
                <div className="bg-blue-gray-200" key="spell-caster">
                    <div className="p-2">Spell Caster <br></br>
                        static</div>
                </div>
                <div className="bg-blue-gray-200" key="summoned-skull">
                    <div className="p-2">Summoned Skull</div>
                </div>
            </ResponsiveGridLayout>
        </div>
    )
}


export default Today2
