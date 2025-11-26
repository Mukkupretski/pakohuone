import { useEffect, useRef, useState, type ReactNode } from "react";

interface GameProps {
  setComplete: () => void;
  ref: React.RefObject<HTMLDialogElement | null>;
}

export function Game({ ref, children }: { children: ReactNode, ref: React.RefObject<HTMLDialogElement | null> }) {
  return <dialog ref={ref} style={{
    position: "absolute",
    left: "20vw",
    top: "20vh",
    height: "60vh",
    width: "60vw",
  }}><div style={{
    paddingTop: "50px",
    gap: "5px",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  }}>{children}</div></dialog>
}

function GetSequence(n: number) {
  const res: number[] = []
  for (let i = 0; i < n; i++) {
    res.push(Math.floor(Math.random() * 4))
  }
  return res;
}

interface SimonProps extends GameProps {
  n: number;
}

const colors: string[][] = [
  ["#ff0000",
    "#990000",],
  ["#ffff00",
    "#b9b900",],
  ["#00ff00",
    "#009900",],
  ["#0000ff",
    "#0099ff",],

]

export function Simon(props: SimonProps) {
  const [playing, setPlaying] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [sequence, setSequence] = useState<number[]>([])
  const [lvl, setLvl] = useState(1);
  const [i, setI] = useState(0);
  const [states, setStates] = useState([false, false, false, false])
  const blinkI = (index: number, time: number) => {
    setTimeout(() => {
      setStates(sts => sts.map((v, idx) => {
        if (idx != index) return v;
        return true;
      }))
    }, time)
    setTimeout(() => {
      setStates(sts => sts.map((v, idx) => {
        if (idx != index) return v;
        return false;
      }))
    }, time + 400)
  }
  const playSequence = () => {
    console.log(sequence)
    for (let j = 0; j < lvl; j++) {
      blinkI(sequence[j], j * 500)
    }
  }
  const resetSequence = () => {
    setSequence(GetSequence(props.n))
  }
  const startPlaying = () => {
    console.log("start")
    resetSequence();
    setPlaying(true);
    setWrong(false);
    setLvl(1);
    setI(0);
  }
  useEffect(() => {
    playSequence()
  }, [sequence, lvl])
  return <Game ref={props.ref}> <div style={{
    display: "grid",
    gridTemplateColumns: "100px 100px",
    gridTemplateRows: "100px 100px",
    gap: "10px",
  }}>
    {states.map((st, idx) => {
      return <div onClick={() => {
        if (!playing) return;
        console.log(sequence)
        console.log("Index", i, "Correct", sequence[i], "Guess", idx)
        if (sequence[i] == idx) {
          if (i == lvl - 1) {
            if (lvl == props.n) {
              props.setComplete();
              props.ref.current?.close();
            } else {
              console.log("Play again")
              setI(0)
              setLvl(level => level + 1);
            }
          } else {
            setI(index => index + 1)
          }
        } else {
          setWrong(true)
          setPlaying(false)
        }
      }} style={{
        backgroundColor: st ? colors[idx][0] : colors[idx][1],
        cursor: "pointer"
      }}></div>
    })}

  </div>
    <p style={{ fontSize: "24px" }}>{i}/{lvl}</p>
    {wrong ? <p style={{ fontSize: "24px", color: "red" }}>Väärin</p> : <></>}{playing ? <></> : <button onClick={() => startPlaying()} style={{
      border: "none",
      outline: "none",
      padding: "10px",
      fontSize: "24px",
      backgroundColor: "#ffdd00",
      borderRadius: "10px",
      marginTop: "50px",
    }}>Pelaa</button>}</Game>
}

type RotationMove = {
  rotate: number;
}

type MovingMove = {
  order: number[]
}

type Move = MovingMove | RotationMove;

const options: Move[] = [
  { rotate: -1 },
  { rotate: 1 },
  { order: [1, 0, 3, 2, 5, 4, 7, 6] },
  { order: [5, 4, 7, 6, 1, 0, 3, 2] },
  { order: [4, 5, 6, 7, 0, 1, 2, 3] },
  { order: [3, 2, 1, 0, 7, 6, 5, 4] },
  { order: [1, 0, 3, 2, 5, 4, 7, 6] },
  { order: [4, 5, 6, 7, 0, 1, 2, 3] },
]

function GenerateMoves(n: number) {
  const res: Move[] = [];
  for (let i = 0; i < n; i++) {
    res.push(options[Math.floor(Math.random() * options.length)])
  }
  return res;
}

export function LIMBO(props: SimonProps) {
  const [playing, setPlaying] = useState(false)
  const [choose, setChoose] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [showCorrect, setShowCorrect] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [mapping, setMapping] = useState([0, 1, 2, 3, 4, 5, 6, 7]);
  const [rotation, setRotation] = useState(0)
  const [moves, setMoves] = useState<Move[]>([])
  const startPlaying = () => {
    setMoves(GenerateMoves(props.n))
    setPlaying((true))
    setWrong(false)
    setMapping([0, 1, 2, 3, 4, 5, 6, 7])
    setRotation(0)
    setChoose(false)
    setCorrect(Math.floor(Math.random() * 8))
  }
  useEffect(() => {
    console.log("here")
    if (moves.length == 0) return;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        setShowCorrect(i % 2 == 0)
        console.log(i % 2)
      }, 500 + i * 150)
    }
    moves.forEach((m, i) => {
      setTimeout(() => {
        if ("order" in m) {
          setMapping(prevMap => prevMap.map(prev => m.order[prev]))
        } else {
          setRotation(r => r + m.rotate)
        }
      }, i * 800 + 1500)
    })
    setTimeout(() => {
      setChoose(true)
    }, props.n * 800 + 1500)
  }, [moves])
  return <Game ref={props.ref}>
    <div style={{ position: "absolute", top: "150px", backgroundColor: "red", rotate: `${rotation * 180}deg`, transition: "rotate 0.5s ease" }} >{mapping.map((target, i) => {
      return <div onClick={() => {
        if (!choose) return;
        if (i == correct) {
          props.setComplete()
          props.ref.current?.close();
        }
        else {
          setWrong(true)
          setPlaying(false)
          setChoose(false)
        }
      }} key={i} style={{
        position: "absolute",
        transition: "top 0.5s ease, left 0.5s ease",
        top: `${Math.floor(target / 4) * 100 - 50 - 37.5}px`,
        left: `${(target % 4) * 100 - 150 - 40}px`,
        width: "75px",
        height: "80px",
        background: (i == correct && showCorrect) ? "red" : "none",
        cursor: choose ? "pointer" : "none"
      }}><img src="sasilogo.png"></img></div>
    })}</div>
    {playing ? <></> : <button onClick={() => startPlaying()} style={{
      border: "none",
      outline: "none",
      padding: "10px",
      fontSize: "24px",
      backgroundColor: "#ffdd00",
      borderRadius: "10px",
      marginTop: "50px",
      position: "relative",
      top: "250px",
    }}>Pelaa</button>}
    {choose ? <p style={{ fontSize: "24px", marginTop: "300px" }}>Valitse alkuperäinen</p> : <></>}
    {wrong ? <p style={{ fontSize: "24px", color: "red", marginTop: "300px" }}>Väärin</p> : <></>}
    <p style={{
      position: "relative",
      marginTop: "auto"
    }}>Kukkuu!</p>
  </Game>
}
