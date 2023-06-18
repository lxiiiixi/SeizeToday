import React, { useState, useEffect } from 'react'
import {
    Card, CardFooter, CardBody, CardHeader,
    Typography, List, ListItem, ListItemSuffix,
    Checkbox, IconButton, Switch, Input, Button,
    Alert, Popover, PopoverHandler, PopoverContent,
    Menu, MenuHandler, MenuList, MenuItem, ListItemPrefix
} from '@material-tailwind/react'
import { v4 as uuidv4 } from 'uuid'
import { TrashIcon, CheckCircleIcon, XMarkIcon, PlusIcon, EllipsisVerticalIcon, MinusIcon } from "@heroicons/react/24/solid";
import TextareaAutosize from 'react-textarea-autosize';
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
// const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

const layout = [
    { i: "1111", x: 0, y: 0, w: 2, h: 2 },
    { i: "2222", x: 2, y: 0, w: 2, h: 2 },
    { i: "3333", x: 4, y: 0, w: 2, h: 2 },
    { i: "4444", x: 6, y: 0, w: 2, h: 2 },
    { i: "5555", x: 0, y: 1, w: 2, h: 2 }
];


const summaryLayout = { i: "summary", x: 0, y: 0, w: 2, h: 2 }
const defaultLayout = {
    lg: [summaryLayout],
    md: [summaryLayout],
    sm: [summaryLayout],
    xs: [summaryLayout],
    xxs: [summaryLayout]
}

const data = [
    { id: "1111", name: "name1", subList: [{ id: "11", taskName: "work1", checked: false, line: true }] },
    { id: "2222", name: "name2", subList: [{ id: "22", taskName: "work1", checked: false, line: false }] },
    { id: "3333", name: "name3", subList: [{ id: "33", taskName: "work1", checked: false, line: true }] },
    { id: "4444", name: "name4", subList: [{ id: "44", taskName: "work1", checked: false, line: false }] },
    { id: "5555", name: "name5", subList: [{ id: "55", taskName: "work1", checked: false, line: true }] },
]

export function Today2() {
    const [isDraggable, setIsDraggable] = useState(false);
    const [gridLayout, setGridLayout] = useState(JSON.parse(localStorage.getItem("gridLayout")) || defaultLayout);
    const [dataList, setDataList] = useState(JSON.parse(localStorage.getItem("dataList")) || []);
    const [summaryText, setSummaryText] = useState(localStorage.getItem("summary") || "");
    const [addItemText, setAddItemText] = useState("");
    const [open, setOpen] = useState(false);
    const whetherNeedSave = JSON.stringify(dataList) === localStorage.getItem("dataList")

    useEffect(() => {
        const targetElement = document.getElementById('test');

        const handleClick = function () {
            const textareaElement = targetElement.querySelector('textarea');

            textareaElement.focus();
        };
        targetElement.addEventListener('click', handleClick);
        return () => {
            targetElement.removeEventListener('click', handleClick);
        };
    }, []);


    const addCardItem = () => {
        if (addItemText) {
            const newId = uuidv4()
            const newItem = {
                id: newId,
                name: addItemText,
                subList: []
            }
            const newLayout = { i: newId, x: 0, y: 0, w: 2, h: 2 }
            setDataList(oldList => [...oldList, newItem])
            setGridLayout((oldLayout) => {
                return {
                    lg: [...oldLayout.lg, newLayout],
                    md: [...oldLayout.md, newLayout],
                    sm: [...oldLayout.sm, newLayout],
                    xs: [...oldLayout.xs, newLayout],
                    xxs: [...oldLayout.xxs, newLayout],
                }
            })
            setAddItemText("")
        }
    }

    const handleSave = () => {
        localStorage.setItem("gridLayout", JSON.stringify(gridLayout))
        localStorage.setItem("dataList", JSON.stringify(dataList))
        localStorage.setItem("summary", summaryText)
        setOpen(true)
    }

    const handleDeleteCard = (id) => {
        const newList = dataList.filter(item => item.id !== id)
        setDataList(newList)
    }

    const handleSubItemAdd = (id, text) => {
        const newList = dataList.map(item => {
            if (item.id === id) {
                item.subList.push({
                    id: uuidv4(),
                    taskName: text,
                    checked: false
                })
            }
            return item
        })
        setDataList(newList)
    }

    const handleSubItemCheck = (cardId, taskId, ifChecked) => {
        const newList = dataList.map(card => {
            if (card.id === cardId) {
                const newSublist = card.subList.map(subItem => {
                    if (subItem.id === taskId) {
                        subItem.checked = ifChecked
                    }
                    return subItem
                })
                return {
                    ...card,
                    subList: newSublist
                };
            }
            return card
        })
        setDataList(newList)
    }

    const handleLine = (cardId, taskId) => {
        const newList = dataList.map(card => {
            if (card.id === cardId) {
                const newSublist = card.subList.map(subItem => {
                    if (subItem.id === taskId) {
                        subItem.line = !subItem.line
                    }
                    return subItem
                })
                return {
                    ...card,
                    subList: newSublist
                };
            }
            return card
        })
        setDataList(newList)
    }

    const handleDeleteTask = (cardId, taskId) => {
        const newList = dataList.map(item => {
            if (item.id === cardId) {
                const subList = item.subList.filter(subItem => subItem.id !== taskId);
                return { ...item, subList };
            }
            return item
        })
        setDataList(newList)
    }

    const handleNamechange = (id, name) => {
        const newList = dataList.map(item => {
            if (item.id === id) {
                item.name = name
            }
            return item
        })
        setDataList(newList)
    }


    const handleLayoutChange = (layout, layouts) => {
        // console.log(layout, layouts);
        setGridLayout(layouts)
    };

    // https://github.com/react-grid-layout/react-grid-layout#responsive-grid-layout-props
    return (
        <div className="py-4 bg-purple-50 rounded-lg min-h-screen">
            {/* alert */}
            <Alert
                open={open}
                color="green"
                className="max-w-screen-md fixed bottom-4 right-4 z-50"
                icon={<CheckCircleIcon className="mt-px h-6 w-6" />}
                animate={{
                    mount: { x: 0 },
                    unmount: { x: 100 },
                }}
                onClose={() => setOpen(false)}
            >
                <Typography variant="h5" color="white">
                    Success
                </Typography>
                <Typography color="white" className="mt-2 font-normal">
                    Your data has been saved.
                </Typography>
            </Alert>
            <div className="m-4 mt-0 flex justify-between bg-white rounded-lg p-2">
                <Button className="mr-4" onClick={handleSave} disabled={whetherNeedSave}>Save</Button>
                <Switch label="Draggable" ripple={true} checked={isDraggable} onChange={(e) => setIsDraggable(e.target.checked)} />
                <div className="relative flex w-full max-w-[24rem] ml-5" >
                    <Input
                        label="Add a card"
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
                        onClick={addCardItem}
                    >
                        +
                    </Button>
                </div>
            </div>
            <ResponsiveGridLayout
                layouts={gridLayout}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 8, md: 6, sm: 4, xs: 4, xxs: 2 }}
                // layout={gridLayout}
                // cols={8}
                rowHeight={150}
                onLayoutChange={handleLayoutChange}
                isDraggable={isDraggable}
            >
                {dataList.map((item) => (
                    <div className={`pt-4 p-1 ${isDraggable ? "cursor-move" : ""}`} key={item.id}>
                        <DraggableCard
                            key={item.id}
                            cardData={item}
                            handleDeleteCard={handleDeleteCard}
                            handleSubItemAdd={handleSubItemAdd}
                            handleSubItemCheck={handleSubItemCheck}
                            handleDeleteTask={handleDeleteTask}
                            handleLine={handleLine}
                        />
                    </div>
                ))}
                <div className={`pt-4 p-1 ${isDraggable ? "cursor-move" : ""}`} key="summary">
                    <Card className="w-full h-full pt-2 pb-4">
                        <CardHeader
                            variant="gradient"
                            color="red"
                            className="grid h-10 place-items-center"
                        >
                            Summary
                        </CardHeader>
                        <CardBody className="p-2 pb-0 h-full" id='test'>
                            <TextareaAutosize
                                minRows={4}
                                value={summaryText}
                                onChange={(e) => setSummaryText(e.target.value)}
                                className="w-full p-2 focus:border focus:outline-red-500 max-h-full font-light"
                            />
                        </CardBody>
                    </Card>
                </div>
            </ResponsiveGridLayout>
        </div>
    )
}


export default Today2


const DraggableCard = ({ cardData, handleDeleteCard, handleSubItemAdd, handleSubItemCheck, handleDeleteTask, handleLine }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [addItemText, setAddItemText] = useState("")

    const handleAdd = () => {
        handleSubItemAdd(cardData.id, addItemText)
        setAddItemText("")
    }

    // 嵌套group：不生效 https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups
    return (
        <Card className="w-full h-full pt-2 pb-4">
            <CardHeader
                variant="gradient"
                color="gray"
                className="grid h-10 place-items-center group"
            >

                <Typography variant="h6" color="white">
                    {cardData.name}
                </Typography>
                <XMarkIcon onClick={() => handleDeleteCard(cardData.id)} className="h-5 w-5 fixed right-7 top-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </CardHeader>
            <CardBody className="flex flex-col p-0 overflow-scroll">
                <List ripple={true}>
                    {cardData.subList.map(item => {
                        return <CheckListItem
                            key={item.id}
                            cardId={cardData.id}
                            subItem={item}
                            handleSubItemCheck={handleSubItemCheck}
                            handleDeleteTask={handleDeleteTask}
                            handleLine={handleLine}
                        />
                    })}
                </List>
            </CardBody>
            <Popover
                placement="top-end" animate={{
                    mount: { scale: 1, x: 0, y: 0 },
                    unmount: { scale: 0, x: 120, y: 35 },
                }}
            >
                <PopoverHandler onClick={() => setAddItemText("")}>
                    <PlusIcon className="h-5 w-5 fixed right-4 bottom-4 cursor-pointer" />
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
                            onClick={handleAdd}
                        >
                            +
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </Card>
    )
}

const CheckListItem = ({ cardId, subItem, handleSubItemCheck, handleDeleteTask, handleLine }) => {
    const [openMenu, setOpenMenu] = useState(false);

    const triggers = {
        onMouseEnter: () => setOpenMenu(true),
        onMouseLeave: () => setOpenMenu(false),
    };

    const handleCheck = (e) => {
        const ifChecked = e.target.checked
        handleSubItemCheck(cardId, subItem.id, ifChecked)
    }

    // item?.line 只是为了兼容之前旧的数据，之后可以删掉？
    return (
        <ListItem ripple={false} className={`p-0 group ${subItem?.line ? "line-through decoration-gray-600" : ""}`}>
            <label
                htmlFor="vertical-list-react"
                className={`px-3 py-2 flex items-center w-full cursor-pointer`}
            >
                <ListItemPrefix className="mr-3">
                    <Checkbox
                        id={subItem.id}
                        ripple={false}
                        className="hover:before:opacity-0 p-0"
                        checked={subItem.checked}
                        onChange={handleCheck}
                        containerProps={{
                            className: "p-0"
                        }}
                    />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-light">{subItem.taskName}</Typography>
            </label>
            <ListItemSuffix className="h-full" {...triggers}>
                <Menu
                    open={openMenu}
                    handler={setOpenMenu}
                    placement="bottom-end"
                    animate={{
                        mount: { y: 0 },
                        unmount: { y: 25 },
                    }}
                >
                    <MenuHandler >
                        <EllipsisVerticalIcon className="h-5 w-5 mr-2 opacity-0 group-hover:opacity-100" />
                    </MenuHandler>
                    <MenuList>
                        <MenuItem className="flex items-center gap-2" onClick={() => handleDeleteTask(cardId, subItem.id)}>
                            <TrashIcon strokeWidth={2} className="h-4 w-4" />
                            <Typography variant="small" className="font-normal">
                                Delete
                            </Typography>
                        </MenuItem>
                        <MenuItem className="flex items-center gap-2" onClick={() => handleLine(cardId, subItem.id)}>
                            <MinusIcon strokeWidth={2} className="h-6 w-4" />
                            <Typography variant="small" className="font-normal">
                                Mark Line
                            </Typography>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </ListItemSuffix>
        </ListItem>)
}