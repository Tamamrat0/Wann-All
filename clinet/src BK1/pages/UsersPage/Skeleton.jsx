import { useState } from "react";

export default function Skeleton() {
  return (
    <>
      <form className=" w-full h-auto p-4 flex gap-6 flex-col xl:flex-row animate-pulse relative">
        <div className="w-full xl:w-2/12 flex justify-center items-center ">
          <div className="h-48 w-48 p-2 bg-gray-color dark:dark-text-color rounded-full "></div>
        </div>
        <div className="flex flex-col w-full xl:w-5/12 gap-2">
          <div className="h-8 my-1 bg-gray-color dark:dark-text-color rounded-xl w-2/6"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-full"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-4/6"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-full"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-3/6"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-5/6"></div>
        </div>
        <div className="flex flex-col w-full xl:w-5/12 gap-2">
          <div className="h-8 my-1 bg-gray-color dark:dark-text-color rounded-xl w-2/6"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-full"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-4/6"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-full"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-3/6"></div>
          <div className="h-4 my-1 bg-gray-color dark:dark-text-color rounded-xl w-5/6"></div>
        </div>
        <div className=" absolute inset-x-0 inset-y-0 top-60 xl:top-0  flex items-center justify-center text-text dark:text-dark-text-color ">เลือกผู้ใช้ด้านล่าง</div>
      </form>
     
    </>
  );
}
