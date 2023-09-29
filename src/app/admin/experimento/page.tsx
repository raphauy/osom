"use client";

import { useRef } from "react";
import { useChat } from "ai/react";
import clsx from "clsx";
import { Bot, Loader, RefreshCcw, SendIcon, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LoadingSpinner, { LoadingSpinnerChico } from "@/components/loadingSpinner";
import Textarea from "react-textarea-autosize";
import { useRouter } from "next/navigation";

const examples = [
  "Hola",
];

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({});

  const disabled = isLoading || input.length === 0;

  return (
    <main className="flex flex-col items-center justify-between w-full pb-40">
      {messages.length > 0 ? (
        messages.map((message, i) => (
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-white" : "bg-gray-100",
            )}
          >
            <div className="flex items-start w-full max-w-screen-md px-5 space-x-4 sm:px-0">
              <div
                className={clsx(
                  "p-1.5 text-white",
                  message.role === "assistant" ? "bg-green-500" : "bg-black",
                )}
              >
                {message.role === "user" ? (
                  <User width={20} />
                ) : (
                  <Bot width={20} />
                )}
              </div>
              <ReactMarkdown
                className="w-full mt-1 prose break-words prose-p:leading-relaxed"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <div className="max-w-screen-md mx-5 mt-20 border rounded-md border-gray-200sm:mx-0 sm:w-full">
          <div className="flex flex-col space-y-4 p-7 sm:p-10">
            <h1 className="text-lg font-semibold text-black">
              Bienvenido!
            </h1>
            <p className="text-gray-500">
              Soy tu asistente social, puedes contarme lo que quieras.
            </p>
          </div>
          <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
            {examples.map((example, i) => (
              <button
                key={i}
                className="px-5 py-3 text-sm text-left text-gray-500 transition-all duration-75 bg-white border border-gray-200 rounded-md hover:border-black hover:text-gray-700 active:bg-gray-50"
                onClick={() => {
                  setInput(example);
                  inputRef.current?.focus();
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="fixed bottom-0 flex flex-col items-center w-full p-5 pb-3 space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md px-4 pt-3 pb-2 bg-white border border-gray-200 shadow-lg rounded-xl sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 focus:outline-none"
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-4 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-green-500 hover:bg-green-600",
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <Loader />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>
        <button
            className="right-0 block p-2 transition-all duration-75 bg-white rounded-full shadow-lg lg:fixed bottom-14 hover:bg-gray-100"            
            onClick={() => window.location.reload()}
          >
            <RefreshCcw size={15}/>
        </button>
        
        <p className="text-xs text-center text-gray-400">
          Creado por {" "}
          <a
            href="https://www.osomdigital.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >            
            Osom Digital
          </a>{" "}
          y{" "}
          <a
            href="https://rapha.uy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Raphael Carvalho
          </a>
          .
        </p>
      </div>

    </main>
  );
}
