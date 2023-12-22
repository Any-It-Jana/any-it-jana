import React, { useEffect, useState } from "react";
import Text from "../components/atoms/Text";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/atoms/Button";
import UserStore from "../libs/store/UserStore";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const RecordPage = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { isLoggedIn, email } = UserStore();
  const dateKey = `${new Date().toISOString().slice(0, 16)}`;

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/");
  //   }
  // }, []);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startRecording = () => {
    SpeechRecognition.startListening({
      language: "ko-KR",
      continuous: true,
    });
    let t = 0;
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
      t += 1;
      if (t === 5) {
        SpeechRecognition.stopListening();
        clearInterval(timer);
        setIsFinished(true);
      }
    }, 1000);
  };
  const finishRecording = () => {};

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  return (
    <article className="record">
      <TranscriptWrapper>
        {transcript === "" ? (
          <Text color="white" fontSize={1.5}>
            오늘 하루는 어땠나요?
          </Text>
        ) : (
          <Text color="white">{transcript}</Text>
        )}
      </TranscriptWrapper>

      <Row visibility={isFinished ? "visible" : "hidden"}>
        <Button type="bg" color="white" onClick={finishRecording}>
          분석하기!
        </Button>
        <Button type="border" color="white" onClick={resetTranscript}>
          초기화
        </Button>
      </Row>

      <ProgessWrapper>
        <img
          style={{ cursor: "pointer" }}
          onClick={listening ? SpeechRecognition.stopListening : startRecording}
          src="/mic.svg"
          height={100}
          alt="mic"
        />
        <Text color="white" fontSize={1.5}>
          {isFinished
            ? listening
            : 1
            ? "마이크를 눌러 시작하세요!"
            : `${time}초`}
        </Text>
        <ProgressBarBackground>
          <ProgressBar width={`${(time * 100) / 60}%`} />
        </ProgressBarBackground>
      </ProgessWrapper>
    </article>
  );
};

const ProgessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 20px;
`;
const ProgressBarBackground = styled.div`
  width: 80dvw;
  height: 10px;
  border-radius: 5px;
  background-color: #eee;
`;
const ProgressBar = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  height: 10px;
  border-radius: 5px;
  background-color: #7fec7f;
`;
const Row = styled.div<{ visibility: string }>`
  display: flex;
  justify-content: center;
  gap: 10px;
  visibility: ${(props) => props.visibility};
`;
const TranscriptWrapper = styled.div`
  height: 300px;
  overflow: scroll;
  scrollbar-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default RecordPage;
