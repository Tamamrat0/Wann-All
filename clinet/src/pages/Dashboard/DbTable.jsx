import React, { useState, useContext, useEffect, Fragment } from "react";

import { CSS } from "@dnd-kit/utilities";
import {arrayMove,SortableContext,useSortable,verticalListSortingStrategy} from "@dnd-kit/sortable";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Table } from "antd";
import {AiOutlineMenu} from 'react-icons/ai'
export default function DbTable(){
    const columns = [
        {
          key: "sort"
        },
        {
          title: "Name",
          dataIndex: "name"
        },
        {
          title: "Age",
          dataIndex: "age"
        },
        {
          title: "Address",
          dataIndex: "address"
        }
      ];
      const Row = ({ children, ...props }) => {
        const {
          attributes,
          listeners,
          setNodeRef,
          setActivatorNodeRef,
          transform,
          transition,
          isDragging
        } = useSortable({
          id: props["data-row-key"]
        });
        const style = {
          ...props.style,
          transform: CSS.Transform.toString(
            transform && {
              ...transform,
              scaleY: 1
            }
          ),
          transition,
          ...(isDragging
            ? {
                position: "relative",
                zIndex: 9999
              }
            : {})
        };
        return (
          <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
              if (child.key === "sort") {
                return React.cloneElement(child, {
                  children: (
                    <AiOutlineMenu className="w-6 h-6 cursor-grab"
                      ref={setActivatorNodeRef}
                    //   style={{
                    //     touchAction: "none",
                    //     cursor: "grab"
                    //   }}
                      {...listeners}
                    />
                  )
                });
              }
              return child;
            })}
          </tr>
        );
      };
      const [dataSource, setDataSource] = useState([
        {
          key: "1",
          name: "John Brown",
          age: 1,
          address:
            "Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text"
        },
        {
          key: "2",
          name: "Jim Green",
          age: 2,
          address: "London No. 1 Lake Park"
        },
        {
          key: "3",
          name: "Joe Black",
          age: 3,
          address: "Sidney No. 1 Lake Park"
        }
      ]);
      const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
          setDataSource((previous) => {
            const activeIndex = previous.findIndex((i) => i.key === active.id);
            const overIndex = previous.findIndex((i) => i.key === over?.id);
            return arrayMove(previous, activeIndex, overIndex);
          });
        }
      };
      console.log(dataSource);
    return(
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          // rowKey array
          items={dataSource.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: Row
              }
            }}
            rowKey="key"
            columns={columns}
            dataSource={dataSource}
          />
        </SortableContext>
      </DndContext>
    )
}