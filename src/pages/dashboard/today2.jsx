import React, { useState, useEffect, useMemo } from 'react'
import {
    Card, CardFooter, CardBody, CardHeader,
    Typography, List, ListItem, ListItemSuffix,
    Checkbox, IconButton, Switch, Input, Button,
    Alert, Popover, PopoverHandler, PopoverContent,
    Menu, MenuHandler, MenuList, MenuItem, ListItemPrefix,
    Dialog, DialogHeader, DialogBody, DialogFooter
} from '@material-tailwind/react'
import { v4 as uuidv4 } from 'uuid'
import { TrashIcon, CheckCircleIcon, XMarkIcon, PlusIcon, EllipsisVerticalIcon, MinusIcon, DocumentDuplicateIcon, CheckIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import TextareaAutosize from 'react-textarea-autosize';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Responsive, WidthProvider } from "react-grid-layout";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


// icon：https://heroicons.com/

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
    const [dataList, setDataList] = useState(JSON.parse(localStorage.getItem("dataList")) || {});
    const [summaryText, setSummaryText] = useState(localStorage.getItem("summary") || "");
    const [addItemText, setAddItemText] = useState("");
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false)
    const [isMounted, setIsMounted] = useState(false); // fix the dnd bug


    const whetherNeedSave = JSON.stringify(dataList) === localStorage.getItem("dataList") && JSON.stringify(gridLayout) === localStorage.getItem("gridLayout") && summaryText === localStorage.getItem("summary")


    const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []); // const ResponsiveGridLayout = WidthProvider(Responsive); // 如果不使用 useMemo 只能放到函数外面



    useEffect(() => {
        setIsMounted(true);
    }, []);


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
    }

    const handleSave = () => {
        localStorage.setItem("gridLayout", JSON.stringify(gridLayout))
        localStorage.setItem("dataList", JSON.stringify(dataList))
        localStorage.setItem("summary", summaryText)
        setOpen(true)
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

        console.log(result);

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
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
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
                    <DownLoadDialog dataList={dataList} openDialog={openDialog} handleDialog={() => setOpenDialog((cur) => !cur)} />
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
                    {Object.entries(dataList).map(([dataKey, dataValue], index) => {
                        return (
                            <div
                                className={`pt-4 p-1 ${isDraggable ? "cursor-move" : ""}`}
                                key={dataKey}
                            >
                                <DraggableCard
                                    key={dataKey}
                                    cardData={dataValue}
                                    handleDeleteCard={handleDeleteCard}
                                    handleSubItemAdd={handleSubItemAdd}
                                    handleSubItemCheck={handleSubItemCheck}
                                    handleDeleteTask={handleDeleteTask}
                                    handleLine={handleLine}
                                    handleNamechange={handleNamechange}
                                    handleItemNameChange={handleItemNameChange}
                                />
                                {/* {provided.placeholder} */}
                            </div>
                        )
                    })}
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
        </DragDropContext>
    )
}

export default Today2


const DraggableCard = ({ cardData, handleDeleteCard, handleSubItemAdd, handleSubItemCheck, handleDeleteTask, handleLine, handleNamechange, handleItemNameChange }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editingText, setEditingText] = useState("")
    const [addItemText, setAddItemText] = useState("")
    const [openMenu, setOpenMenu] = useState(false);

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

    // 嵌套group：不生效 https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups
    return (
        <Droppable key={cardData.id} droppableId={cardData.id}>
            {(provided, snapshot) => {
                // console.log(column.items);
                return (<Card
                    className="w-full h-full pt-2 pb-4 group/card"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <CardHeader
                        variant="gradient"
                        color="gray"
                        className="grid h-10 place-items-center group/header"
                    >
                        {isEditing ?
                            <div className="relative flex w-full max-w-[24rem]">
                                <Input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => { setEditingText(e.target.value) }}
                                    placeholder={cardData.name}
                                    className="!border-none"
                                    labelProps={{
                                        className: "hidden"
                                    }}
                                />
                                <IconButton className="!absolute right-3 top-2 rounded-lg w-6 h-6  bg-gray-700" onClick={handleChangeName}>
                                    <CheckIcon className="h-5 w-5" />
                                </IconButton>
                                <IconButton variant="text" className="!absolute right-10 w-6 h-6 top-2 rounded-lg text-gray-700" onClick={() => setIsEditing(false)}>
                                    <XMarkIcon className="h-5 w-5" />
                                </IconButton>
                            </div>
                            :
                            <Typography variant="h6" color="white">
                                {cardData.name}
                            </Typography>
                        }
                        {/* <XMarkIcon onClick={() => handleDeleteCard(cardData.id)} className="h-5 w-5 fixed right-7 top-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                        {!isEditing && <ListItemSuffix className="fixed right-6 top-2 h-0" {...triggers}>
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
                                    <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer opacity-0 group-hover/header:opacity-100" />
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
                                </MenuList>
                            </Menu>
                        </ListItemSuffix>}
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
                                    handleItemNameChange={handleItemNameChange}
                                />
                            })}
                        </List>
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
                </Card>)
            }}
        </Droppable>
    )
}

const CheckListItem = ({ cardId, subItem, handleSubItemCheck, handleDeleteTask, handleLine, handleItemNameChange }) => {
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

    // item?.line 只是为了兼容之前旧的数据，之后可以删掉？
    return (
        <Draggable key={subItem.id} draggableId={subItem.id}>
            <ListItem ripple={false} className={`p-0 group/item ${subItem?.line ? "line-through decoration-gray-600" : ""}`}>
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
                            <IconButton className="!absolute right-0 top-2 rounded-lg w-6 h-6  bg-gray-700" onClick={handleChangeName}>
                                <CheckIcon className="h-5 w-5" />
                            </IconButton>
                            <IconButton variant="text" className="!absolute right-7 w-6 h-6 top-2 rounded-lg text-gray-700" onClick={() => setIsEditing(false)}>
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
        </Draggable>
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
                if (element.subList.length !== 0) {
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
                if (element.subList.length !== 0) {
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
        console.log(data, ifDisplayFinished, ifGroup);
        let text = "";
        if (ifGroup) {
            Object.entries(data).forEach(([key, element]) => {
                if (element.subList.length !== 0) {
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
                if (element.subList.length !== 0) {
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