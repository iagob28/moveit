import { createContext, useEffect, useState } from "react";
import { Challenges } from "../components/Challenges/Challenges";
import { NoChallengeInfo } from "../components/NoChallenges/NoChallengeInfo";
import differenceInSeconds from "date-fns/differenceInSeconds";

type TimerContextType = {
  seconds: number;
  changeSeconds: Function;
  isActive: boolean;
  changeIsActive: Function;
  card: JSX.Element;
};

type propsType = {
  children?: JSX.Element;
};

export const TimerContext = createContext({} as TimerContextType);
let timeout: NodeJS.Timeout;
const COUNTDOWN_AMOUNT_TOTAL = 25 * 60; // 25 minutes for timer

export function TimerContextProvider(props: propsType) {
  const [seconds, setSeconds] = useState<number>(COUNTDOWN_AMOUNT_TOTAL);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [card, setCard] = useState<JSX.Element>(<NoChallengeInfo />);

  function changeIsActive() {
    setIsActive(!isActive);
  }

  function changeSeconds(sec: number) {
    setSeconds(sec);
  }

  useEffect(() => {
    setCard(<NoChallengeInfo />);
    const startTime = new Date();
    if (isActive && seconds > 0) {
      timeout = setTimeout(() => {
        const actualTime = new Date();
        setSeconds(
          (state) => state - differenceInSeconds(actualTime, startTime)
        );
      }, 1000);
    } else {
      clearTimeout(timeout);
      if (seconds === 0) {
        setCard(<Challenges />);
      }
    }
  }, [seconds, isActive]);

  return (
    <TimerContext.Provider
      value={{ seconds, changeSeconds, isActive, changeIsActive, card }}
    >
      {props.children}
    </TimerContext.Provider>
  );
}
