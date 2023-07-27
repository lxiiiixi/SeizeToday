import React, { useState, useEffect, useMemo } from 'react'
import {
    Card, CardBody, CardHeader,
    Typography, List, ListItem, ListItemSuffix,
    Checkbox, IconButton, Switch, Input, Button,
    Alert, Popover, PopoverHandler, PopoverContent,
    Menu, MenuHandler, MenuList, MenuItem, ListItemPrefix,
    Dialog, DialogHeader, DialogBody, DialogFooter
} from '@material-tailwind/react'
import { v4 as uuidv4 } from 'uuid'
import { TrashIcon, CheckCircleIcon, XMarkIcon, PlusIcon, EllipsisVerticalIcon, MinusIcon, DocumentDuplicateIcon, CheckIcon, PencilSquareIcon, SparklesIcon } from "@heroicons/react/24/solid";
import TextareaAutosize from 'react-textarea-autosize';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Responsive, WidthProvider } from "react-grid-layout";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ChromePicker } from 'react-color';
import "./test.css"

// icon：https://heroicons.com/

const summaryLayout = { i: "summary", x: 0, y: 0, w: 2, h: 2 }
const defaultLayout = {
    lg: [summaryLayout],
    md: [summaryLayout],
    sm: [summaryLayout],
    xs: [summaryLayout],
    xxs: [summaryLayout]
}


export function Today2() {
    const [isDraggable, setIsDraggable] = useState(false);
    const [gridLayout, setGridLayout] = useState(JSON.parse(localStorage.getItem("gridLayout")) || defaultLayout);
    const [dataList, setDataList] = useState(JSON.parse(localStorage.getItem("dataList")) || {});
    const [addItemType, setAddItemType] = useState("task") // text/task
    const [addItemText, setAddItemText] = useState("");
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)


    // console.log(dataList);
    // console.log(gridLayout);

    const whetherNeedSave = useMemo(() => JSON.stringify(dataList) === localStorage.getItem("dataList") && JSON.stringify(gridLayout) === localStorage.getItem("gridLayout"), [dataList, gridLayout, open]);
    const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []); // const ResponsiveGridLayout = WidthProvider(Responsive); // 如果不使用 useMemo 只能放到函数外面

    const addCardItem = () => {
        if (!addItemText) return;
        const newId = uuidv4()
        const newLayout = { i: newId, x: 1000, y: 1000, w: 2, h: 2 } // 保证永远加到最右下角
        let newItem;

        if (addItemType === "task") {
            newItem = {
                id: newId,
                name: addItemText,
                type: "task",
                headColor: "#8d8d8d",
                subList: []
            }
        } else if (addItemType === "text") {
            newItem = {
                id: newId,
                name: addItemText,
                type: "text",
                headColor: "#8d8d8d",
                text: ""
            }
        }

        setDataList(oldList => ({ ...oldList, [newId]: newItem }))
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

    const handleSave = () => {
        localStorage.setItem("gridLayout", JSON.stringify(gridLayout))
        localStorage.setItem("dataList", JSON.stringify(dataList))
        setOpen(true)
        setTimeout(() => {
            setOpen(false)
        }, 2000)
    }

    const handleDeleteCard = (id) => {
        // const newList = dataList.filter(item => item.id !== id)
        setDataList((oldData) => {
            const newList = { ...oldData }
            delete newList[id]
            return newList
        })
    }

    const handleSubItemAdd = (id, text) => {
        setDataList((oldData) => {
            return ({
                ...oldData,
                [id]: {
                    ...oldData[id],
                    subList: [...oldData[id].subList, { id: uuidv4(), taskName: text, checked: false }]
                }
            })
        })
    }

    const handleSubItemCheck = (cardId, taskId, ifChecked) => {
        setDataList((oldData) => {
            return ({
                ...oldData,
                [cardId]: {
                    ...oldData[cardId],
                    subList: oldData[cardId].subList.map(subItem => {
                        if (subItem.id === taskId) {
                            subItem.checked = ifChecked
                        }
                        return subItem
                    })
                }
            })
        })
    }

    const handleLine = (cardId, taskId) => {
        setDataList((oldData) => {
            return ({
                ...oldData,
                [cardId]: {
                    ...oldData[cardId],
                    subList: oldData[cardId].subList.map(subItem => {
                        if (subItem.id === taskId) {
                            subItem.line = !subItem.line
                        }
                        return subItem
                    })
                }
            })
        })
    }

    const handleHeaderColor = (cardId, color) => {
        setDataList((dataList) => {
            return ({
                ...dataList,
                [cardId]: {
                    ...dataList[cardId],
                    headColor: color
                }
            })
        })
    }

    const handleDeleteTask = (cardId, taskId) => {
        setDataList((dataList) => {
            return ({
                ...dataList,
                [cardId]: {
                    ...dataList[cardId],
                    subList: dataList[cardId].subList.filter(subItem => subItem.id !== taskId)
                }
            })
        })
    }

    const handleNamechange = (id, name) => {
        setDataList((dataList) => {
            return ({
                ...dataList,
                [id]: {
                    ...dataList[id],
                    name: name
                }
            })
        })
    }

    const handleTextChange = (id, text) => {
        setDataList((dataList) => {
            return ({
                ...dataList,
                [id]: {
                    ...dataList[id],
                    text: text
                }
            })
        })
    }

    const handleItemNameChange = (cardId, taskId, text) => {
        setDataList((dataList) => {
            return ({
                ...dataList,
                [cardId]: {
                    ...dataList[cardId],
                    subList: dataList[cardId].subList.map(subItem => {
                        if (subItem.id === taskId) {
                            subItem.taskName = text
                        }
                        return subItem
                    })
                }
            })
        })
    }

    const handleLayoutChange = (layout, layouts) => {
        setGridLayout(layouts)
    };

    const onDragEnd = (result, columns, setColumns) => {

        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.subList];
            const destItems = [...destColumn.subList];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    subList: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    subList: destItems,
                },
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.subList];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    subList: copiedItems,
                },
            });
        }
    };



    // https://github.com/react-grid-layout/react-grid-layout#responsive-grid-layout-props
    return (
        <DragDropContext
            onDragEnd={(result) => onDragEnd(result, dataList, setDataList)}
        >
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
                    <Switch id="Draggable" label="Draggable" ripple={true} checked={isDraggable} onChange={(e) => setIsDraggable(e.target.checked)} />
                    <DownLoadDialog dataList={dataList} openDialog={openDialog} handleDialog={() => { setOpenDialog((cur) => !cur) }} />
                    <div className="relative flex w-full max-w-[24rem] ml-5" >
                        <Menu placement="bottom-start">
                            <MenuHandler>
                                <Button
                                    ripple={false}
                                    variant="text"
                                    color="blue-gray"
                                    className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                                >
                                    {addItemType}
                                </Button>
                            </MenuHandler>
                            <MenuList className="min-w-[80px]">
                                <MenuItem onClick={() => setAddItemType("text")}>
                                    <span>Text</span>
                                </MenuItem>
                                <MenuItem onClick={() => setAddItemType("task")}>
                                    <span>Task</span>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        <Input
                            value={addItemText}
                            onChange={({ target }) => setAddItemText(target.value)}
                            className="rounded-l-none !border-t-blue-gray-200 focus:!border-t-blue-500 pr-20"
                            containerProps={{
                                className: "min-w-0",
                            }}
                            labelProps={{
                                className: "before:content-none after:content-none",
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
                    rowHeight={150}
                    onLayoutChange={handleLayoutChange}
                    isDraggable={isDraggable}
                    useCSSTransforms={false}
                >
                    {Object.entries(dataList).filter(([dataKey, dataValue]) => dataValue.type === "task").map(([dataKey, dataValue], index) => {
                        return (
                            // !transform-none fix the bug of draggable item offset from mouse cursor
                            // https://github.com/atlassian/react-beautiful-dnd/issues/1003#issuecomment-762746127
                            <div
                                className={`pt-4 p-1 ${isDraggable ? "cursor-move" : ""}`}
                                key={dataKey}
                            >
                                <DraggableTaskCard
                                    key={dataKey}
                                    cardData={dataValue}
                                    handleDeleteCard={handleDeleteCard}
                                    handleSubItemAdd={handleSubItemAdd}
                                    handleSubItemCheck={handleSubItemCheck}
                                    handleDeleteTask={handleDeleteTask}
                                    handleLine={handleLine}
                                    handleNamechange={handleNamechange}
                                    handleItemNameChange={handleItemNameChange}
                                    handleHeaderColor={handleHeaderColor}
                                />
                            </div>
                        )
                    })}
                    {Object.entries(dataList).filter(([dataKey, dataValue]) => dataValue.type === "text").map(([dataKey, dataValue], index) => {
                        return (
                            <div
                                className={`pt-4 p-1 ${isDraggable ? "cursor-move" : ""}`}
                                key={dataKey}
                            >
                                <DraggableTextCard
                                    key={dataKey}
                                    cardData={dataValue}
                                    handleDeleteCard={handleDeleteCard}
                                    handleNamechange={handleNamechange}
                                    handleTextChange={handleTextChange}
                                    handleHeaderColor={handleHeaderColor}
                                />
                            </div>
                        )
                    })}
                </ResponsiveGridLayout>
            </div>
        </DragDropContext>
    )
}

export default Today2


const DraggableTaskCard = ({ cardData, handleDeleteCard, handleSubItemAdd, handleSubItemCheck, handleDeleteTask, handleLine, handleNamechange, handleItemNameChange, handleHeaderColor }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editingText, setEditingText] = useState("")
    const [addItemText, setAddItemText] = useState("")
    const [openMenu, setOpenMenu] = useState(false);
    const [isMounted, setIsMounted] = useState(false); // fix the dnd bug
    const [headerColor, setHeaderColor] = useState(cardData.headColor)
    const [isColorPickerDisplay, setIsColorPickerDisplay] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const triggers = {
        onMouseEnter: () => setOpenMenu(true),
        onMouseLeave: () => setOpenMenu(false),
    };


    const handleAdd = () => {
        handleSubItemAdd(cardData.id, addItemText)
        setAddItemText("")
    }

    const handleChangeName = () => {
        handleNamechange(cardData.id, editingText)
        setEditingText("")
        setIsEditing(false)
    }

    const handleColorChange = (color) => {
        setHeaderColor(color.hex)
    }

    const handleComfirm = () => {
        handleHeaderColor(cardData.id, headerColor)
        setIsColorPickerDisplay(false)
    }

    const isDarkColor = (hexColor) => {
        const hex = hexColor.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        const rgbColor = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
        if (!rgbColor) return false;
        const brightness = (rgbColor.r * 299 + rgbColor.g * 587 + rgbColor.b * 114) / 1000;
        return brightness < 128;
    }

    const isDark = useMemo(() => isDarkColor(headerColor), [headerColor])


    return (
        isMounted ? <Droppable
            key={cardData.id}
            droppableId={cardData.id}
        >
            {(provided, snapshot) => {
                // console.log(column.items);
                return (
                    <div
                        className="w-full h-full"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <Card className="w-full h-full pb-4 pt-5 group/card relative">
                            {isColorPickerDisplay && <div className={`absolute right-1/2 top-2 translate-x-1/2 z-[1000] p-4 bg-white/80 rounded-xl shadow-lg`}>
                                <ChromePicker onChange={handleColorChange} color={headerColor} />
                                <div className='flex justify-evenly mt-4'>
                                    <Button color='gray' variant="outlined" size='sm' onClick={() => setIsColorPickerDisplay(false)}>Cancel</Button>
                                    <Button color='gray' variant="filled" size='sm' onClick={handleComfirm}>Confirm</Button>
                                </div>
                            </div>}
                            <CardHeader
                                variant="gradient"
                                className="grid h-10 place-items-center group/header absolute w-11/12 mx-0 top-1.5 left-1/2 -translate-x-1/2"
                                style={{ backgroundColor: cardData.headColor, boxShadow: cardData.headColor }}
                            >
                                {isEditing ?
                                    <div className="relative flex w-full max-w-[24rem]">
                                        <Input
                                            type="text"
                                            color={isDark ? "white" : "gray"}
                                            value={editingText}
                                            onChange={(e) => { setEditingText(e.target.value) }}
                                            placeholder={cardData.name}
                                            className="!border-none"
                                            labelProps={{
                                                className: "hidden"
                                            }}
                                        />
                                        <IconButton className="!absolute right-3 top-2 rounded-lg w-6 h-6" color={isDark ? "white" : "gray"} onClick={handleChangeName}>
                                            <CheckIcon className="h-5 w-5" />
                                        </IconButton>
                                        <IconButton variant="text" className="!absolute right-10 w-6 h-6 top-2 rounded-lg" color={isDark ? "white" : "gray"} onClick={() => setIsEditing(false)}>
                                            <XMarkIcon className="h-5 w-5" />
                                        </IconButton>
                                    </div>
                                    :
                                    <Typography variant="h6" color={isDark ? "white" : "gray"}>
                                        {cardData.name}
                                    </Typography>
                                }
                                {/* <XMarkIcon onClick={() => handleDeleteCard(cardData.id)} className="h-5 w-5 fixed right-7 top-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                                {!isEditing && <ListItemSuffix className="fixed right-2 top-2.5 h-0" {...triggers}>
                                    <Menu
                                        open={openMenu}
                                        handler={setOpenMenu}
                                        placement="bottom-end"
                                        animate={{
                                            mount: { y: 0 },
                                            unmount: { y: 25 },
                                        }}
                                    >
                                        <MenuHandler>
                                            <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer opacity-0 group-hover/header:opacity-100 " color={isDark ? "white" : "gray"} />
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem className="flex items-center gap-2" onClick={() => handleDeleteCard(cardData.id)}>
                                                <XMarkIcon className="h-5 w-5" />
                                                <Typography variant="small" className="font-normal">
                                                    Delete
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem className="flex items-center gap-2" onClick={() => { setIsEditing(true); setEditingText(cardData.name) }}>
                                                <PencilSquareIcon className="h-5 w-5" />
                                                <Typography variant="small" className="font-normal">
                                                    Edit
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem className="flex items-center gap-2" onClick={() => { setIsColorPickerDisplay(true) }}>
                                                <SparklesIcon className="h-5 w-5" />
                                                <Typography variant="small" className="font-normal">
                                                    Color Picker
                                                </Typography>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </ListItemSuffix>}
                            </CardHeader>
                            <CardBody className="flex flex-col p-0 overflow-scroll max-h-full">
                                <List ripple={true}>
                                    {cardData.subList.map((item, index) => {
                                        return <CheckListItem
                                            key={item.id}
                                            index={index}
                                            cardId={cardData.id}
                                            subItem={item}
                                            handleSubItemCheck={handleSubItemCheck}
                                            handleDeleteTask={handleDeleteTask}
                                            handleLine={handleLine}
                                            handleItemNameChange={handleItemNameChange}
                                        />
                                    })}
                                </List>
                                {provided.placeholder}
                                <div className="opacity-0 group-hover/card:opacity-100">
                                    <Popover
                                        placement="top-end"
                                        animate={{
                                            mount: { scale: 1, x: 0, y: 0 },
                                            unmount: { scale: 0, x: 120, y: 35 },
                                        }}
                                    >
                                        <PopoverHandler onClick={() => setAddItemText("")}>
                                            <PlusIcon className="h-5 w-5 fixed right-4 bottom-4 cursor-pointer" />
                                        </PopoverHandler>
                                        <PopoverContent className="group/card">
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
                                </div>
                            </CardBody>
                        </Card>
                    </div>)
            }}
        </Droppable>
            : ""
    )
}

const DraggableTextCard = ({ cardData, handleDeleteCard, handleNamechange, handleTextChange, handleHeaderColor }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [openMenu, setOpenMenu] = useState(false);
    const [editingText, setEditingText] = useState("")
    const [headerColor, setHeaderColor] = useState(cardData.headColor)
    const [isColorPickerDisplay, setIsColorPickerDisplay] = useState(false)

    const [isContentEditable, setIsContentEditable] = useState(false)
    const [text, setText] = useState(cardData.text)

    const triggers = {
        onMouseEnter: () => setOpenMenu(true),
        onMouseLeave: () => setOpenMenu(false),
    };

    const handleChangeName = () => {
        handleNamechange(cardData.id, editingText)
        setEditingText("")
        setIsEditing(false)
    }

    const handleContentChange = () => {
        handleTextChange(cardData.id, text)
        setIsContentEditable(false)
    }


    const handleColorChange = (color) => {
        setHeaderColor(color.hex)
    }

    const handleComfirm = () => {
        handleHeaderColor(cardData.id, headerColor)
        setIsColorPickerDisplay(false)
    }

    const isDarkColor = (hexColor) => {
        if (!hexColor) return false
        const hex = hexColor.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        const rgbColor = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
        if (!rgbColor) return false;
        const brightness = (rgbColor.r * 299 + rgbColor.g * 587 + rgbColor.b * 114) / 1000;
        return brightness < 128;
    }

    const isDark = useMemo(() => isDarkColor(headerColor), [headerColor])



    return (
        <Card className={`w-full h-full py-4 group/card`}>
            {isColorPickerDisplay && <div className={`absolute right-1/2 top-2 translate-x-1/2 !z-[1000] p-4 bg-white/80 rounded-xl shadow-lg`}>
                <ChromePicker onChange={handleColorChange} color={headerColor} />
                <div className='flex justify-evenly mt-4'>
                    <Button color='gray' variant="outlined" size='sm' onClick={() => setIsColorPickerDisplay(false)}>Cancel</Button>
                    <Button color='gray' variant="filled" size='sm' onClick={handleComfirm}>Confirm</Button>
                </div>
            </div>}
            <CardHeader
                variant="gradient"
                className="grid h-10 place-items-center group/header absolute w-11/12 mx-0 top-1.5 left-1/2 -translate-x-1/2"
                style={{ backgroundColor: cardData.headColor, boxShadow: cardData.headColor }}
            >
                {isEditing ?
                    <div className="relative flex w-full max-w-[24rem]">
                        <Input
                            type="text"
                            color={isDark ? "white" : "gray"}
                            value={editingText}
                            onChange={(e) => { setEditingText(e.target.value) }}
                            placeholder={cardData.name}
                            className="!border-none"
                            labelProps={{
                                className: "hidden"
                            }}
                        />
                        <IconButton className="!absolute right-3 top-2 rounded-lg w-6 h-6 " color={isDark ? "white" : "gray"} onClick={handleChangeName}>
                            <CheckIcon className="h-5 w-5" />
                        </IconButton>
                        <IconButton variant="text" className="!absolute right-10 w-6 h-6 top-2 rounded-lg" color={isDark ? "white" : "gray"} onClick={() => setIsEditing(false)}>
                            <XMarkIcon className="h-5 w-5" />
                        </IconButton>
                    </div>
                    :
                    <Typography variant="h6" color={isDark ? "white" : "gray"}>
                        {cardData.name}
                    </Typography>
                }
                {!isEditing && <ListItemSuffix className="fixed right-2 top-2.5 h-0" {...triggers}>
                    <Menu
                        open={openMenu}
                        handler={setOpenMenu}
                        placement="bottom-end"
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: 25 },
                        }}
                    >
                        <MenuHandler>
                            <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer opacity-0 group-hover/header:opacity-100" color={isDark ? "white" : "gray"} />
                        </MenuHandler>
                        <MenuList>
                            <MenuItem className="flex items-center gap-2" onClick={() => handleDeleteCard(cardData.id)}>
                                <XMarkIcon className="h-5 w-5" />
                                <Typography variant="small" className="font-normal">
                                    Delete
                                </Typography>
                            </MenuItem>
                            <MenuItem className="flex items-center gap-2" onClick={() => { setIsEditing(true); setEditingText(cardData.name) }}>
                                <PencilSquareIcon className="h-5 w-5" />
                                <Typography variant="small" className="font-normal">
                                    Edit
                                </Typography>
                            </MenuItem>
                            <MenuItem className="flex items-center gap-2" onClick={() => { setIsColorPickerDisplay(true) }}>
                                <SparklesIcon className="h-5 w-5" />
                                <Typography variant="small" className="font-normal">
                                    Color Picker
                                </Typography>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </ListItemSuffix>}
            </CardHeader>
            <CardBody className="p-2 pt-4 pb-0 h-full text-card overflow-scroll">
                {
                    isContentEditable ?
                        <div>
                            <TextareaAutosize
                                minRows={8}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-1 focous:border-none focus:outline-none max-h-full font-light"
                            />
                            <div className="absolute right-2 bottom-2 flex gap-2 items-center">
                                <IconButton variant="text" className="w-6 h-6 rounded-lg" color='gray' onClick={() => { setIsContentEditable(false) }} >
                                    <XMarkIcon className="h-5 w-5" />
                                </IconButton>
                                <IconButton className="rounded-lg w-6 h-6" color='gray' onClick={handleContentChange} >
                                    <CheckIcon className="h-5 w-5" />
                                </IconButton>
                            </div>
                        </div>
                        :
                        <div className="px-2 font-light">
                            {cardData.text}
                            <IconButton
                                className="rounded-full !absolute right-2 bottom-2 opacity-0 group-hover/card:opacity-100"
                                size="sm"
                                color="gray"
                                onClick={() => { setIsContentEditable(true) }}
                            >
                                <PencilSquareIcon className="h-4 w-4" />
                            </IconButton>
                        </div>
                }

            </CardBody>
        </Card>
    )
}

const CheckListItem = ({ cardId, index, subItem, handleSubItemCheck, handleDeleteTask, handleLine, handleItemNameChange }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState("")

    const triggers = {
        onMouseEnter: () => setOpenMenu(true),
        onMouseLeave: () => setOpenMenu(false),
    };

    const handleCheck = (e) => {
        const ifChecked = e.target.checked
        handleSubItemCheck(cardId, subItem.id, ifChecked)
    }

    const handleChangeName = () => {
        setEditingText("")
        setIsEditing(false)
        handleItemNameChange(cardId, subItem.id, editingText)
    }

    return (
        <Draggable key={subItem.id} draggableId={subItem.id} index={index}>
            {(provided, snapshot) => {
                // console.log(snapshot.isDragging);

                return (
                    <div className="relative">
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        // style={{ ...provided.draggableProps.style, top: "0px !important", left: "0px !important" }}
                        // style={{ ...provided.draggableProps.style, position: "static !important" }}
                        >
                            <ListItem
                                ripple={false}
                                className={`p-0 group/item ${subItem.line ? "line-through decoration-gray-600" : ""}`}
                            >
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
                                    {isEditing ?
                                        <div className="relative flex w-full max-w-[24rem]">
                                            <Input
                                                type="text"
                                                value={editingText}
                                                onChange={(e) => { setEditingText(e.target.value) }}
                                                placeholder={subItem.taskName}
                                                className="!p-0 !border-none"
                                                labelProps={{
                                                    className: "hidden"
                                                }}
                                            />
                                            <IconButton className="!absolute right-0 top-2 rounded-lg w-6 h-6" color='gray' onClick={handleChangeName}>
                                                <CheckIcon className="h-5 w-5" />
                                            </IconButton>
                                            <IconButton variant="text" className="!absolute right-7 w-6 h-6 top-2 rounded-lg" color='gray' onClick={() => setIsEditing(false)}>
                                                <XMarkIcon className="h-5 w-5" />
                                            </IconButton>
                                        </div>
                                        :
                                        <Typography color="blue-gray" className="font-light">{subItem.taskName}</Typography>
                                    }
                                </label>
                                {!isEditing && <ListItemSuffix className="h-full" {...triggers}>
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
                                            <EllipsisVerticalIcon className="h-5 w-5 mr-2 opacity-0 group-hover/item:opacity-100" />
                                        </MenuHandler>
                                        <MenuList>
                                            <MenuItem className="flex items-center gap-2" onClick={() => { setIsEditing(true); setEditingText(subItem.taskName) }}>
                                                <PencilSquareIcon className="h-5 w-5" />
                                                <Typography variant="small" className="font-normal">
                                                    Edit
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem className="p-0">
                                                <CopyToClipboard text={subItem.taskName} onCopy={() => { }}>
                                                    <div className="flex items-center gap-2 pb-2 pt-[9px] px-3 ">
                                                        <DocumentDuplicateIcon strokeWidth={2} className="h-4 w-4" />
                                                        <Typography variant="small" className="font-normal">
                                                            Copy
                                                        </Typography>
                                                    </div>
                                                </CopyToClipboard>
                                            </MenuItem>
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
                                </ListItemSuffix>}
                            </ListItem>
                        </div>
                    </div>
                )
            }}
        </Draggable >
    )
}

const DownLoadDialog = ({ dataList, openDialog, handleDialog }) => {

    const [isDisplayFinished, setIsDisplayFinished] = useState(true) // true 表示只展示完成的
    const [isGroup, setIsGroup] = useState(true) // true 表示按照卡片名称分组
    const [isMarkdown, setIsMarkdown] = useState(false)

    const generateMarkdown = (data, ifDisplayFinished, ifGroup) => {
        console.log(data, ifDisplayFinished, ifGroup);
        let markdown = ``;
        if (ifGroup) {
            Object.entries(data).forEach(([key, element]) => {
                if (element.type === "task" && element.subList?.length !== 0) {
                    markdown += `## ${element.name} \n
        `
                    element.subList.forEach(subItem => {
                        if (ifDisplayFinished) {
                            if (subItem.checked) markdown += `- ${subItem.taskName} \n
        `
                        } else {
                            markdown += `* [${subItem.checked ? 'x' : ' '}] ${subItem.taskName} \n
        `
                        }
                    })
                }
            });
        } else {
            Object.entries(data).forEach(([key, element]) => {
                if (element.type === "task" && element.subList?.length !== 0) {
                    element.subList.forEach(subItem => {
                        if (ifDisplayFinished) {
                            if (subItem.checked) markdown += `- ${element.name}:${subItem.taskName} \n
        `
                        } else {
                            markdown += `- ${element.name}:${subItem.taskName} \n
        `
                        }
                    })
                }
            });
        }

        return markdown
    }

    const generateText = (data, ifDisplayFinished, ifGroup) => {
        let text = "";
        if (ifGroup) {
            Object.entries(data).forEach(([key, element]) => {
                console.log(element.type);
                if (element.type === "task" && element.subList?.length !== 0) {
                    element.subList.forEach(subItem => {
                        if (ifDisplayFinished) {
                            if (subItem.checked) text += "✅" + subItem.taskName + "\n"
                        } else {
                            if (subItem.checked) {
                                text += "✅" + subItem.taskName + "\n"
                            } else {
                                text += "❌" + subItem.taskName + "\n"
                            }
                        }
                    })
                }
            })
        } else {
            Object.entries(data).forEach(([key, element]) => {
                if (element.type === "task" && element.subList?.length !== 0) {
                    element.subList.forEach(subItem => {
                        if (ifDisplayFinished) {
                            if (subItem.checked) text += "✅" + element.name + ":" + subItem.taskName + "\n"
                        } else {
                            if (subItem.checked) {
                                text += "✅" + element.name + ":" + subItem.taskName + "\n"
                            } else {
                                text += "❌" + element.name + ":" + subItem.taskName + "\n"
                            }
                        }
                    })
                }
            });
        }

        return text
    }

    const markdonwText = openDialog ?
        (
            isMarkdown ?
                generateMarkdown(dataList, isDisplayFinished, isGroup)
                :
                generateText(dataList, isDisplayFinished, isGroup)
        )
        :
        ""

    return (<>
        <Button onClick={handleDialog} variant="gradient">
            Export
        </Button>
        <Dialog open={openDialog} handler={handleDialog} size="lg">
            <DialogHeader>Export Data Of Today</DialogHeader>
            <DialogBody divider>
                <div className="flex justify-around  bg-gray-100 p-2 rounded-lg">
                    <Switch id='Finished' label="Display Finished Only" ripple={true} checked={isDisplayFinished} onChange={(e) => setIsDisplayFinished(e.target.checked)} />
                    <Switch id='Group' label="Group By Title" ripple={true} checked={isGroup} onChange={(e) => setIsGroup(e.target.checked)} />
                    <Switch id='Markdown' label="Is Markdown" ripple={true} checked={isMarkdown} onChange={(e) => setIsMarkdown(e.target.checked)} />
                </div>
                <div className="markdownCss mt-4 max-h-[400px] overflow-scroll">
                    {isMarkdown ? <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdonwText} /> : <Typography>{markdonwText}</Typography>}
                </div>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={handleDialog}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <CopyToClipboard text={markdonwText} onCopy={() => { }}>
                    <Button variant="gradient" color="green" onClick={handleDialog}>
                        <span>Copy</span>
                    </Button>
                </CopyToClipboard>
            </DialogFooter>
        </Dialog >
    </>)
}