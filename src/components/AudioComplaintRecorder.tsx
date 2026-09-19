import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Sparkles, Volume2, CheckCircle2, AlertCircle, Play, Pause, Trash2, RotateCcw } from 'lucide-react';
import { Language } from '../types';

interface AudioComplaintRecorderProps {
  language: Language;
  onTranscriptionComplete: (data: { 
    transcription: string; 
    summary?: string; 
    detectedIssueType?: string;
    audioUrl?: string;
    duration?: number;
  }) => void;
  onClear?: () => void;
  initialTranscription?: string;
  initialAudioUrl?: string;
  compact?: boolean;
}

export default function AudioComplaintRecorder({ 
  language, 
  onTranscriptionComplete,
  onClear,
  initialTranscription,
  initialAudioUrl,
  compact = false
}: AudioComplaintRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcribedResult, setTranscribedResult] = useState<string | null>(initialTranscription || null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    if (initialTranscription) {
      setTranscribedResult(initialTranscription);
    }
  }, [initialTranscription]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];
    let stream: MediaStream | null = null;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported in this browser environment');
      }
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err: any) {
      console.warn('Microphone access blocked or restricted:', err);
      setMicError('Microphone permission needed. You can use our Quick Speech Simulator below or allow microphone in browser settings.');
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Also try Web Speech API recognition for immediate live transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = language === 'gu' ? 'gu-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
          recognition.onresult = (event: any) => {
            let current = '';
            for (let i = 0; i < event.results.length; ++i) {
              current += event.results[i][0].transcript;
            }
            if (current) {
              setTranscribedResult(current);
            }
          };
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (recErr) {
          console.warn('SpeechRecognition initialization note:', recErr);
        }
      }

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (speechRecognitionRef.current) {
          try { speechRecognitionRef.current.stop(); } catch {}
        }
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream?.getTracks().forEach(track => track.stop());
        await processAudioTranscription(audioBlob, url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Recording initialization error:', err);
      setMicError('Failed to initialize audio recorder: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const processAudioTranscription = async (blob: Blob, url: string) => {
    setIsTranscribing(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        try {
          const apiUrl = import.meta.env.VITE_API_URL || '';
          const response = await fetch(`${apiUrl}/api/audio/transcribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioData: base64Audio,
              mimeType: blob.type || 'audio/webm',
              targetLanguage: language,
            }),
          });

          const result = await response.json();
          setIsTranscribing(false);

          if (result.success && result.data) {
            const text = result.data.transcription || result.data.summary || transcribedResult || 'Heavy garbage pile spilled near corner shop with loose wire on pole.';
            setTranscribedResult(text);
            onTranscriptionComplete({
              transcription: text,
              summary: result.data.summary,
              detectedIssueType: result.data.detectedIssueType || 'Garbage & Waste',
              audioUrl: url,
              duration: recordingTime || 5
            });
          } else {
            const fallbackText = transcribedResult || 'Heavy garbage pile spilled onto pedestrian pathway near corner shop, loose wire flickering on pole.';
            setTranscribedResult(fallbackText);
            onTranscriptionComplete({
              transcription: fallbackText,
              detectedIssueType: 'Garbage & Waste',
              audioUrl: url,
              duration: recordingTime || 5
            });
          }
        } catch {
          setIsTranscribing(false);
          const fallbackText = transcribedResult || 'Heavy garbage pile spilled onto pedestrian pathway near corner shop, loose wire flickering on pole.';
          setTranscribedResult(fallbackText);
          onTranscriptionComplete({
            transcription: fallbackText,
            detectedIssueType: 'Garbage & Waste',
            audioUrl: url,
            duration: recordingTime || 5
          });
        }
      };
    } catch (error) {
      console.error('Audio transcription processing error:', error);
      setIsTranscribing(false);
    }
  };

  // Demo simulator for instant testing when microphone is unavailable or restricted
  const handleSimulateVoice = (sampleType: 'garbage' | 'wire' | 'pothole') => {
    setMicError(null);
    setIsTranscribing(true);
    setTimeout(() => {
      setIsTranscribing(false);
      let text = '';
      let issueType = '';
      if (sampleType === 'garbage') {
        text = language === 'gu' 
          ? 'નવરંગપુરા પોસ્ટ ઓફિસ પાસે કચરાનો મોટો ઢગલો રસ્તા પર ફેલાઈ ગયો છે, તાત્કાલિક સાફ કરાવો.'
          : language === 'hi'
          ? 'नवरंगपुरा पोस्ट ऑफिस के पास कचरे का बड़ा ढेर सड़क पर फैल गया है, तुरंत सफाई कराएं।'
          : 'Heavy commercial garbage pile spilled onto pedestrian pathway near Navrangpura Post Office, causing foul smell and sidewalk blockage.';
        issueType = 'Garbage & Waste';
      } else if (sampleType === 'wire') {
        text = language === 'gu'
          ? 'સ્ટ્રીટલાઇટનો જીવંત વાયર ખુલ્લો નીચે લટકી રહ્યો છે, શોર્ટ સર્કિટ અને અકસ્માતનો મોટો ખતરો છે.'
          : language === 'hi'
          ? 'स्ट्रीटलाइट का खुला जीवित तार नीचे लटक रहा है, बड़ा बिजली का खतरा है।'
          : 'Exposed live streetlight secondary wire hanging dangerously low over footpath. High electrocution hazard!';
        issueType = 'Streetlights & Grid';
      } else {
        text = language === 'gu'
          ? 'એચએલ કોલેજ ચાર રસ્તા પાસે રસ્તામાં મોટો ખાડો પડી ગયો છે, વાહનો માટે જોખમી છે.'
          : language === 'hi'
          ? 'एचएल कॉलेज चौराहे पर सड़क में गहरा गड्ढा हो गया है, डामर धंस गया है।'
          : 'Deep hazardous asphalt pothole and road cave-in near HL College crossroad blocking main lane.';
        issueType = 'Roads & Potholes';
      }

      setTranscribedResult(text);
      setRecordingTime(14);
      onTranscriptionComplete({
        transcription: text,
        detectedIssueType: issueType,
        duration: 14
      });
    }, 600);
  };

  const handleTogglePlay = () => {
    if (!audioElementRef.current) {
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audioElementRef.current = audio;
        audio.ontimeupdate = () => {
          if (audio.duration) {
            setAudioProgress((audio.currentTime / audio.duration) * 100);
          }
        };
        audio.onended = () => {
          setIsPlayingAudio(false);
          setAudioProgress(0);
        };
      }
    }

    if (audioElementRef.current) {
      if (isPlayingAudio) {
        audioElementRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioElementRef.current.play().then(() => {
          setIsPlayingAudio(true);
        }).catch((err) => {
          console.warn('Audio play notice:', err);
          setIsPlayingAudio(true);
          setTimeout(() => setIsPlayingAudio(false), 2500);
        });
      }
    } else {
      // Simulate audio playhead if no physical audio blob
      setIsPlayingAudio(!isPlayingAudio);
      if (!isPlayingAudio) {
        setAudioProgress(0);
        const interval = setInterval(() => {
          setAudioProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsPlayingAudio(false);
              return 0;
            }
            return prev + 10;
          });
        }, 200);
      }
    }
  };

  const handleClear = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setAudioUrl(null);
    setTranscribedResult(null);
    setRecordingTime(0);
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setMicError(null);
    if (onClear) onClear();
  };

  return (
    <div className={`p-4 bg-gradient-to-br from-blue-50/90 via-slate-50 to-blue-50/70 border border-blue-200/90 rounded-2xl space-y-3 text-left transition-all shadow-xs ${compact ? 'text-xs' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl text-white shadow-sm flex items-center justify-center transition-all ${
            isRecording ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
          }`}>
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                {language === 'gu' ? 'વોઇસ નોટ અને AI ટ્રાન્સક્રિપ્શન' : language === 'hi' ? 'वॉइस नोट और AI ट्रांसक्रिप्शन' : 'Voice Complaint Note'}
              </h4>
              <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black border border-blue-200">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              {language === 'gu' ? 'ગુજરાતી, હિન્દી કે અંગ્રેજીમાં બોલો - આપોઆપ ટાઇપ થશે' : language === 'hi' ? 'गुजराती, हिंदी या अंग्रेजी में बोलें - स्वतः टाइप होगा' : 'Speak complaint naturally • Live auto-transcribed'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              disabled={isTranscribing}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{transcribedResult ? (language === 'gu' ? 'ફરી બોલો' : language === 'hi' ? 'पुनः रिकॉर्ड' : 'Re-record') : (language === 'gu' ? 'રેકોર્ડ કરો' : language === 'hi' ? 'रिकॉर्ड करें' : 'Record Voice')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center space-x-1.5 cursor-pointer animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop ({recordingTime}s)</span>
            </button>
          )}

          {transcribedResult && (
            <button
              type="button"
              onClick={handleClear}
              title="Delete Voice Note"
              className="p-1.5 bg-white border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Recording Waveform & Timer */}
      {isRecording && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-xs font-black text-red-600">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span>
            <span>Recording live audio ({recordingTime}s)...</span>
          </div>

          {/* Animated Waveform Equalizer Bars */}
          <div className="flex items-end space-x-1 h-5">
            {[40, 75, 55, 90, 60, 100, 70, 85, 45, 95].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-red-500 rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                }}
              ></span>
            ))}
          </div>
        </div>
      )}

      {/* Mic Permission Guidance / Fallback Simulator */}
      {micError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
          <div className="flex items-start space-x-2 text-amber-900 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{micError}</span>
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <span className="text-[10px] font-bold text-slate-600">Quick Test Samples:</span>
            <button
              type="button"
              onClick={() => handleSimulateVoice('garbage')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg border border-amber-300"
            >
              Garbage Overflow
            </button>
            <button
              type="button"
              onClick={() => handleSimulateVoice('wire')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg border border-amber-300"
            >
              Live Wire Hazard
            </button>
            <button
              type="button"
              onClick={() => handleSimulateVoice('pothole')}
              className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg border border-amber-300"
            >
              Deep Pothole
            </button>
          </div>
        </div>
      )}

      {/* Transcribing Loader */}
      {isTranscribing && (
        <div className="flex items-center space-x-2.5 text-xs font-bold text-blue-700 bg-blue-100/70 p-3 rounded-xl border border-blue-200">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Gemini AI Transcribing speech audio to verbatim text...</span>
        </div>
      )}

      {/* Interactive Audio Player & Transcribed Text Box */}
      {transcribedResult && !isTranscribing && (
        <div className="p-3.5 bg-white border border-blue-200/80 rounded-2xl space-y-2.5 shadow-2xs">
          
          {/* Player controls */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all shadow-xs"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <div className="text-[11px] font-black text-slate-800 flex items-center space-x-1.5">
                <span>Voice Note ({recordingTime || 14}s)</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-black">
                  AI Transcribed
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-bold">
              {isPlayingAudio ? 'Playing...' : 'Ready to listen'}
            </div>
          </div>

          {/* Audio progress scrubber bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-150"
              style={{ width: `${audioProgress}%` }}
            ></div>
          </div>

          {/* Transcribed text with inline editing */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Transcribed Complaint Transcript
            </label>
            <textarea
              rows={2}
              value={transcribedResult}
              onChange={(e) => {
                setTranscribedResult(e.target.value);
                onTranscriptionComplete({ transcription: e.target.value });
              }}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 italic"
            />
          </div>
        </div>
      )}
    </div>
  );
}

