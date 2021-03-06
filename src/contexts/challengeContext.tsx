import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { useTimer } from "../hooks/useTimer";
import { database } from "../services/firebase";

type Challenge = {
  points: string;
  des: string;
  phrase: string;
  img: string;
};
type propsType = {
  children?: JSX.Element;
};
type ChallengeContextType = {
  challenge: Challenge | undefined;
};
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
export const ChallengeContext = createContext({} as ChallengeContextType);

export function ChallengeContextProvider(props: propsType) {
  const [challenge, setChallenge] = useState<Challenge>({
    points: "400",
    des: "É agora, bora lá. Caminhe por 3 minutos e estique suas pernas para você ficar saudável.",
    phrase: "Exercite-se",
    img: "https://cdn-icons-png.flaticon.com/512/684/684065.png",
  });
  const { seconds } = useTimer();
  const id = getRandomInt(1, 4);

  useEffect(() => {
    async function getChallenge(id: number) {
      const document = doc(database, "Challenges", String(id));
      const docSnap = await getDoc(document);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const challenge = {
          points: data.xp,
          des: data.description,
          phrase: data.effectPhrase,
          img: data.img,
        };
        if (seconds === 0) {
          setChallenge(challenge);
        }
      }
    }
    return () => {
      getChallenge(id);
    };
  }, [seconds, id]);

  return (
    <ChallengeContext.Provider value={{ challenge }}>
      {props.children}
    </ChallengeContext.Provider>
  );
}
