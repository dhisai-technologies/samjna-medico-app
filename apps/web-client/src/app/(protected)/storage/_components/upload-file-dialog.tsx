"use client";
import { uploadFiles } from "@/lib/actions";
import { getErrorMessage } from "@ui-utils/helpers";
import { FileUploader } from "@ui/components/file-uploader";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function UploadFileDialog() {
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload files</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>Drag and drop your files here or click to browse.</DialogDescription>
        </DialogHeader>
        <FileUploader maxFiles={5} maxSize={1000 * 1024 * 1024} onValueChange={setFiles} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={files.length === 0}
            onClick={() => {
              const formData = new FormData();
              files.forEach((file) => {
                formData.append("files", file);
              });
              toast.promise(uploadFiles(formData), {
                loading: "Uploading files...",
                success: () => {
                  setOpen(false);
                  return "Files uploaded successfully";
                },
                error: (res) => {
                  setOpen(false);
                  return getErrorMessage(res);
                },
              });
            }}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
