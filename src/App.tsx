import { useEffect, useRef, useState } from "react"
import { Game, LIMBO, Simon } from "./Games"

function App() {
  const [difficulty, setDifficulty] = useState(0)
  return <div style={{
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}><Timer></Timer>{difficulty ? <ActualApp difficulty={difficulty}></ActualApp> : <LogIn setLoggedIn={setDifficulty}></LogIn>}</div>
}

function timeString(n: number) {
  let h = Math.floor(n / 3600).toString()
  let m = Math.floor((n % 3600) / 60).toString()
  let s = Math.floor(n % 60).toString()
  if (h.length == 1) h = "0" + h;
  if (m.length == 1) m = "0" + m;
  if (s.length == 1) s = "0" + s;
  return h + ":" + m + ":" + s
}

function Timer() {
  const [time, setTime] = useState(2700)
  const [timerOn, setTimerOn] = useState(false)
  useEffect(() => {
    if (!timerOn) return;
    const interval = setInterval(() => {
      setTime(t => t - 1)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [timerOn])
  useEffect(() => {
    if (time == 0) setTimerOn(false)
  }, [time])
  return <div style={{
    position: "absolute",
    top: "5px",
    left: "5px",
    fontSize: "30px",
  }}>
    <p>{timeString(time)}</p>
    {timerOn ? <></> : <button onClick={() => {
      setTimerOn(true)
    }}>Aloita</button>}
  </div>
}

const opts = ["majakka", "01212"]

const vihje = "Vihje: Avain löytyy"

function Morse(props: { hard: boolean }) {
  return <>
    {
      props.hard ? <audio controls>
        <source src="Morseääni.wav"></source>
      </audio> :

        <div>-.-- -.- ... ..</div>
    }
  </>
}

function ActualApp(props: { difficulty: number }) {
  const limboRef = useRef<HTMLDialogElement | null>(null)
  const simonRef = useRef<HTMLDialogElement | null>(null)
  const [limboDone, setLimboDone] = useState(false)
  const [simonDone, setSimonDone] = useState(false)
  return <>

    <LIMBO n={props.difficulty == 2 ? 8 : 5} ref={limboRef} setComplete={() => {
      setLimboDone(true)
    }}></LIMBO>
    <Simon n={props.difficulty == 2 ? 8 : 5} ref={simonRef} setComplete={() => {
      setSimonDone(true)
    }}></Simon>
    <div id="pelivalikko">
      <button style={{
        backgroundColor: simonDone ? "green" : "red"
      }} onClick={() => {
        if (simonDone) return;
        simonRef.current?.showModal()
      }}>Muistipeli 1</button>
      <button style={{
        backgroundColor: limboDone ? "green" : "red"
      }} onClick={() => {
        if (limboDone) return;
        limboRef.current?.showModal()
      }}>Muistipeli 2</button>
      {simonDone && limboDone ? <p>{vihje}</p> : <></>}
      <Morse hard={props.difficulty == 2}></Morse>
    </div>
  </>
}

function LogIn({ setLoggedIn }: { setLoggedIn: (v: number) => void }) {
  const [val, setVal] = useState("");
  const [incorrect, setIncorrect] = useState(false)
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key != "Enter") return;
      if (val == opts[0]) { setLoggedIn(2); return; }
      if (val == opts[1]) { setLoggedIn(1); return; }
      setIncorrect(true)
      setVal("")
      setTimeout(() => {
        setIncorrect(false)
      }, 500)
    }
    document.addEventListener("keydown", listener)
    return () => {
      document.removeEventListener("keydown", listener)
    }
  }, [val])
  return <div style={{
    display: "flex",
    height: "200px",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
    fontSize: "32px"
  }}>
    <p>Syötä tunnussana ja paina Enter</p>
    <input style={{
      backgroundColor: incorrect ? "red" : "white",
      outline: "none",
      border: "2px solid black",
      height: "80px",
      width: "400px",
      borderRadius: "5px",
      fontSize: "32px",
      paddingLeft: "5px"
    }} value={val} onChange={(e) => setVal(e.target.value)}></input>
    {incorrect ? <p style={{ color: "red", }}>Väärä tunnussana</p> : <></>}
  </div>
}

export default App
