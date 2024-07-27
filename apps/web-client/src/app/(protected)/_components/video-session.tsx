"use client";

import { MultiStepLoader } from "@/components/multi-step-loader";
import { TypewriterEffectSmooth } from "@/components/typewriter-effect";
import SessionImage from "@/lib/images/session.png";
import { useSocket } from "@/lib/providers/socket-provider";
import type { Word } from "@/lib/types";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@ui/components/ui/card";
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
import { EyeTracking } from "./eye-tracking";
import { FER } from "./fer";
import { Speech } from "./speech";

export default function VideoSession() {
  const [recording, setRecording] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [processing, setProcessing] = useState(false);
  const webcamRef = useRef<ReactWebcam>(null);
  const mediaRecorderRef = useRef<RecordRTC>(null);
  const { analytics, csv, setAnalytics } = useSocket();
  const { user } = useAuth();
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
    setProcessing(true);
    mediaRecorderRef.current.stopRecording(async () => {
      if (!mediaRecorderRef.current) return;
      const blob = mediaRecorderRef.current.getBlob();
      const duration = Date.now() - time;
      fixWebmDuration(blob, duration, async (seekableBlob) => {
        const file = createFileFromBlob(seekableBlob);
        const formData = new FormData();
        formData.append("files", file);
        // uploadFiles(formData);
        formData.append("user_id", user.id.toString());
        await processFile(formData);
        mediaRecorderRef.current?.destroy();
        webcamRef.current?.stream?.getTracks().forEach((track) => track.stop());
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
  useEffect(() => {
    if (analytics) {
      setProcessing(false);
    }
  }, [analytics]);
  return (
    <div className="bg-background relative w-full h-full flex flex-col items-center justify-center gap-3">
      {!analytics ? (
        <>
          {sessionStarted ? (
            <Card className="max-w-5xl m-auto p-3">
              <CardHeader className="px-3 py-0 flex flex-col gap-3">
                {!recording ? (
                  <>
                    <div className="h-20 bg-muted flex flex-row justify-center items-center rounded-xl">
                      <p className="text-sm text-muted-foreground text-center">
                        Please align your face to the <span className="text-primary">center</span> of your camera, and
                        click on <span className="text-primary">start recording</span>. A series of questions will be
                        asked, please click on <span className="text-primary">next</span> once you feel you have
                        answered the question to the best of your ability.
                      </p>
                    </div>
                    <div className="grid gap-3 grid-cols-2">
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
                      <Button onClick={() => startRecording(Date.now())}>Start Recording</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-20 bg-muted flex flex-row justify-center items-center rounded-xl">
                      <p className="font-semibold mr-3">AI: </p>
                      <TypewriterEffectSmooth
                        className="items-center my-0 pb-5"
                        words={words}
                        cursorClassName="!h-6 mt-2"
                      />
                    </div>
                    <div className="grid gap-3 grid-cols-3">
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
                      <Button
                        onClick={() => {
                          setRecording(false);
                          setCount(0);
                          setWords([]);
                          setAnalytics(undefined);
                          mediaRecorderRef.current?.reset();
                          startRecording(Date.now());
                          setProcessing(false);
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
                    </div>
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
        <section className="flex flex-col items-center gap-3">
          <div className="grid grid-cols-2 gap-3">
            <FER analytics={analytics.fer} csv={csv?.fer} />
            <Speech analytics={analytics.speech} csv={csv?.speech} />
            <EyeTracking analytics={analytics.eye_tracking} csv={csv?.eye_tracking} />
          </div>
          <Button
            onClick={() => {
              setAnalytics(undefined);
              setSessionStarted(false);
              setRecording(false);
              setCount(0);
              setWords([]);
              setProcessing(false);
            }}
            className="w-52"
          >
            New Session
          </Button>
        </section>
      )}
      {processing && (
        <div className="absolute inset-0 bg-background">
          <MultiStepLoader loadingStates={loadingStates} loading={processing} duration={2000} />
        </div>
      )}
    </div>
  );
}
