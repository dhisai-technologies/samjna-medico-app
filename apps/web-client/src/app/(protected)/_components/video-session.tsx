"use client";

import { MultiStepLoader } from "@/components/multi-step-loader";
import { TypewriterEffectSmooth } from "@/components/typewriter-effect";
import { uploadFiles } from "@/lib/actions";
import SessionImage from "@/lib/images/session.png";
import type { Word } from "@/lib/types";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@ui/components/ui/card";
import { useAuth } from "@ui/providers/auth-provider";
import { cn } from "@ui/utils";
import fixWebmDuration from "fix-webm-duration";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import RecordRTC from "recordrtc";
import { processFile } from "../_lib/actions";
import { loadingStates, questions } from "../_lib/config";
import { createFileFromBlob } from "../_lib/utils";

export default function VideoSession() {
  const [recording, setRecording] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [processing, setProcessing] = useState(true);
  const [recorded, setRecorded] = useState(false);
  const webcamRef = useRef<ReactWebcam>(null);
  const mediaRecorderRef = useRef<RecordRTC>(null);
  const { user } = useAuth();
  const [result, setResult] = useState<Record<string, unknown>>();
  const [startTime, setStartTime] = useState(0);

  const startRecording = (time: number) => {
    if (!webcamRef.current || !webcamRef.current.stream) return;
    setRecording(true);
    showNextQuestion(0);
    setCount((count) => count + 1);
    //@ts-ignore
    mediaRecorderRef.current = new RecordRTC(webcamRef.current.stream, {
      type: "video",
      mimeType: "video/webm",
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 1280000,
      bitsPerSecond: 1280000,
    });
    setStartTime(time);
    mediaRecorderRef.current.startRecording();
  };
  const saveRecording = (time: number) => {
    if (!mediaRecorderRef.current) return;
    setRecording(false);
    mediaRecorderRef.current.stopRecording(async () => {
      if (!mediaRecorderRef.current) return;
      const blob = mediaRecorderRef.current.getBlob();
      const duration = Date.now() - time;
      fixWebmDuration(blob, duration, async (seekableBlob) => {
        const file = createFileFromBlob(seekableBlob);
        const formData = new FormData();
        formData.append("files", file);
        uploadFiles(formData);
        formData.append("user_id", user.id.toString());
        await processFile(formData);
        setRecorded(true);
      });
    });
  };
  const showNextQuestion = (count: number) => {
    const current = questions[count];
    if (!current) return;
    setWords(current);
  };
  useEffect(() => {
    const text = words.map((word) => word.text).join(" ");
    if (text.length === 0) return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    if (synth.paused) {
      synth.resume();
    }
    synth.speak(utterance);
    return () => {
      synth.cancel();
    };
  }, [words]);

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.emit("join", user.id.toString());
  //   socket.on("result", (result: Record<string, unknown>) => {
  //     setResult(result);
  //     setProcessing(false);
  //   });
  // }, [socket, user]);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      {!recorded ? (
        <>
          {sessionStarted ? (
            <Card className="max-w-5xl m-auto p-3">
              <CardHeader className="px-3 py-0 h-20 bg-muted flex flex-row justify-center items-center rounded-xl">
                {!recording ? (
                  <>
                    <p className="text-sm text-muted-foreground text-center">
                      Please align your face to the <span className="text-primary">center</span> of your camera, and
                      click on <span className="text-primary">start recording</span>. A series of questions will be
                      asked, please click on <span className="text-primary">next</span> once you feel you have answered
                      the question to the best of your ability.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold mr-3">AI: </p>
                    <TypewriterEffectSmooth
                      className="items-center my-0 pb-5"
                      words={words}
                      cursorClassName="!h-6 mt-2"
                    />
                  </>
                )}
              </CardHeader>
              <CardContent className="pt-3 pb-0 px-0">
                <div className="min-w-[750px] w-full rounded-xl bg-muted">
                  <ReactWebcam
                    className="rounded-xl w-full"
                    ref={webcamRef}
                    audio={true}
                    videoConstraints={{
                      width: 1280,
                      height: 720,
                      facingMode: "user",
                    }}
                    muted={true}
                  />
                </div>
                <CardFooter className={cn("grid gap-3 p-0 pt-3", recording ? "grid-cols-3" : "grid-cols-2")}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setRecording(false);
                      setSessionStarted(false);
                      mediaRecorderRef.current?.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  {recording ? (
                    <>
                      <Button
                        onClick={() => {
                          setRecording(false);
                          mediaRecorderRef.current?.reset();
                          startRecording(Date.now());
                        }}
                        variant="outline"
                      >
                        Restart Recording
                      </Button>
                      {count === questions.length ? (
                        <Button onClick={() => saveRecording(startTime)}>Analyze</Button>
                      ) : (
                        <Button
                          onClick={() => {
                            showNextQuestion(count);
                            setCount((count) => count + 1);
                          }}
                        >
                          Next Question
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button onClick={() => startRecording(Date.now())}>Start Recording</Button>
                  )}
                </CardFooter>
              </CardContent>
            </Card>
          ) : (
            <>
              <Image src={SessionImage} alt="sesison" className="w-60 mb-10" />
              <Button onClick={() => setSessionStarted(true)} className="w-52">
                Start Session
              </Button>
              <p className="text-muted-foreground">or</p>
              <Link href="/storage" className={cn(buttonVariants({ variant: "outline" }), "w-52")}>
                Inference Existing
              </Link>
            </>
          )}
        </>
      ) : (
        <div>
          <p>Processing...</p>
          {result && <pre className="whitespace-pre-line">{JSON.stringify(result, null, 2)}</pre>}
          <MultiStepLoader loadingStates={loadingStates} loading={processing} duration={2000} />
        </div>
      )}
    </div>
  );
}
