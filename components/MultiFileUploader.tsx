"use client"
import React, {useState} from "react";
import {GoogleGenerativeAI} from "@google/generative-ai"
import {useToast} from "@/components/ui/use-toast";
import Image from "next/image";
import {brands} from "@/brands";
import {Button} from "@/components/ui/button";
import {NEXT_PUBLIC_VISION_API_KEY, NEXT_PUBLIC_VISION_MODEL_NAME} from "@/components/constants";

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];
const parts = [
  {text: "input: if the image is sneaker or shoe, provide the brand, model and reference number that you found",},
  {text: "output: JSON object organized as follows {brand: brand, model: model, reference_number: reference_number}, if the image include shoes or Sneaker",},
  {text: `input: check if shoes model and brand matches one of the following array of brands ${JSON.stringify(brands)}, take the best match`},
  {text: "output: JSON object organized as follows {brand: brand, model: model, reference_number: reference_number}, if a model matches",},
  {text: "input: if the image does not include a shoe or sneaker, return what you have found in the image",},
  {text: "output: if the image does not include a shoes or sneaker, return JSON object organized as follows {brand: brand, model: model, reference_number: reference_number}",},
  {text: "output: do not use ```json",},
];

function MultiFileUploader() {
  const genAI = new GoogleGenerativeAI(NEXT_PUBLIC_VISION_API_KEY);
  const model = genAI.getGenerativeModel({ model: NEXT_PUBLIC_VISION_MODEL_NAME });
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>(
    "Slide your files here"
  );
  const [errorFile, setErrorFile] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<any>();
  const { toast } = useToast();

  const handleFileType = (f: any) => {
    const wrongType = f.map(
      (file: { type: string }) => !allowedTypes.includes(file.type)
    );

    return !!wrongType.includes(true);
  };

  const handleExistFile = (f: any) => {
    return f.map((file: { name: string }) =>
        files.filter((obj) => obj.name === file?.name)
    )[0].length > 0;
  };

  const handleDrop = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      if (handleExistFile(newFiles)) {
        setMessage("Fichier existe deja");
        setErrorFile(true);
      } else if (handleFileType(newFiles)) {
        setMessage("Type de ficher faux");
        setErrorFile(true);
      } else {
        setFiles([...files, ...newFiles]);
        setErrorFile(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorFile(false);
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      if (handleExistFile(newFiles)) {
        setMessage("Fichier existe deja");
        setErrorFile(true);
      } else if (handleFileType(newFiles)) {
        setMessage("Type de ficher faux");
        setErrorFile(true);
      } else {
        setFiles([...files, ...newFiles]);
        setErrorFile(false);
      }
    }
  };

  // Drag and drop state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorFile(false);
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDeleteFile = (fileToRemove: any) => {
    setFiles(files.filter((file) => file.name !== fileToRemove.name));
  };

  const handlePrediction = async () => {
    try {
      setPrediction("")
      toast({
        title: 'Prediction...',
        description: 'AI Model is predicting...',
        variant: "default"

      });
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = Buffer.from(reader.result as ArrayBuffer).toString("base64");
        const image = {
          inlineData: {
            data: base64String,
            mimeType: file.type,
          },
        };

        const result = await model.generateContent([...parts, image]);
        if (result.response) {
          setPrediction(result.response.text());
          toast({
            title: 'Success Prediction.',
            description: 'Prediction have been executed with success.',
            className: 'bg-green-200'
          });
        }
      };
      reader.onerror = (error) => {
        toast({
          title: 'Prediction Failed',
          description: `${error}`,
          variant: "destructive"
        });
      };
      reader.readAsArrayBuffer(file);
    } catch (e) {
      toast({
        title: 'Prediction Failed',
        description: `${e}`,
        className: 'bg-red-200'
      });
    }
  };


  return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 size-full">
        <div className="mb-4 flex w-full flex-1 flex-col items-center gap-2">
          <form
              id="form-file-upload"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onSubmit={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`${
                  dragActive
                      ? "border-green-800"
                      : errorFile
                          ? "border-red-500"
                          : "border-amber-500"
              } flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed`}
          >
            <input
                ref={inputRef}
                type="file"
                id="input-file-upload"
                multiple={false}
                onChange={handleChange}
                className="hidden"
            />
            <label
                id="label-file-upload"
                htmlFor="input-file-upload"
                className={`flex h-full w-full cursor-pointer flex-col items-center  justify-center rounded-lg p-2`}
            >
              <span className="mb-2 text-gray-400">{message}</span>
              <li
                  className={`mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500  to-amber-700 px-4 py-2 hover:from-amber-700 hover:to-amber-500`}
                  style={{boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.16)"}}
              >
                <span className="text-white">Telecharger un ficher</span>
              </li>
              <input
                  type="file"
                  onChange={handleChange}
                  name="upload-image"
                  className="h-0 w-0"
              />
            </label>
          </form>
          {files.length > 0 && (
              <ul className="grid w-full grid-cols-1 justify-around gap-4 lg:grid-cols-3">
                {files.map((file, index) => (
                    <li
                        key={index}
                        className="col-span-1 flex flex-col items-center justify-between gap-2 rounded-xl border border-gray-400 px-4 py-2"
                    >
                      <Image
                          key={index}
                          src={URL.createObjectURL(file)}
                          width={400}
                          height={300}
                          alt="Image_Selectionnee"
                          className="col-span-1 h-[200px] rounded-xl object-cover"
                      />
                      <Button onClick={() => handleDeleteFile(file)}>Delete</Button>
                    </li>
                ))}
              </ul>
          )}
        </div>
        <div className="flex w-full flex-1 items-center justify-between gap-2">
          <button type="button" onClick={handlePrediction}
                  className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">Predict
          </button>
          <div className="flex flex-col w-1/2 gap-4">
            <h4>Result</h4>
            {prediction && <p className="flex w-full flex-1 flex-col items-center justify-center bg-slate-300 text-black rounded-md p-4">{prediction}</p>}
          </div>
        </div>
      </main>

  );
}

export default MultiFileUploader;
