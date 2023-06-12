import React, { useState, useRef } from 'react'
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Input,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Checkbox,
    Popover,
    PopoverHandler,
    PopoverContent,
    IconButton
} from "@material-tailwind/react";

const data = [{ key: "1111", main: "work", sub: [{ content: "work1", checked: true }, { content: "work2", checked: true }, { content: "work3", checked: true }, { content: "work3", checked: true },] },
{ key: "2222", main: "work", sub: [{ content: "work1", checked: false }, { content: "work2", checked: true }, { content: "work3", checked: true },] },
{ key: "3333", main: "work", sub: [{ content: "work1", checked: true }, { content: "work2", checked: true }, { content: "work3", checked: true },] }]



export function Today() {
    const [addText, setAddText] = useState("");
    const [addItemText, setAddItemText] = useState("");
    const [openedItem, setOpenedItem] = useState([0])
    const [dataList, setDataList] = useState(data)


    console.log(dataList);

    const handleOpen = (index) => {
        if (openedItem.includes(index)) setOpenedItem(list => list.filter(item => item !== index))
        else setOpenedItem(list => [...list, index])
    };

    const addMainItem = () => {
        setDataList(list => [...list, { main: addText, sub: [] }])
        setAddText("")
    }

    const addSubItem = (key) => {
        console.log(key, addItemText);
        setDataList(oldList => {
            const newList = oldList.map(item => {
                if (item.key === key) {
                    const newSub = [...item.sub, { content: addItemText, checked: false }]
                    return { ...item, sub: newSub }
                }
                return item
            })
            return newList
        })
        const subTarget = document.getElementById(key)
        const subHeight = subTarget.offsetHeight
        subTarget.parentElement.setAttribute('style', `height:${subHeight}px !important;`);

        console.log(subTarget.parentElement, subHeight);
    }

    const handleCheck = (value) => {
        console.log(value.target.checked);
    }

    return (
        <div className="h-screen">
            <Card className="mt-6 w-full">
                <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                        June.11
                    </Typography>
                    <Typography>
                        {dataList.map((item, index) =>
                            <Accordion
                                key={item.key}
                                open={openedItem.includes(index)}
                                className="border border-blue-gray-100 px-4 rounded-lg mb-2 h-auto"
                                icon={<Icon open={openedItem.includes(index)} />}
                            >
                                <AccordionHeader className="border-b-0 transition-colors p-3 pl-0">
                                    <div className="flex justify-between w-full items-center">
                                        <span className="pl-3 pr-6" onClick={() => handleOpen(index)}>
                                            {item.main}
                                        </span>
                                        <Popover
                                            placement="left-start" animate={{
                                                mount: { scale: 1, x: 0, y: 0 },
                                                unmount: { scale: 0, x: 120, y: -25 },
                                            }}
                                        >
                                            <PopoverHandler onClick={() => setAddItemText("")}>
                                                <IconButton variant="text" size="sm" >
                                                    <i className="fas fa-heart" />
                                                </IconButton>
                                            </PopoverHandler>
                                            <PopoverContent>
                                                <div className="relative flex w-full max-w-[24rem]" >
                                                    <Input
                                                        label="Add a sub task"
                                                        value={addItemText}
                                                        onChange={({ target }) => setAddItemText(target.value)}
                                                        className="pr-20"
                                                        containerProps={{
                                                            className: "min-w-0",
                                                        }}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        color={addItemText ? "blue" : "blue-gray"}
                                                        disabled={!addItemText}
                                                        className="!absolute right-1 top-1 rounded"
                                                        onClick={() => addSubItem(item.key)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </AccordionHeader>
                                <AccordionBody id={item.key} className="text-base font-normal py-0 flex flex-col" >
                                    {item.sub.map((sub, subIndex) => <Checkbox key={sub.content + String(subIndex)} onChange={handleCheck} checked={sub.checked} label={sub.content} ripple={true} />)}
                                </AccordionBody>
                            </Accordion>)}
                    </Typography>
                </CardBody>
                <CardFooter className="pt-0">
                    <div className="relative flex w-full max-w-[24rem]" >
                        <Input
                            label="ADD"
                            value={addText}
                            onChange={({ target }) => setAddText(target.value)}
                            className="pr-20"
                            containerProps={{
                                className: "min-w-0",
                            }}
                        />
                        <Button
                            size="sm"
                            color={addText ? "blue" : "blue-gray"}
                            disabled={!addText}
                            className="!absolute right-1 top-1 rounded"
                            onClick={addMainItem}
                        >
                            Add
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div >
    )
}


function Icon({ open }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${open ? "rotate-180" : ""
                } h-5 w-5 transition-transform`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}

export default Today