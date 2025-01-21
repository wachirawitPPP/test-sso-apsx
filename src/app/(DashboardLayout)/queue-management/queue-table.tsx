"use client";
import CardBox from "@/app/components/shared/CardBox";
import {
  Button,
  Dropdown,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import React, { useEffect, useState } from "react";

const obj = {
  id: 1,
  name: "นาย ทดสอบ ทดสอบ",
  department: "แผนกฉุกเฉินและอุบัติเหตุ",
  roomId: "A1",
  status: "active",
};

const departmentList = [
  {
    id: 0,
    name: "ไม่ระบุ",
  },
  {
    id: 1,
    name: "แผนกฉุกเฉินและอุบัติเหตุ",
  },
  {
    id: 2,
    name: "แผนกจิตเวช",
  },
];

const roomList = [
  {
    id: 0,
    name: "ไม่ระบุ",
  },
  {
    id: 1,
    name: "A1",
  },
  {
    id: 2,
    name: "A2",
  },
];

const dataList = Array.from({ length: 100 }, (_, index) => ({
  ...obj,
  id: index + 1, // Increment the id field
  roomId: index % 2 != 0 ? "A2" : "A1", // "A2" for the first 11 items, "A1" for the rest
  department: index % 2 != 0 ? "แผนกฉุกเฉินและอุบัติเหตุ" : "แผนกจิตเวช",
  name: index % 2 != 0 ? "mr.test test" : "นาย ทดสอบ ทดสอบ",
}));
export default function QueueTable() {
  const [numQueue, setNumQueue] = React.useState(0);
  const [roomNumTH, setRoomNumTH] = React.useState("เอ2");
  const [roomNumEN, setRoomNumEN] = React.useState("A1");
  const [queueList, setQueueList] = React.useState(dataList);
  const [departmentFillter, setDepartmentFillter] = React.useState("ไม่ระบุ");
  const [roomIdFillter, setRoomIdFillter] = React.useState("ไม่ระบุ");
  let dropdownStyle =
    "w-56 shadow-md rounded-xl border-2 border-solid border-slate-300 px-4 flex flex-center justify-around";

  // voice speak
  function speak(respeak: boolean) {
    let num = numQueue;
    if (!respeak) {
      setNumQueue(numQueue + 1);
      num = numQueue + 1;
    }
    let text =
      "ขอเชิญหมายเลข" +
      num.toString() +
      "คุณ ประสาน ศรีโสภา" +
      "ที่ห้อง" +
      roomNumTH;
    let utterance = new SpeechSynthesisUtterance(text);
    let voicesArray = speechSynthesis.getVoices();
    //  voicesArray filter "th-TH" thailand
    let voiceTH = voicesArray.filter(
      (item) =>
        item.lang == "th-TH" &&
        item.voiceURI == "Microsoft Premwadee Online (Natural) - Thai (Thailand)"
    );
    if (voiceTH.length > 0) utterance.voice = voiceTH[0];
    // speed speak rate 1-5 slow to fast
    utterance.rate = 1;
    utterance.pitch = 5;
    speechSynthesis.speak(utterance);
  }

  // fillter data list
  function fillter(mode: string, data: any) {
    switch (mode) {
      case "department":
        setDepartmentFillter(data.name);
        break;
      case "roomId":
        setRoomIdFillter(data.name);
        break;
      default:
        setDepartmentFillter("");
        setRoomIdFillter("");
        break;
    }
  }

  function searchFilter() {
    // กรองข้อมูลโดยใช้เงื่อนไขที่เลือกใน Dropdown
    const filteredList = dataList.filter((item) => {
      const matchDepartment =
        departmentFillter === "ไม่ระบุ" ||
        item.department === departmentFillter;
      const matchRoom =
        roomIdFillter === "ไม่ระบุ" || item.roomId === roomIdFillter;

      return matchDepartment && matchRoom;
    });

    // อัปเดตค่าของ queueList ด้วยรายการที่กรองแล้ว
    setQueueList(filteredList);
  }

  return (
    <>
      <div className="flex justify-center grid  grid-cols-3 ">
        <div className="w-full flex flex-wrap gap-4 col-span-2 items-center justify-between">
          <div className="w-1/3">
            <p className="text-4xl px-4">หมายเลขห้อง {roomNumEN}</p>
          </div>
          <div className="w-1/2 flex  gap-4 justify-items-end">
            <div className={dropdownStyle}>
              <Dropdown
                label={
                  departmentFillter == "ไม่ระบุ"
                    ? "กรองแผนก"
                    : departmentFillter
                }
                placement="bottom"
                inline
              >
                {departmentList.map((item, index) => (
                  <Dropdown.Item
                    key={item.id}
                    onClick={() => fillter("department", item)}
                  >
                    {item.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
            <div className={dropdownStyle}>
              <Dropdown
                label={roomIdFillter == "ไม่ระบุ" ? "กรองห้อง" : roomIdFillter}
                placement="bottom"
                inline
              >
                {roomList.map((item, index) => (
                  <Dropdown.Item
                    key={item.id}
                    onClick={() => fillter("roomId", item)}
                  >
                    {item.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
            <div>
              <Button
                gradientDuoTone="purpleToBlue"
                onClick={() => searchFilter()}
              >
                ค้นหา
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center grid  grid-cols-3 h-80">
        <div className="col-span-2 p-4  h-96">
          <div className="overflow-x-auto overflow-y-scroll h-full r-4 shadow-md rounded border-2 border-solid border-slate-300 ">
            <Table>
              <TableHead className="bg-cyan-200">
                <TableHeadCell>ลำดับ</TableHeadCell>
                <TableHeadCell>ชื่อ-นามสกุล</TableHeadCell>
                <TableHeadCell>แผนก</TableHeadCell>
                <TableHeadCell>ห้อง</TableHeadCell>
                <TableHeadCell>สถานะ</TableHeadCell>
              </TableHead>
              <TableBody>
                {queueList.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={`bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-cyan-50 ${
                      item.roomId === roomNumEN
                        ? "text-slate-950 font-bold"
                        : ""
                    }`}
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {item.id}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.roomId}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="w-full p-4 h-2/6">
          <CardBox className="shadow-md  border-2 border-solid border-slate-300 w-full h-60 ">
            <div className="flex justify-center">
              <h5 className="text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
                {numQueue}
              </h5>
            </div>
          </CardBox>
          <div className="flex flex-col justify-evenly w-full p-4">
            <div className="py-4">
              <Button
                gradientDuoTone="greenToBlue"
                className="w-full shadow-md"
                onClick={() => speak(false)}
              >
                <p className="text-2xl"> คิวถัดไป</p>
              </Button>
            </div>
            <div>
              <Button
                gradientDuoTone="redToYellow"
                className="w-full shadow-md"
                onClick={() => speak(true)}
              >
                <p className="text-2xl">เรียกคิวซ้ำ</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
