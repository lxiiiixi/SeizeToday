import React from 'react'
import { Card, CardFooter, CardBody, CardHeader, Typography, List, ListItem, ListItemPrefix, Checkbox } from '@material-tailwind/react'
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);


// 网格布局的位置布局，将决定定位
const layout = [
    { i: "blue-eyes-dragon", x: 0, y: 0, w: 1, h: 1 },
    { i: "dark-magician", x: 1, y: 0, w: 1, h: 1 },
    { i: "kuriboh", x: 2, y: 0, w: 1, h: 1 },
    { i: "spell-caster", x: 3, y: 0, w: 1, h: 1 },
    { i: "summoned-skull", x: 0, y: 1, w: 1, h: 1 }
];

export function Today2(props) {

    const handleLayoutChange = (layout, layouts) => {
        // localStorage.setItem("grid-layout", JSON.stringify(layouts));
    };

    return (
        <div className="h-screen flex py-10 bg-purple-50">
            <ResponsiveGridLayout
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 4, md: 3, sm: 2, xs: 2, xxs: 1 }}
                rowHeight={300}
                width={1000}
                onLayoutChange={handleLayoutChange}
            >
                <div className="bg-blue-gray-200" key="blue-eyes-dragon">
                    <div className="p-2">Blue Eyes Dragon</div>
                </div>
                <div className="bg-blue-gray-200" key="dark-magician">
                    <div className="p-2">Dark Magician</div>
                </div>
                <div className="bg-blue-gray-200" key="kuriboh">
                    <div className="p-2">Kuriboh</div>
                </div>
                <div className="bg-blue-gray-200" key="spell-caster">
                    <div className="p-2">Spell Caster</div>
                </div>
                <div className="bg-blue-gray-200" key="summoned-skull">
                    <div className="p-2">Summoned Skull</div>
                </div>
            </ResponsiveGridLayout>
        </div>
    )
}


export default Today2
