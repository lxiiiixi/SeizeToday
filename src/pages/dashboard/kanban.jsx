import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const data = [
    {
        id: '1',
        Task: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent.',
        // Assigned_To: 'Beltran',
        // Assignee: 'Romona',
        // Status: 'To-do',
        // Priority: 'Low',
        Due_Date: '25-May-2020',
    },
    {
        id: '2',
        Task: 'Fix Styling',
        // Assigned_To: 'Dave',
        // Assignee: 'Romona',
        // Status: 'To-do',
        // Priority: 'Low',
        Due_Date: '26-May-2020',
    },
    {
        id: '3',
        Task: 'Handle Door Specs',
        // Assigned_To: 'Roman',
        // Assignee: 'Romona',
        // Status: 'To-do',
        // Priority: 'Low',
        Due_Date: '27-May-2020',
    },
    {
        id: '4',
        Task: 'morbi',
        // Assigned_To: 'Gawen',
        // Assignee: 'Kai',
        // Status: 'Done',
        // Priority: 'High',
        Due_Date: '23-Aug-2020',
    },
    {
        id: '5',
        Task: 'proin',
        // Assigned_To: 'Bondon',
        // Assignee: 'Antoinette',
        // Status: 'In Progress',
        // Priority: 'Medium',
        Due_Date: '05-Jan-2021',
    },
];

const columnsFromBackend = {
    [uuidv4()]: {
        title: 'To-do',
        items: data,
    },
    [uuidv4()]: {
        title: 'In Progress',
        items: [],
    },
    [uuidv4()]: {
        title: 'Done',
        items: [],
    },
};

export function Kanban() {
    const [columns, setColumns] = useState(columnsFromBackend);
    const [isMounted, setIsMounted] = useState(false);

    console.log(columns);

    useEffect(() => {
        setIsMounted(true);
    }, []);



    const onDragEnd = (result, columns, setColumns) => {

        console.log(result);

        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems,
                },
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            });
        }
    };

    return (
        <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
            <div className="flex">
                <div className=" bg-blue-gray-100 flex w-full min-h-screen">
                    {Object.entries(columns).map(([columnId, column], index) => {
                        return (
                            isMounted ?
                                <Droppable key={columnId} droppableId={columnId}>
                                    {(provided, snapshot) => {
                                        // console.log(column.items);
                                        return (<div
                                            className=" max-h-10 flex flex-col bg-pink-50 min-w-[300px] mx-6 min-h-[500px] p-4"
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <p>{column.title}</p>
                                            {column.items.map((item, index) => {
                                                // console.log(item);
                                                return (<TaskCard key={item.id} item={item} index={index} />
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                        )
                                    }}
                                </Droppable>
                                : ""
                        );
                    })}
                </div>
            </div>
        </DragDropContext>
    )
}

const TaskCard = ({ item, index }) => {
    return (
        <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="flex flex-col justify-center items-center max-w-xs bg-white mt-4">
                        <p>{item.Task}</p>
                        <div className="secondary-details">
                            <p>
                                <span>
                                    {new Date(item.Due_Date).toLocaleDateString('en-us', {
                                        month: 'short',
                                        day: '2-digit',
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default Kanban;
