import { ClockIcon } from "lucide-react";

const Time = ({ time, noIcon }: { time: string; noIcon?: boolean }) => {
  return (
    <>
      {!noIcon && <ClockIcon className="h-4 w-4" />}{" "}
      {new Date(time).getHours() > 12 ? (
        <>{new Date(time).getHours() - 12}</>
      ) : (
        <>{new Date(time).getHours()}</>
      )}
      :{new Date(time).getMinutes().toString().padStart(2, "0")}:
      {new Date(time).getSeconds().toString().padStart(2, "0")}
      {new Date(time).getHours() >= 12 ? " PM" : " AM"}
    </>
  );
};

export default Time;
